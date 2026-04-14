import { NextRequest, NextResponse } from "next/server";
import { sendContactNotification } from "@/lib/email";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().optional(),
  message: z.string().min(10),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    await sendContactNotification(data);

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
