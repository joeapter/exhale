import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
      select: { id: true },
    });

    if (!registration) {
      return NextResponse.json({ error: "Registration not found." }, { status: 404 });
    }

    await prisma.registration.update({
      where: { id },
      data: { isStaff: true, status: "CONFIRMED" },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Mark staff error:", err);
    return NextResponse.json({ error: "Failed to mark as staff." }, { status: 500 });
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
      select: { id: true },
    });

    if (!registration) {
      return NextResponse.json({ error: "Registration not found." }, { status: 404 });
    }

    await prisma.registration.update({
      where: { id },
      data: { isStaff: false },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unmark staff error:", err);
    return NextResponse.json({ error: "Failed to remove staff flag." }, { status: 500 });
  }
}
