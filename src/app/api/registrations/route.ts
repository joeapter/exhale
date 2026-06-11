import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createPaymentToken, releaseExpiredInventoryHolds } from "@/lib/payment-links";
import { revalidateRetreatPages } from "@/lib/retreat-cache";
import { generateConfirmationRef } from "@/lib/utils";
import { isStripeConfigured } from "@/lib/stripe";

const HOLD_MINUTES = 60;
const TERMS_VERSION = "2026-06-balance-due-at-retreat-end";

const registrationSchema = z.object({
  retreatId: z.string().min(1),
  packageId: z.string().min(1),
  paymentType: z.enum(["DEPOSIT", "FULL"]).default("DEPOSIT"),
  termsAccepted: z.literal(true),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  email: z.string().trim().email(),
  phone: z.string().trim().optional(),
  dateOfBirth: z.string().optional(),
  dietaryNeeds: z.string().trim().optional(),
  healthNotes: z.string().trim().optional(),
  roomingPref: z.enum(["SOLO", "WITH_FRIEND", "NO_PREFERENCE"]),
  friendName: z.string().trim().optional(),
  additionalNotes: z.string().trim().optional(),
  emergencyName: z.string().trim().min(1),
  emergencyPhone: z.string().trim().min(1),
  emergencyRel: z.string().trim().optional(),
});

export async function POST(req: NextRequest) {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json(
        { error: "Online registration is temporarily unavailable. Please contact EXHALE." },
        { status: 503 }
      );
    }
    await releaseExpiredInventoryHolds();
    const data = registrationSchema.parse(await req.json());
    const now = new Date();

    const pkg = await prisma.retreatPackage.findFirst({
      where: {
        id: data.packageId,
        retreatId: data.retreatId,
        isActive: true,
        available: { gt: 0 },
        retreat: {
          status: "PUBLISHED",
          startDate: { gt: now },
          spotsRemaining: { gt: 0 },
        },
      },
      select: {
        id: true,
        name: true,
        fullPrice: true,
        depositAmount: true,
        retreat: { select: { slug: true } },
      },
    });

    if (!pkg) {
      return NextResponse.json(
        { error: "This retreat or accommodation is no longer available." },
        { status: 400 }
      );
    }

    const holdExpiresAt = new Date(now.getTime() + HOLD_MINUTES * 60 * 1000);
    const paymentToken = createPaymentToken();
    const confirmationRef = generateConfirmationRef();
    const paymentAmount =
      data.paymentType === "DEPOSIT" ? pkg.depositAmount : pkg.fullPrice;
    const additionalNotes = [
      data.additionalNotes,
      data.roomingPref === "WITH_FRIEND" && data.friendName
        ? `Roommate request: ${data.friendName}`
        : undefined,
    ]
      .filter(Boolean)
      .join("\n");

    await prisma.$transaction(
      async (tx) => {
        const retreatUpdate = await tx.retreat.updateMany({
          where: {
            id: data.retreatId,
            status: "PUBLISHED",
            startDate: { gt: now },
            spotsRemaining: { gt: 0 },
          },
          data: { spotsRemaining: { decrement: 1 } },
        });
        const packageUpdate = await tx.retreatPackage.updateMany({
          where: {
            id: data.packageId,
            retreatId: data.retreatId,
            isActive: true,
            available: { gt: 0 },
          },
          data: { available: { decrement: 1 } },
        });

        if (retreatUpdate.count !== 1 || packageUpdate.count !== 1) {
          throw new Error("INVENTORY_UNAVAILABLE");
        }

        const registration = await tx.registration.create({
          data: {
            retreatId: data.retreatId,
            packageId: data.packageId,
            status: "PENDING",
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone || undefined,
            dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
            dietaryNeeds: data.dietaryNeeds || undefined,
            healthNotes: data.healthNotes || undefined,
            roomingPref: data.roomingPref,
            additionalNotes: additionalNotes || undefined,
            emergencyName: data.emergencyName,
            emergencyPhone: data.emergencyPhone,
            emergencyRel: data.emergencyRel || undefined,
            paymentType: data.paymentType,
            amountDue: pkg.fullPrice,
            confirmationRef,
            inventoryStatus: "HELD",
            holdExpiresAt,
            termsAcceptedAt: now,
            termsVersion: TERMS_VERSION,
          },
        });

        await tx.paymentLink.create({
          data: {
            token: paymentToken,
            registrationId: registration.id,
            kind: data.paymentType,
            amount: paymentAmount,
            expiresAt: holdExpiresAt,
          },
        });
      },
      { isolationLevel: "Serializable" }
    );

    revalidateRetreatPages(pkg.retreat.slug);
    return NextResponse.json({ paymentUrl: `/pay/${paymentToken}` });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Please fill in all required fields and accept the payment terms." },
        { status: 400 }
      );
    }
    if (err instanceof Error && err.message === "INVENTORY_UNAVAILABLE") {
      return NextResponse.json(
        { error: "That accommodation was just reserved. Please choose another option." },
        { status: 409 }
      );
    }
    console.error("Registration error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
