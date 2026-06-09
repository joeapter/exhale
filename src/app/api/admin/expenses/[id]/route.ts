import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const patchSchema = z.object({
  description: z.string().min(1).optional(),
  amount: z.number().int().positive().optional(),
  category: z.string().nullable().optional(),
  date: z.string().optional(),
  retreatId: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const body = patchSchema.parse(await req.json());

    const expense = await prisma.expense.update({
      where: { id },
      data: {
        ...(body.description !== undefined && { description: body.description }),
        ...(body.amount !== undefined && { amount: body.amount }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.date !== undefined && { date: new Date(body.date) }),
        ...(body.retreatId !== undefined && { retreatId: body.retreatId }),
        ...(body.notes !== undefined && { notes: body.notes }),
      },
    });

    return NextResponse.json({ success: true, expense });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data." }, { status: 400 });
    }
    console.error("Update expense error:", err);
    return NextResponse.json({ error: "Failed to update expense." }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    await prisma.expense.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete expense error:", err);
    return NextResponse.json({ error: "Failed to delete expense." }, { status: 500 });
  }
}
