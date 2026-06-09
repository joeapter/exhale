import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { roomId } = await req.json();

  const registration = await prisma.registration.update({
    where: { id },
    data: { roomId: roomId ?? null },
    select: { id: true, roomId: true },
  });

  return NextResponse.json(registration);
}
