import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { createOneTimePaymentLink, getOutstandingBalance } from "@/lib/payment-links";
import { prisma } from "@/lib/prisma";
import { getSiteUrl, isStripeConfigured } from "@/lib/stripe";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe is not configured for this environment." },
      { status: 503 }
    );
  }

  try {
    const { id } = await params;
    const registration = await prisma.registration.findUnique({
      where: { id },
      select: {
        id: true,
        amountDue: true,
        amountPaid: true,
        isStaff: true,
        status: true,
      },
    });
    if (!registration) {
      return NextResponse.json({ error: "Registration not found." }, { status: 404 });
    }
    if (registration.isStaff || ["CANCELED", "REFUNDED"].includes(registration.status)) {
      return NextResponse.json({ error: "This registration cannot accept payment." }, { status: 400 });
    }

    const amount = getOutstandingBalance(registration.amountDue, registration.amountPaid);
    if (amount <= 0) {
      return NextResponse.json({ error: "This registration is paid in full." }, { status: 400 });
    }

    const link = await createOneTimePaymentLink({
      registrationId: id,
      kind: "BALANCE",
      amount,
      createdById: session.id,
    });
    return NextResponse.json({
      url: `${getSiteUrl()}/pay/${link.token}`,
      expiresAt: link.expiresAt,
      amount: link.amount,
    });
  } catch (err) {
    console.error("Create balance link error:", err);
    return NextResponse.json({ error: "Unable to create payment link." }, { status: 500 });
  }
}
