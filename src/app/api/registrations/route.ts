import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateConfirmationRef } from "@/lib/utils";
import { sendRegistrationConfirmation, sendRegistrationNotification } from "@/lib/email";
import { z } from "zod";

const registrationSchema = z.object({
  retreatId: z.string(),
  packageId: z.string(),
  paymentType: z.enum(["DEPOSIT", "FULL"]).optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  dietaryNeeds: z.string().optional(),
  healthNotes: z.string().optional(),
  roomingPref: z.enum(["SOLO", "WITH_FRIEND", "NO_PREFERENCE"]),
  friendName: z.string().optional(),
  additionalNotes: z.string().optional(),
  emergencyName: z.string().min(1),
  emergencyPhone: z.string().min(1),
  emergencyRel: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = registrationSchema.parse(body);

    const retreat = await prisma.retreat.findUnique({ where: { id: data.retreatId } });

    if (!retreat || retreat.status === "SOLD_OUT" || retreat.status === "CANCELED") {
      return NextResponse.json({ error: "This retreat is no longer available." }, { status: 400 });
    }

    if (retreat.spotsRemaining < 1) {
      return NextResponse.json({ error: "This retreat is fully booked." }, { status: 400 });
    }

    const pkg = await prisma.retreatPackage.findUnique({ where: { id: data.packageId } });

    if (!pkg || pkg.available < 1) {
      return NextResponse.json({ error: "This package is no longer available." }, { status: 400 });
    }

    const paymentType = "DEPOSIT" as const;
    const amountDue = pkg.depositAmount;
    const confirmationRef = generateConfirmationRef();
    const additionalNotes = [
      data.additionalNotes?.trim(),
      data.roomingPref === "WITH_FRIEND" && data.friendName?.trim()
        ? `Roommate request: ${data.friendName.trim()}`
        : undefined,
    ]
      .filter(Boolean)
      .join("\n");

    const registration = await prisma.registration.create({
      data: {
        retreatId: data.retreatId,
        packageId: data.packageId,
        status: "PENDING",
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        dietaryNeeds: data.dietaryNeeds,
        healthNotes: data.healthNotes,
        roomingPref: data.roomingPref,
        additionalNotes: additionalNotes || undefined,
        emergencyName: data.emergencyName,
        emergencyPhone: data.emergencyPhone,
        emergencyRel: data.emergencyRel,
        paymentType,
        amountDue,
        confirmationRef,
      },
    });

    // Hold the place pending deposit payment.
    await prisma.retreat.update({
      where: { id: data.retreatId },
      data: { spotsRemaining: { decrement: 1 } },
    });

    // Send emails (non-blocking — don't fail the registration if email fails)
    const emailData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      packageName: pkg.name,
      paymentType,
      amountDue,
      confirmationRef,
      roomingPref: data.roomingPref,
      friendName: data.friendName?.trim(),
      dietaryNeeds: data.dietaryNeeds,
      healthNotes: data.healthNotes,
      additionalNotes: additionalNotes || undefined,
      emergencyName: data.emergencyName,
      emergencyPhone: data.emergencyPhone,
      emergencyRel: data.emergencyRel,
    };
    Promise.all([
      sendRegistrationConfirmation(emailData),
      sendRegistrationNotification(emailData),
    ]).catch((err) => console.error("Email send error:", err));

    return NextResponse.json({
      checkoutUrl: `/register/confirmation?ref=${confirmationRef}`,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
    }
    console.error("Registration error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
