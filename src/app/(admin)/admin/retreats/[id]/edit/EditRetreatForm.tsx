"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

const inputStyle = {
  fontFamily: "Jost",
  fontWeight: 300,
  fontSize: "0.9375rem",
  background: "transparent",
  border: "none",
  borderBottom: "1px solid rgba(184,144,128,0.45)",
  color: "var(--color-espresso)",
  padding: "0.5rem 0",
  width: "100%",
  outline: "none",
};

const labelStyle = {
  fontFamily: "Jost",
  fontWeight: 400,
  fontSize: "0.7rem",
  letterSpacing: "0.16em",
  textTransform: "uppercase" as const,
  color: "var(--color-taupe-light)",
  display: "block",
  marginBottom: "0.25rem",
};

const textareaStyle = {
  ...inputStyle,
  borderBottom: "none",
  border: "1px solid rgba(184,144,128,0.45)",
  padding: "0.5rem 0.625rem",
  resize: "vertical" as const,
  minHeight: "80px",
};

type Package = {
  id: string;
  name: string;
  description: string | null;
  occupancy: string | null;
  images: string[];
  fullPrice: number;
  depositAmount: number;
  capacity: number;
  available: number;
  sortOrder: number;
};

type Retreat = {
  id: string;
  title: string;
  slug: string;
  tagline: string | null;
  overview: string;
  location: string;
  locationDetail: string | null;
  startDate: string;
  endDate: string;
  capacity: number;
  spotsRemaining: number;
  status: string;
  inclusions: string[];
  exclusions: string[];
  accommodations: string | null;
  dining: string | null;
  packages: Package[];
};

