import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);

  if (searchParams.get("export") === "csv") {
    const subscribers = await prisma.mailingListSubscriber.findMany({
      orderBy: { createdAt: "desc" },
    });

    const rows = [
      ["First Name", "Email", "Source", "Date"],
      ...subscribers.map((s) => [
        s.firstName ?? "",
        s.email,
        s.source ?? "",
        s.createdAt.toISOString().slice(0, 10),
      ]),
    ];

    const csv = rows.map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(",")).join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
