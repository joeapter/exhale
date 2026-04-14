"use client";

import { useState } from "react";
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

export default function NewRetreatPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    tagline: "",
    overview: "",
    location: "",
    locationDetail: "",
    startDate: "",
    endDate: "",
    capacity: "",
    status: "DRAFT",
    // Package 1
    pkg1Name: "",
    pkg1Price: "",
    pkg1Deposit: "",
    pkg1Capacity: "",
    // Package 2
    pkg2Name: "",
    pkg2Price: "",
    pkg2Deposit: "",
    pkg2Capacity: "",
  });

  function set(key: string, value: string) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      // Auto-generate slug from title
      if (key === "title") {
        next.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      }
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const packages = [];
      if (form.pkg1Name) {
        packages.push({
          name: form.pkg1Name,
          fullPrice: Math.round(parseFloat(form.pkg1Price) * 100),
          depositAmount: Math.round(parseFloat(form.pkg1Deposit) * 100),
          capacity: parseInt(form.pkg1Capacity),
          available: parseInt(form.pkg1Capacity),
          sortOrder: 0,
        });
      }
      if (form.pkg2Name) {
        packages.push({
          name: form.pkg2Name,
          fullPrice: Math.round(parseFloat(form.pkg2Price) * 100),
          depositAmount: Math.round(parseFloat(form.pkg2Deposit) * 100),
          capacity: parseInt(form.pkg2Capacity),
          available: parseInt(form.pkg2Capacity),
          sortOrder: 1,
        });
      }

      const res = await fetch("/api/admin/retreats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          slug: form.slug,
          tagline: form.tagline,
          overview: form.overview,
          location: form.location,
          locationDetail: form.locationDetail,
          startDate: form.startDate,
          endDate: form.endDate,
          capacity: parseInt(form.capacity),
          spotsRemaining: parseInt(form.capacity),
          status: form.status,
          packages,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to create retreat.");
      }

      router.push("/admin/retreats");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const fieldClass = "flex flex-col gap-1";

  return (
    <div className="max-w-[760px] mx-auto px-6 py-10">
      <div className="mb-8">
        <h1
          style={{
            fontFamily: "Cormorant Garamond, Georgia, serif",
            fontWeight: 300,
            fontSize: "2.25rem",
            color: "var(--color-espresso)",
          }}
        >
          New Retreat
        </h1>
      </div>

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
              <input style={inputStyle} required value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Noor Glamping, Israel" />
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
              <label style={labelStyle}>Total Capacity *</label>
              <input style={inputStyle} type="number" required min="1" value={form.capacity} onChange={(e) => set("capacity", e.target.value)} />
            </div>
            <div className={fieldClass}>
              <label style={labelStyle}>Status</label>
              <select
                style={{ ...inputStyle, cursor: "pointer" }}
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
          </div>
        </section>

        {/* Packages */}
        <section>
          <p className="label-sm text-[#9B8F84] mb-5">Packages (prices in ₪)</p>
          <div className="space-y-6">
            {[1, 2].map((n) => {
              const prefix = `pkg${n}` as "pkg1" | "pkg2";
              return (
                <div key={n} className="grid sm:grid-cols-4 gap-4 p-4" style={{ border: "1px solid rgba(228,216,201,0.8)" }}>
                  <p className="sm:col-span-4 label-sm text-[#C9BAA8]">Package {n}</p>
                  <div className={`${fieldClass} sm:col-span-4`}>
                    <label style={labelStyle}>Name</label>
                    <input style={inputStyle} value={(form as Record<string, string>)[`${prefix}Name`]} onChange={(e) => set(`${prefix}Name`, e.target.value)} placeholder={n === 1 ? "e.g. Luxury Suite" : "e.g. Deluxe Unit"} />
                  </div>
                  <div className={fieldClass}>
                    <label style={labelStyle}>Full Price (₪)</label>
                    <input style={inputStyle} type="number" min="0" value={(form as Record<string, string>)[`${prefix}Price`]} onChange={(e) => set(`${prefix}Price`, e.target.value)} />
                  </div>
                  <div className={fieldClass}>
                    <label style={labelStyle}>Deposit (₪)</label>
                    <input style={inputStyle} type="number" min="0" value={(form as Record<string, string>)[`${prefix}Deposit`]} onChange={(e) => set(`${prefix}Deposit`, e.target.value)} />
                  </div>
                  <div className={fieldClass}>
                    <label style={labelStyle}>Capacity</label>
                    <input style={inputStyle} type="number" min="1" value={(form as Record<string, string>)[`${prefix}Capacity`]} onChange={(e) => set(`${prefix}Capacity`, e.target.value)} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {error && (
          <p style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.875rem", color: "var(--color-candle)" }}>{error}</p>
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
            {loading ? "Creating…" : "Create Retreat"}
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
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