export default function EditRetreatForm({ retreat }: { retreat: Retreat }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const [form, setForm] = useState({
    title: retreat.title,
    slug: retreat.slug,
    tagline: retreat.tagline ?? "",
    overview: retreat.overview,
    location: retreat.location,
    locationDetail: retreat.locationDetail ?? "",
    startDate: retreat.startDate.slice(0, 10),
    endDate: retreat.endDate.slice(0, 10),
    capacity: String(retreat.capacity),
    spotsRemaining: String(retreat.spotsRemaining),
    status: retreat.status,
    inclusions: retreat.inclusions.join("\n"),
    exclusions: retreat.exclusions.join("\n"),
    accommodations: retreat.accommodations ?? "",
    dining: retreat.dining ?? "",
  });

  const [packages, setPackages] = useState<Package[]>(
    retreat.packages.map((p) => ({ ...p, images: p.images ?? [] }))
  );

  function set(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function setPkg(id: string, key: keyof Package, value: unknown) {
    setPackages((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        if (key === "fullPrice" || key === "depositAmount" || key === "capacity" || key === "available" || key === "sortOrder") {
          return { ...p, [key]: parseInt(value as string) || 0 };
        }
        return { ...p, [key]: value };
      })
    );
    setSaved(false);
  }

  async function uploadImage(pkgId: string, file: File) {
    setUploadingFor(pkgId);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      setPackages((prev) =>
        prev.map((p) =>
          p.id === pkgId ? { ...p, images: [...p.images, url] } : p
        )
      );
      setSaved(false);
    } catch {
      setError("Image upload failed. Please try again.");
    } finally {
      setUploadingFor(null);
    }
  }

  function removeImage(pkgId: string, url: string) {
    setPackages((prev) =>
      prev.map((p) =>
        p.id === pkgId ? { ...p, images: p.images.filter((i) => i !== url) } : p
      )
    );
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch(`/api/admin/retreats/${retreat.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          slug: form.slug,
          tagline: form.tagline || null,
          overview: form.overview,
          location: form.location,
          locationDetail: form.locationDetail || null,
          startDate: form.startDate,
          endDate: form.endDate,
          capacity: parseInt(form.capacity),
          spotsRemaining: parseInt(form.spotsRemaining),
          status: form.status,
          inclusions: form.inclusions.split("\n").map((s) => s.trim()).filter(Boolean),
          exclusions: form.exclusions.split("\n").map((s) => s.trim()).filter(Boolean),
          accommodations: form.accommodations || null,
          dining: form.dining || null,
          packages: packages.map((p) => ({
            id: p.id,
            name: p.name,
            description: p.description || null,
            occupancy: p.occupancy || null,
            images: p.images,
            fullPrice: p.fullPrice,
            depositAmount: p.depositAmount,
            capacity: p.capacity,
            available: p.available,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to save.");
      }

      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const fieldClass = "flex flex-col gap-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic info */}
      <section>
        <p className="label-sm text-[#9B8F84] mb-5">Basic Info</p>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className={fieldClass}>
            <label style={labelStyle}>Title *</label>
            <input style={inputStyle} required value={form.title} onChange={(e) => set("title", e.target.value)} />
          </div>
          <div className={fieldClass}>
            <label style={labelStyle}>Slug *</label>
            <input style={inputStyle} required value={form.slug} onChange={(e) => set("slug", e.target.value)} />
          </div>
          <div className={`${fieldClass} sm:col-span-2`}>
            <label style={labelStyle}>Tagline</label>
            <input style={inputStyle} value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
          </div>
          <div className={`${fieldClass} sm:col-span-2`}>
            <label style={labelStyle}>Overview *</label>
            <textarea style={textareaStyle} required value={form.overview} onChange={(e) => set("overview", e.target.value)} rows={4} />
          </div>
        </div>
      </section>

      {/* Location & Dates */}
      <section>
        <p className="label-sm text-[#9B8F84] mb-5">Location & Dates</p>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className={fieldClass}>
            <label style={labelStyle}>Location *</label>
            <input style={inputStyle} required value={form.location} onChange={(e) => set("location", e.target.value)} />
          </div>
          <div className={fieldClass}>
            <label style={labelStyle}>Location Detail</label>
            <input style={inputStyle} value={form.locationDetail} onChange={(e) => set("locationDetail", e.target.value)} />
          </div>
          <div className={fieldClass}>
            <label style={labelStyle}>Start Date *</label>
            <input style={inputStyle} type="date" required value={form.startDate} onChange={(e) => set("startDate", e.target.value)} />
          </div>
          <div className={fieldClass}>
            <label style={labelStyle}>End Date *</label>
            <input style={inputStyle} type="date" required value={form.endDate} onChange={(e) => set("endDate", e.target.value)} />
          </div>
          <div className={fieldClass}>
            <label style={labelStyle}>Total Capacity</label>
            <input style={inputStyle} type="number" min="1" value={form.capacity} onChange={(e) => set("capacity", e.target.value)} />
          </div>
          <div className={fieldClass}>
            <label style={labelStyle}>Spots Remaining</label>
            <input style={inputStyle} type="number" min="0" value={form.spotsRemaining} onChange={(e) => set("spotsRemaining", e.target.value)} />
          </div>
          <div className={fieldClass}>
            <label style={labelStyle}>Status</label>
            <select style={{ ...inputStyle, cursor: "pointer" }} value={form.status} onChange={(e) => set("status", e.target.value)}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="SOLD_OUT">Sold Out</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELED">Canceled</option>
            </select>
          </div>
        </div>
      </section>

      {/* Inclusions */}
      <section>
        <p className="label-sm text-[#9B8F84] mb-5">Inclusions & Details</p>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className={`${fieldClass} sm:col-span-2`}>
            <label style={labelStyle}>Inclusions (one per line)</label>
            <textarea style={textareaStyle} value={form.inclusions} onChange={(e) => set("inclusions", e.target.value)} rows={5} />
          </div>
          <div className={`${fieldClass} sm:col-span-2`}>
            <label style={labelStyle}>Exclusions (one per line)</label>
            <textarea style={textareaStyle} value={form.exclusions} onChange={(e) => set("exclusions", e.target.value)} rows={3} />
          </div>
          <div className={`${fieldClass} sm:col-span-2`}>
            <label style={labelStyle}>Accommodations</label>
            <textarea style={textareaStyle} value={form.accommodations} onChange={(e) => set("accommodations", e.target.value)} rows={3} />
          </div>
          <div className={`${fieldClass} sm:col-span-2`}>
            <label style={labelStyle}>Dining</label>
            <textarea style={textareaStyle} value={form.dining} onChange={(e) => set("dining", e.target.value)} rows={3} />
          </div>
        </div>
      </section>

      {/* Packages */}
      {packages.length > 0 && (
        <section>
          <p className="label-sm text-[#9B8F84] mb-5">Accommodation Packages</p>
          <div className="space-y-6">
            {packages.map((pkg) => (
              <div key={pkg.id} className="p-5 space-y-5" style={{ border: "1px solid rgba(228,216,201,0.8)", background: "#FDFAF6" }}>
                <p className="label-sm text-[#C9BAA8]">{pkg.name || `Package`}</p>

                {/* Name row */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className={fieldClass}>
                    <label style={labelStyle}>Name</label>
                    <input style={inputStyle} value={pkg.name} onChange={(e) => setPkg(pkg.id, "name", e.target.value)} />
                  </div>
                  <div className={fieldClass}>
                    <label style={labelStyle}>Occupancy</label>
                    <input
                      style={inputStyle}
                      value={pkg.occupancy ?? ""}
                      onChange={(e) => setPkg(pkg.id, "occupancy", e.target.value)}
                      placeholder="e.g. 2 guests per suite"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className={fieldClass}>
                  <label style={labelStyle}>Description</label>
                  <textarea
                    style={textareaStyle}
                    value={pkg.description ?? ""}
                    onChange={(e) => setPkg(pkg.id, "description", e.target.value)}
                    rows={2}
                    placeholder="Shown to guests when choosing accommodation"
                  />
                </div>

                {/* Pricing row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className={fieldClass}>
                    <label style={labelStyle}>Full Price (₪)</label>
                    <input
                      style={inputStyle}
                      type="number"
                      min="0"
                      value={pkg.fullPrice / 100}
                      onChange={(e) => setPkg(pkg.id, "fullPrice", String(Math.round(parseFloat(e.target.value) * 100)))}
                    />
                  </div>
                  <div className={fieldClass}>
                    <label style={labelStyle}>Deposit (₪)</label>
                    <input
                      style={inputStyle}
                      type="number"
                      min="0"
                      value={pkg.depositAmount / 100}
                      onChange={(e) => setPkg(pkg.id, "depositAmount", String(Math.round(parseFloat(e.target.value) * 100)))}
                    />
                  </div>
                  <div className={fieldClass}>
                    <label style={labelStyle}>Capacity</label>
                    <input style={inputStyle} type="number" min="1" value={pkg.capacity} onChange={(e) => setPkg(pkg.id, "capacity", e.target.value)} />
                  </div>
                  <div className={fieldClass}>
                    <label style={labelStyle}>Available</label>
                    <input style={inputStyle} type="number" min="0" value={pkg.available} onChange={(e) => setPkg(pkg.id, "available", e.target.value)} />
                  </div>
                </div>

                {/* Images */}
                <div>
                  <label style={labelStyle}>Photos</label>

                  {/* Existing images */}
                  {pkg.images.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-3">
                      {pkg.images.map((url) => (
                        <div key={url} className="relative group" style={{ width: "100px", height: "80px" }}>
                          <img
                            src={url}
                            alt={`${pkg.name} photo`}
                            className="h-full w-full object-cover"
                            style={{ borderRadius: "2px" }}
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(pkg.id, url)}
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{
                              background: "rgba(61,46,34,0.8)",
                              color: "#FAF7F2",
                              border: "none",
                              borderRadius: "50%",
                              width: "20px",
                              height: "20px",
                              cursor: "pointer",
                              fontSize: "11px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload button */}
                  <input
                    type="file"
                    accept="image/*"
                    ref={(el) => { fileRefs.current[pkg.id] = el; }}
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadImage(pkg.id, file);
                      e.target.value = "";
                    }}
                  />
                  <button
                    type="button"
                    disabled={uploadingFor === pkg.id}
                    onClick={() => fileRefs.current[pkg.id]?.click()}
                    style={{
                      fontFamily: "Jost",
                      fontWeight: 400,
                      fontSize: "0.7rem",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      border: "1px solid rgba(184,144,128,0.45)",
                      color: "var(--color-taupe)",
                      background: "transparent",
                      padding: "0.5rem 1rem",
                      cursor: uploadingFor === pkg.id ? "not-allowed" : "pointer",
                      opacity: uploadingFor === pkg.id ? 0.6 : 1,
                    }}
                  >
                    {uploadingFor === pkg.id ? "Uploading…" : "+ Add Photo"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {error && (
        <p style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.875rem", color: "var(--color-candle)" }}>{error}</p>
      )}

      {saved && (
        <p style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.875rem", color: "#5A7A5A" }}>Saved.</p>
      )}

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 uppercase transition-all disabled:opacity-60"
          style={{
            fontFamily: "Jost",
            fontWeight: 400,
            fontSize: "0.75rem",
            letterSpacing: "0.16em",
            background: "var(--color-espresso)",
            color: "#FAF7F2",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Saving…" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/retreats")}
          style={{
            fontFamily: "Jost",
            fontWeight: 300,
            fontSize: "0.875rem",
            color: "var(--color-taupe-light)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          Back
        </button>
      </div>
    </form>
  );
}
