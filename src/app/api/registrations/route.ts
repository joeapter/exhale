import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateConfirmationRef } from "@/lib/utils";
import { z } from "zod";

const registrationSchema = z.object({
  retreatId: z.string(),
  packageId: z.string(),
  paymentType: z.enum(["DEPOSIT", "FULL"]),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  dietaryNeeds: z.string().optional(),
  healthNotes: z.string().optional(),
  roomingPref: z.enum(["SOLO", "WITH_FRIEND", "NO_PREFERENCE"]),
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

    const amountDue = data.paymentType === "DEPOSIT" ? pkg.depositAmount : pkg.fullPrice;
    const confirmationRef = generateConfirmationRef();

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
        additionalNotes: data.additionalNotes,
        emergencyName: data.emergencyName,
        emergencyPhone: data.emergencyPhone,
        emergencyRel: data.emergencyRel,
        paymentType: data.paymentType,
        amountDue,
        confirmationRef,
      },
    });

    // If Stripe is not configured, return the confirmation directly
    if (!process.env.STRIPE_SECRET_KEY) {
      await prisma.registration.update({
        where: { id: registration.id },
        data: { status: "CONFIRMED", confirmedAt: new Date() },
      });
      return NextResponse.json({
        checkoutUrl: `/register/confirmation?ref=${confirmationRef}`,
      });
    }

    // Create Stripe checkout session
    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-03-25.dahlia",
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "ils",
            product_data: {
              name: `${retreat.title} — ${pkg.name}`,
              description:
                data.paymentType === "DEPOSIT"
                  ? "Deposit (balance due 30 days before retreat)"
                  : "Full payment",
            },
            unit_amount: amountDue,
          },
          quantity: 1,
        },
      ],
      customer_email: data.email,
      metadata: { registrationId: registration.id, confirmationRef },
      success_url: `${process.env.NEXT_PUBLIC_URL}/register/confirmation?ref=${confirmationRef}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/register/${retreat.slug}?canceled=1`,
    });

    await prisma.registration.update({
      where: { id: registration.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
    }
    console.error("Registration error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
