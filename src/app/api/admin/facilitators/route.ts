import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  title: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  bio: z.string().min(1),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const facilitators = await prisma.facilitator.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(facilitators);
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = schema.parse(body);

    const facilitator = await prisma.facilitator.create({ data });
    return NextResponse.json(facilitator, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0]?.message }, { status: 400 });
    }
    console.error("Create facilitator error:", err);
    return NextResponse.json({ error: "Failed to create." }, { status: 500 });
  }
}
