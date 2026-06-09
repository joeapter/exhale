import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
  source: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());

    await prisma.mailingListSubscriber.upsert({
      where: { email: body.email.toLowerCase() },
      update: {
        firstName: body.firstName || undefined,
        source: body.source || undefined,
      },
      create: {
        email: body.email.toLowerCase(),
        firstName: body.firstName || null,
        source: body.source || "website",
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    console.error("Mailing list signup error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
