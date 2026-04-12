import { NextRequest, NextResponse } from "next/server";

// Stripe webhook — configure STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET to activate.
// See README for setup instructions.

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Stripe is not configured. See README." },
      { status: 503 }
    );
  }

  const { default: handler } = await import("./_handler");
  return handler(req);
}
