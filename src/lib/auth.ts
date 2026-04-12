import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET ?? "exhale-dev-secret-change-in-production"
);

export interface AdminSession {
  id: string;
  email: string;
  role: string;
}

export async function signAdminToken(payload: AdminSession): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyAdminToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AdminSession;
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("exhale_admin_token")?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export async function requireAdminSession(req?: NextRequest): Promise<AdminSession | null> {
  return getAdminSession();
}
