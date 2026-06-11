import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { SiteTheme } from "@/lib/site-settings";

export async function GET() {
  const setting = await prisma.siteSettings.findUnique({
    where: { key: "theme" },
  });
  const theme: SiteTheme = setting?.value === "forest" ? "forest" : "desert";
  return NextResponse.json({ theme });
}

export async function PUT(req: Request) {
  const body = await req.json();
  const theme: SiteTheme = body.theme === "forest" ? "forest" : "desert";

  await prisma.siteSettings.upsert({
    where: { key: "theme" },
    update: { value: theme },
    create: { key: "theme", value: theme },
  });

  revalidatePath("/", "layout");
  revalidatePath("/retreat");
  revalidatePath("/retreats");
  revalidatePath("/retreats/[slug]", "page");

  return NextResponse.json({ theme });
}
