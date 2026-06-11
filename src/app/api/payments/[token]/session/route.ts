import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createCheckoutSessionForPaymentLink } from "@/lib/payment-links";
import { prisma } from "@/lib/prisma";

const schema = z.object({ currency: z.enum(["ILS", "USD"]) });

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const { currency } = schema.parse(await req.json());
    const session = await createCheckoutSessionForPaymentLink(token, currency);
    const link = await prisma.paymentLink.findUniqueOrThrow({
      where: { token },
      select: {
        amount: true,
        chargedAmount: true,
        chargedCurrency: true,
        exchangeRate: true,
        exchangeRateSource: true,
        exchangeRateQuotedAt: true,
      },
    });

    return NextResponse.json({
      clientSecret: session.client_secret,
      ...link,
      exchangeRate: link.exchangeRate?.toString() ?? null,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Choose ILS or USD." }, { status: 400 });
    }
    console.error("Create payment session error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unable to prepare payment." },
      { status: 400 }
    );
  }
}
