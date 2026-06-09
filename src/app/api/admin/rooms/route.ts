import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const retreatId = req.nextUrl.searchParams.get("retreatId");
  if (!retreatId) return NextResponse.json({ error: "retreatId required" }, { status: 400 });

  const [rooms, unassigned] = await Promise.all([
    prisma.room.findMany({
      where: { retreatId },
      orderBy: { sortOrder: "asc" },
      include: {
        registrations: {
          where: { status: { in: ["CONFIRMED", "PENDING"] } },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            roomingPref: true,
            status: true,
            package: { select: { name: true } },
          },
          orderBy: { lastName: "asc" },
        },
      },
    }),
    prisma.registration.findMany({
      where: {
        retreatId,
        roomId: null,
        status: { in: ["CONFIRMED", "PENDING"] },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        roomingPref: true,
        status: true,
        package: { select: { name: true } },
      },
      orderBy: { lastName: "asc" },
    }),
  ]);

  return NextResponse.json({ rooms, unassigned });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { retreatId, name, capacity } = body;

  if (!retreatId || !name?.trim() || !capacity) {
    return NextResponse.json({ error: "retreatId, name, capacity required" }, { status: 400 });
  }

  const count = await prisma.room.count({ where: { retreatId } });
  const room = await prisma.room.create({
    data: {
      retreatId,
      name: name.trim(),
      capacity: Number(capacity),
      sortOrder: count,
    },
    include: {
      registrations: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          roomingPref: true,
          status: true,
          package: { select: { name: true } },
        },
      },
    },
  });

  return NextResponse.json(room);
}
