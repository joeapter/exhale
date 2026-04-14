import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { put } from "@vercel/blob";

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

    const blob = await put(`packages/${Date.now()}-${file.name}`, file, {
      access: "public",
      contentType: file.type,
    });

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
