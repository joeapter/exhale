import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const packageSchema = z.object({
  name: z.string().min(1),
  fullPrice: z.number().int().positive(),
  depositAmount: z.number().int().positive(),
  capacity: z.number().int().positive(),
  available: z.number().int().min(0),
  sortOrder: z.number().int().default(0),
});

const schema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  tagline: z.string().optional(),
  overview: z.string().min(1),
  location: z.string().min(1),
  locationDetail: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  capacity: z.number().int().positive(),
  spotsRemaining: z.number().int().min(0),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  packages: z.array(packageSchema).optional(),
});

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const data = schema.parse(body);

    const retreat = await prisma.retreat.create({
      data: {
        title: data.title,
        slug: data.slug,
        tagline: data.tagline,
        overview: data.overview,
        location: data.location,
        locationDetail: data.locationDetail,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        capacity: data.capacity,
        spotsRemaining: data.spotsRemaining,
        status: data.status,
        inclusions: [],
        exclusions: [],
        ...(data.packages?.length
          ? { packages: { create: data.packages } }
          : {}),
      },
    });

    return NextResponse.json({ id: retreat.id });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data: " + err.issues[0]?.message }, { status: 400 });
    }
    console.error("Create retreat error:", err);
    return NextResponse.json({ error: "Failed to create retreat." }, { status: 500 });
  }
}
