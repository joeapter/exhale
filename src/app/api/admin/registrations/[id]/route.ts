import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
        retreatId: true,
      },
    });

    if (!registration) {
      return NextResponse.json(
        { error: "Registration not found." },
        { status: 404 }
      );
    }

    await prisma.$transaction(async (tx) => {
      const retreat = await tx.retreat.findUnique({
        where: { id: registration.retreatId },
        select: {
          id: true,
          spotsRemaining: true,
          capacity: true,
          status: true,
        },
      });

      await tx.payment.deleteMany({
        where: { registrationId: registration.id },
      });

      await tx.registration.delete({
        where: { id: registration.id },
      });

      if (retreat && retreat.spotsRemaining < retreat.capacity) {
        await tx.retreat.update({
          where: { id: retreat.id },
          data: {
            spotsRemaining: { increment: 1 },
            ...(retreat.status === "SOLD_OUT" ? { status: "PUBLISHED" as const } : {}),
          },
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete registration error:", err);
    return NextResponse.json(
      { error: "Failed to delete registration." },
      { status: 500 }
    );
  }
}
