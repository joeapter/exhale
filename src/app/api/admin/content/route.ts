import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body: Record<string, string> = await req.json();

    await Promise.all(
      Object.entries(body).map(([key, value]) =>
        prisma.siteContent.update({ where: { key }, data: { value } })
      )
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Content save error:", err);
    return NextResponse.json({ error: "Failed to save." }, { status: 500 });
  }
}
