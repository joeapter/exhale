import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { name, capacity } = await req.json();

  const room = await prisma.room.update({
    where: { id },
    data: { name: name?.trim(), capacity: Number(capacity) },
  });

  return NextResponse.json(room);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  await prisma.registration.updateMany({
    where: { roomId: id },
    data: { roomId: null },
  });
  await prisma.room.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
