import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { syncRetreatToStripe } from "@/lib/stripe-catalog";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await syncRetreatToStripe(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Stripe catalog sync failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Stripe sync failed." },
      { status: 500 }
    );
  }
}
