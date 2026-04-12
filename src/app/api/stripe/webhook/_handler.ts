import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-03-25.dahlia",
  });

  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const registrationId = session.metadata?.registrationId;

    if (!registrationId) {
      return NextResponse.json({ error: "No registration ID" }, { status: 400 });
    }

    const amountPaid = session.amount_total ?? 0;

    const registration = await prisma.registration.update({
      where: { id: registrationId },
      data: { status: "CONFIRMED", confirmedAt: new Date(), amountPaid, stripeSessionId: session.id },
      include: { retreat: true, package: true },
    });

    await prisma.payment.create({
      data: {
        registrationId,
        status: "PAID",
        method: "STRIPE",
        amount: amountPaid,
        currency: session.currency?.toUpperCase() ?? "ILS",
        stripeSessionId: session.id,
        stripePaymentId: session.payment_intent as string,
        paidAt: new Date(),
      },
    });

    await prisma.$transaction([
      prisma.retreat.update({ where: { id: registration.retreatId }, data: { spotsRemaining: { decrement: 1 } } }),
      ...(registration.packageId
        ? [prisma.retreatPackage.update({ where: { id: registration.packageId }, data: { available: { decrement: 1 } } })]
        : []),
    ]);

    const updatedRetreat = await prisma.retreat.findUnique({ where: { id: registration.retreatId } });
    if (updatedRetreat && updatedRetreat.spotsRemaining <= 0) {
      await prisma.retreat.update({ where: { id: registration.retreatId }, data: { status: "SOLD_OUT" } });
    }
  }

  return NextResponse.json({ received: true });
}
