import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { expirePaymentLink, fulfillCheckoutSession } from "@/lib/payment-links";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export default async function handler(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook is not configured." }, { status: 503 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  try {
    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      await fulfillCheckoutSession(event.data.object);
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data.object;
      const link = await prisma.paymentLink.findFirst({
        where: {
          OR: [
            { stripeSessionId: session.id },
            ...(session.metadata?.paymentLinkId
              ? [{ id: session.metadata.paymentLinkId }]
              : []),
          ],
        },
        select: { id: true },
      });
      if (link) await expirePaymentLink(link.id);
    }
  } catch (err) {
    console.error(`Stripe webhook ${event.id} failed:`, err);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
