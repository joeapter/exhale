import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { put } from "@vercel/blob";

function safeFilename(name: string) {
  const trimmed = name.trim();
  const ext = trimmed.includes(".") ? trimmed.split(".").pop()?.toLowerCase() : "jpg";
  const base = trimmed.replace(/\.[^/.]+$/, "");
  const slug = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return `${slug || "image"}.${ext || "jpg"}`;
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file) return NextResponse.json({ error: "No file provided." }, { status: 400 });

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image." }, { status: 400 });
    }

    // Max 8 MB
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: "File must be under 8 MB." }, { status: 400 });
    }

    const filename = safeFilename(file.name);
    const blob = await put(`packages/${Date.now()}-${filename}`, file, {
      access: "public",
      contentType: file.type,
    });

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
