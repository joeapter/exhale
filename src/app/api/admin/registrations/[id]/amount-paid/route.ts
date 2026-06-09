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

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const { amountPaid } = body as { amountPaid: unknown };

  if (typeof amountPaid !== "number" || !Number.isInteger(amountPaid) || amountPaid < 0) {
    return NextResponse.json({ error: "amountPaid must be a non-negative integer (agorot)." }, { status: 400 });
  }

  try {
    const registration = await prisma.registration.findUnique({
      where: { id },
      select: { id: true, amountDue: true },
    });

    if (!registration) {
      return NextResponse.json({ error: "Registration not found." }, { status: 404 });
    }

    await prisma.registration.update({
      where: { id },
      data: { amountPaid },
    });

    return NextResponse.json({ success: true, amountPaid });
  } catch (err) {
    console.error("Update amount paid error:", err);
    return NextResponse.json({ error: "Failed to update amount paid." }, { status: 500 });
  }
}
