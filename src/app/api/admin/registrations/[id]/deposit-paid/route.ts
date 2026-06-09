import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ADMIN_DEPOSIT_PAID_NOTE = "Marked as deposit paid from admin reservations list.";

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
        paymentType: true,
        amountDue: true,
        amountPaid: true,
        package: { select: { depositAmount: true } },
      },
    });

    if (!registration) {
      return NextResponse.json(
        { error: "Registration not found." },
        { status: 404 }
      );
    }

    if (registration.paymentType !== "DEPOSIT") {
      return NextResponse.json(
        { error: "Only deposit registrations can be marked deposit paid." },
        { status: 400 }
      );
    }

    // Use the package's deposit amount, not the full amountDue
    const depositAmount = registration.package?.depositAmount ?? registration.amountDue;
    const newAmountPaid = Math.max(registration.amountPaid, depositAmount);
    const paymentToAdd = newAmountPaid - registration.amountPaid;

    await prisma.$transaction(async (tx) => {
      await tx.registration.update({
        where: { id: registration.id },
        data: {
          status: "CONFIRMED",
          confirmedAt: new Date(),
          amountPaid: newAmountPaid,
        },
      });

      if (paymentToAdd > 0) {
        await tx.payment.create({
          data: {
            registrationId: registration.id,
            status: "PAID",
            method: "OTHER",
            amount: paymentToAdd,
            notes: ADMIN_DEPOSIT_PAID_NOTE,
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

export async function DELETE(
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
        paymentType: true,
        amountPaid: true,
      },
    });

    if (!registration) {
      return NextResponse.json(
        { error: "Registration not found." },
        { status: 404 }
      );
    }

    if (registration.paymentType !== "DEPOSIT") {
      return NextResponse.json(
        { error: "Only deposit registrations can be marked unpaid." },
        { status: 400 }
      );
    }

    const adminPayment = await prisma.payment.findFirst({
      where: {
        registrationId: id,
        method: "OTHER",
        status: "PAID",
        notes: ADMIN_DEPOSIT_PAID_NOTE,
      },
      select: { id: true, amount: true },
    });

    if (!adminPayment) {
      return NextResponse.json(
        { error: "No admin deposit payment record found." },
        { status: 404 }
      );
    }

    const restoredAmountPaid = Math.max(registration.amountPaid - adminPayment.amount, 0);

    await prisma.$transaction(async (tx) => {
      await tx.payment.delete({ where: { id: adminPayment.id } });
      await tx.registration.update({
        where: { id: registration.id },
        data: {
          status: "PENDING",
          confirmedAt: null,
          amountPaid: restoredAmountPaid,
        },
      });
    });

    return NextResponse.json({ success: true, status: "PENDING" });
  } catch (err) {
    console.error("Mark deposit unpaid error:", err);
    return NextResponse.json(
      { error: "Failed to mark deposit as unpaid." },
      { status: 500 }
    );
  }
}
