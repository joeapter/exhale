import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cancelOpenBalancePaymentLinks } from "@/lib/payment-links";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const { amountDue } = body as { amountDue: unknown };

  if (typeof amountDue !== "number" || !Number.isInteger(amountDue) || amountDue < 0) {
    return NextResponse.json({ error: "amountDue must be a non-negative integer (agorot)." }, { status: 400 });
  }

  try {
    const registration = await prisma.registration.findUnique({
      where: { id },
      select: { id: true, amountPaid: true },
    });

    if (!registration) {
      return NextResponse.json({ error: "Registration not found." }, { status: 404 });
    }
    if (amountDue < registration.amountPaid) {
      return NextResponse.json(
        { error: "Amount due cannot be lower than the amount already paid." },
        { status: 400 }
      );
    }

    await cancelOpenBalancePaymentLinks(id);
    await prisma.registration.update({
      where: { id },
      data: { amountDue },
    });

    return NextResponse.json({ success: true, amountDue });
  } catch (err) {
    console.error("Update amount due error:", err);
    return NextResponse.json({ error: "Failed to update amount." }, { status: 500 });
  }
}
