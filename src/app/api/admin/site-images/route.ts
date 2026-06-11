import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { IMAGE_SLOTS } from "@/lib/site-images";

export async function GET() {
  const rows = await prisma.siteContent.findMany({
    where: { type: "IMAGE_URL" },
    select: { key: true, value: true },
  });
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return NextResponse.json(map);
}

export async function PUT(req: Request) {
  const body: { key: string; url: string } = await req.json();
  const slot = IMAGE_SLOTS.find((s) => s.key === body.key);
  if (!slot) {
    return NextResponse.json({ error: "Unknown image key" }, { status: 400 });
  }

  await prisma.siteContent.upsert({
    where: { key: body.key },
    update: { value: body.url },
    create: {
      key: body.key,
      label: slot.label,
      value: body.url,
      type: "IMAGE_URL",
    },
  });

  revalidatePath("/", "layout");
  revalidatePath("/retreat");
  revalidatePath("/retreats");

  return NextResponse.json({ ok: true });
}
