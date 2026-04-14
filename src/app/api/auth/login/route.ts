import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signAdminToken } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = schema.parse(body);

    // Try DB first
    try {
      const admin = await prisma.adminUser.findUnique({ where: { email } });
      if (admin) {
        const valid = await bcrypt.compare(password, admin.password);
        if (!valid) {
          return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
        }
        const token = await signAdminToken({ id: admin.id, email: admin.email, role: admin.role });
        const response = NextResponse.json({ success: true });
        response.cookies.set("exhale_admin_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });
        return response;
      }
    } catch {
      // DB unavailable — fall through to env var check
    }

    // Fallback: env var credentials
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminEmail || !adminPasswordHash || email !== adminEmail) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, adminPasswordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const token = await signAdminToken({ id: "admin", email: adminEmail, role: "SUPER_ADMIN" });
    const response = NextResponse.json({ success: true });
    response.cookies.set("exhale_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response;
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
    }
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}
