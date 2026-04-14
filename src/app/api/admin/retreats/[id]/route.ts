import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const packageSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  occupancy: z.string().nullable().optional(),
  images: z.array(z.string()).default([]),
  fullPrice: z.number().int().min(0),
  depositAmount: z.number().int().min(0),
  capacity: z.number().int().min(1),
  available: z.number().int().min(0),
});

const schema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  tagline: z.string().nullable().optional(),
  overview: z.string().min(1),
  location: z.string().min(1),
  locationDetail: z.string().nullable().optional(),
  startDate: z.string(),
  endDate: z.string(),
  capacity: z.number().int().positive(),
  spotsRemaining: z.number().int().min(0),
  status: z.enum(["DRAFT", "PUBLISHED", "SOLD_OUT", "COMPLETED", "CANCELED"]),
  inclusions: z.array(z.string()).default([]),
  exclusions: z.array(z.string()).default([]),
  accommodations: z.string().nullable().optional(),
  dining: z.string().nullable().optional(),
  packages: z.array(packageSchema).optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const body = await req.json();
    const data = schema.parse(body);

    await prisma.retreat.update({
      where: { id },
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
        inclusions: data.inclusions,
        exclusions: data.exclusions,
        accommodations: data.accommodations,
        dining: data.dining,
      },
    });

    // Update packages individually
    if (data.packages) {
      for (const pkg of data.packages) {
        await prisma.retreatPackage.update({
          where: { id: pkg.id },
          data: {
            name: pkg.name,
            description: pkg.description,
            occupancy: pkg.occupancy,
            images: pkg.images,
            fullPrice: pkg.fullPrice,
            depositAmount: pkg.depositAmount,
            capacity: pkg.capacity,
            available: pkg.available,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data: " + err.issues[0]?.message }, { status: 400 });
    }
    console.error("Update retreat error:", err);
    return NextResponse.json({ error: "Failed to save." }, { status: 500 });
  }
}
