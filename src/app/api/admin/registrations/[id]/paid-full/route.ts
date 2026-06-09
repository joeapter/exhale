import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ADMIN_PAID_FULL_NOTE = "Marked as paid in full from admin.";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const registration = await prisma.registration.findUnique({
      where: { id },
      select: { id: true, status: true, amountDue: true, amountPaid: true, isStaff: true },
    });

    if (!registration) {
      return NextResponse.json({ error: "Registration not found." }, { status: 404 });
    }

    if (registration.isStaff) {
      return NextResponse.json({ error: "Staff registrations have no payment." }, { status: 400 });
    }

    const remaining = registration.amountDue - registration.amountPaid;

    if (remaining <= 0) {
      return NextResponse.json({ error: "Registration is already paid in full." }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.registration.update({
        where: { id },
        data: { status: "CONFIRMED", confirmedAt: new Date(), amountPaid: registration.amountDue },
      });

      await tx.payment.create({
        data: {
          registrationId: id,
          status: "PAID",
          method: "OTHER",
          amount: remaining,
          notes: ADMIN_PAID_FULL_NOTE,
          paidAt: new Date(),
        },
      });
    });

    return NextResponse.json({ success: true, status: "CONFIRMED" });
  } catch (err) {
    console.error("Mark paid full error:", err);
    return NextResponse.json({ error: "Failed to mark as paid in full." }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const registration = await prisma.registration.findUnique({
      where: { id },
      select: { id: true, amountPaid: true },
    });

    if (!registration) {
      return NextResponse.json({ error: "Registration not found." }, { status: 404 });
    }

    const adminPayment = await prisma.payment.findFirst({
      where: { registrationId: id, notes: ADMIN_PAID_FULL_NOTE, status: "PAID" },
      select: { id: true, amount: true },
    });

    if (!adminPayment) {
      return NextResponse.json({ error: "No admin paid-full record found." }, { status: 404 });
    }

    const restoredAmountPaid = registration.amountPaid - adminPayment.amount;

    await prisma.$transaction(async (tx) => {
      await tx.payment.delete({ where: { id: adminPayment.id } });
      await tx.registration.update({
        where: { id },
        data: {
          amountPaid: Math.max(restoredAmountPaid, 0),
          status: "PENDING",
          confirmedAt: null,
        },
      });
    });

    return NextResponse.json({ success: true, status: "PENDING" });
  } catch (err) {
    console.error("Undo paid full error:", err);
    return NextResponse.json({ error: "Failed to undo paid in full." }, { status: 500 });
  }
}
