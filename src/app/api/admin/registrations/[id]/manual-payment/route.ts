import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import { recordManualPayment } from "@/lib/payment-links";

const schema = z.object({
  amount: z.number().int().positive(),
  method: z.enum(["BANK_TRANSFER", "BIT", "CASH", "OTHER"]),
  notes: z.string().trim().max(500).optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const data = schema.parse(await req.json());
    await recordManualPayment({ registrationId: id, ...data });
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Enter a valid payment." }, { status: 400 });
    }
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unable to record payment." },
      { status: 400 }
    );
  }
}
