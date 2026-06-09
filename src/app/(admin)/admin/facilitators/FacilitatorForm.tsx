"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type FacilitatorFormProps = {
  facilitator?: {
    id: string;
    name: string;
    title: string | null;
    image: string | null;
    bio: string;
    isActive: boolean;
    sortOrder: number;
  };
};

export default function FacilitatorForm({ facilitator }: FacilitatorFormProps) {
  const router = useRouter();
  const isEdit = !!facilitator;

  const [name, setName] = useState(facilitator?.name ?? "");
  const [title, setTitle] = useState(facilitator?.title ?? "");
  const [image, setImage] = useState(facilitator?.image ?? "");
  const [bio, setBio] = useState(facilitator?.bio ?? "");
  const [isActive, setIsActive] = useState(facilitator?.isActive ?? true);
  const [sortOrder, setSortOrder] = useState(facilitator?.sortOrder ?? 0);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fileRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed.");
      setImage(json.url);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !bio.trim()) {
      setError("Name and bio are required.");
      return;
    }
    setSaving(true);
    setError("");

    const payload = {
      name: name.trim(),
      title: title.trim() || null,
      image: image.trim() || null,
      bio: bio.trim(),
      isActive,
      sortOrder,
    };

    try {
      const url = isEdit
        ? `/api/admin/facilitators/${facilitator.id}`
        : "/api/admin/facilitators";
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to save.");
      router.push("/admin/facilitators");
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  const fieldLabel: React.CSSProperties = {
    fontFamily: "Jost",
    fontWeight: 400,
    fontSize: "0.75rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: "var(--color-taupe-light)",
    display: "block",
    marginBottom: "0.4rem",
  };

  const fieldInput: React.CSSProperties = {
    width: "100%",
    fontFamily: "Jost",
    fontWeight: 300,
    fontSize: "0.9375rem",
    color: "var(--color-espresso)",
    background: "#FAF7F2",
    border: "1px solid rgba(228,216,201,0.9)",
    borderRadius: 0,
    padding: "0.625rem 0.875rem",
    outline: "none",
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {/* Name */}
      <div>
        <label style={fieldLabel}>Name *</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Malka"
          required
          style={fieldInput}
        />
      </div>

      {/* Title / tagline */}
      <div>
        <label style={fieldLabel}>Title / Tagline</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. The Natural Touch 🌾"
          style={fieldInput}
        />
      </div>

      {/* Image */}
      <div>
        <label style={fieldLabel}>Photo</label>
        <div className="flex items-start gap-4">
          {image && (
            <div className="relative shrink-0" style={{ width: 80, height: 80 }}>
              <Image
                src={image}
                alt="Facilitator"
                fill
                className="object-cover"
                style={{ borderRadius: "0.375rem" }}
              />
              <button
                type="button"
                onClick={() => setImage("")}
                className="absolute -top-2 -right-2 flex items-center justify-center"
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "#3D2E22",
                  color: "#FAF7F2",
                  fontSize: "0.65rem",
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>
          )}
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              style={{
                fontFamily: "Jost",
                fontWeight: 300,
                fontSize: "0.8125rem",
                color: "var(--color-taupe)",
                border: "1px solid rgba(228,216,201,0.9)",
                background: "#FAF7F2",
                padding: "0.5rem 1rem",
                cursor: uploading ? "not-allowed" : "pointer",
              }}
            >
              {uploading ? "Uploading…" : image ? "Replace photo" : "Upload photo"}
            </button>
            <p style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.75rem", color: "var(--color-taupe-light)", marginTop: "0.375rem" }}>
              JPG or PNG, max 8 MB. Square crop works best.
            </p>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div>
        <label style={fieldLabel}>Bio *</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={8}
          required
          style={{ ...fieldInput, resize: "vertical" }}
        />
      </div>

      {/* Sort order + active */}
      <div className="flex items-center gap-8">
        <div>
          <label style={fieldLabel}>Sort Order</label>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            style={{ ...fieldInput, width: 80 }}
          />
        </div>
        <div className="flex items-center gap-3 pt-5">
          <input
            id="isActive"
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            style={{ accentColor: "var(--color-clay)", width: 16, height: 16 }}
          />
          <label
            htmlFor="isActive"
            style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.875rem", color: "var(--color-taupe)", cursor: "pointer" }}
          >
            Visible on site
          </label>
        </div>
      </div>

      {error && (
        <p style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.875rem", color: "#c0392b" }}>
          {error}
        </p>
      )}

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={saving || uploading}
          style={{
            fontFamily: "Jost",
            fontWeight: 400,
            fontSize: "0.8125rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            background: "var(--color-espresso)",
            color: "#FAF7F2",
            padding: "0.75rem 2rem",
            border: "none",
            cursor: saving || uploading ? "not-allowed" : "pointer",
            opacity: saving || uploading ? 0.6 : 1,
          }}
        >
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Facilitator"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/facilitators")}
          style={{
            fontFamily: "Jost",
            fontWeight: 300,
            fontSize: "0.8125rem",
            color: "var(--color-taupe-light)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
