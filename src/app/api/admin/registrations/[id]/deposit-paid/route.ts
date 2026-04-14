import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const registration = await prisma.registration.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        amountDue: true,
        amountPaid: true,
      },
    });

    if (!registration) {
      return NextResponse.json(
        { error: "Registration not found." },
        { status: 404 }
      );
    }

    const amountRemaining = Math.max(
      registration.amountDue - registration.amountPaid,
      0
    );

    await prisma.$transaction(async (tx) => {
      await tx.registration.update({
        where: { id: registration.id },
        data: {
          status: "CONFIRMED",
          confirmedAt: new Date(),
          amountPaid: registration.amountDue,
        },
      });

      if (amountRemaining > 0) {
        await tx.payment.create({
          data: {
            registrationId: registration.id,
            status: "PAID",
            method: "OTHER",
            amount: amountRemaining,
            notes: "Marked as deposit paid from admin reservations list.",
            paidAt: new Date(),
          },
        });
      }
    });

    return NextResponse.json({ success: true, status: "CONFIRMED" });
  } catch (err) {
    console.error("Mark deposit paid error:", err);
    return NextResponse.json(
      { error: "Failed to mark deposit as paid." },
      { status: 500 }
    );
  }
}
