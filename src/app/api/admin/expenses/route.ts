import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSchema = z.object({
  description: z.string().min(1),
  amount: z.number().int().positive(),
  category: z.string().nullable().optional(),
  date: z.string(),
  retreatId: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = createSchema.parse(await req.json());

    const expense = await prisma.expense.create({
      data: {
        description: body.description,
        amount: body.amount,
        category: body.category || null,
        date: new Date(body.date),
        retreatId: body.retreatId || null,
        notes: body.notes || null,
      },
    });

    return NextResponse.json({ success: true, expense });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data." }, { status: 400 });
    }
    console.error("Create expense error:", err);
    return NextResponse.json({ error: "Failed to create expense." }, { status: 500 });
  }
}
