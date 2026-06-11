import { NextResponse } from "next/server";
import { fulfillCheckoutSession } from "@/lib/payment-links";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const link = await prisma.paymentLink.findUnique({
      where: { token },
      select: { stripeSessionId: true, status: true },
    });
    if (!link?.stripeSessionId) {
      return NextResponse.json({ paid: false });
    }
    if (link.status === "PAID") {
      return NextResponse.json({ paid: true });
    }

    const session = await getStripe().checkout.sessions.retrieve(link.stripeSessionId);
    await fulfillCheckoutSession(session);
    return NextResponse.json({ paid: session.payment_status === "paid" });
  } catch (err) {
    console.error("Sync payment error:", err);
    return NextResponse.json({ error: "Unable to verify payment." }, { status: 500 });
  }
}
