"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { IMAGE_SLOTS, type ImageSlot } from "@/lib/site-images";

// ─── Theme picker ──────────────────────────────────────────────────────────────

type Theme = "desert" | "forest";

const themes = [
  {
    id: "desert" as Theme,
    name: "Desert",
    subtitle: "Warm desert luxury",
    description:
      "Sun-bleached linens, warm clay, and espresso tones. The original Exhale palette.",
    swatches: ["#FAF7F2", "#E8DDD0", "#C9BAA8", "#B89080", "#C8845A", "#3D2E22"],
    preview: {
      bg: "#FAF7F2", surface: "#F5EFE7", accent: "#C8845A",
      text: "#3D2E22", muted: "#7A6A5A", border: "rgba(184,144,128,0.25)",
    },
  },
  {
    id: "forest" as Theme,
    name: "Forest",
    subtitle: "Dark forest retreat",
    description:
      "Deep canopy greens, amber string lights, and warm cream. The palette of Exhale North.",
    swatches: ["#151911", "#20301C", "#3A5030", "#7A9466", "#C8922A", "#F0EBE0"],
    preview: {
      bg: "#151911", surface: "#1A2216", accent: "#C8922A",
      text: "#F0EBE0", muted: "#B8B0A0", border: "rgba(122,148,102,0.2)",
    },
  },
];

function ThemePicker() {
  const [active, setActive] = useState<Theme | null>(null);
  const [saved, setSaved] = useState<Theme | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/theme").then(r => r.json()).then(d => {
      setActive(d.theme); setSaved(d.theme);
    });
  }, []);

  async function applyTheme(theme: Theme) {
    if (saving || theme === saved) return;
    setSaving(true); setActive(theme);
    try {
      await fetch("/api/admin/theme", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme }),
      });
      setSaved(theme);
    } catch { setActive(saved); }
    finally { setSaving(false); }
  }

  return (
    <div>
      <SectionHeading
        label="Color Theme"
        description="Switch the site palette. Changes apply to all visitors within 60 seconds."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl">
        {themes.map(t => {
          const isActive = active === t.id;
          const isSaved = saved === t.id;
          return (
            <button
              key={t.id}
              onClick={() => applyTheme(t.id)}
              disabled={saving}
              className="text-left transition-all duration-300"
              style={{
                border: isActive ? `2px solid ${t.preview.accent}` : "2px solid rgba(200,186,170,0.4)",
                borderRadius: 6, overflow: "hidden",
                boxShadow: isActive ? `0 0 0 1px ${t.preview.accent}22` : "none",
                cursor: saving && !isActive ? "wait" : "pointer",
              }}
            >
              {/* Mini site preview */}
              <div className="p-5 pb-4" style={{ background: t.preview.bg }}>
                <div className="flex items-center justify-between mb-4 pb-2.5"
                  style={{ borderBottom: `1px solid ${t.preview.border}` }}>
                  <div style={{ fontFamily: "Jost", fontWeight: 400, fontSize: "0.55rem", letterSpacing: "0.22em", color: t.preview.text }}>EXHALE</div>
                  <div className="flex gap-2.5">
                    {["Retreats","About","Register"].map(n => (
                      <div key={n} style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.4rem", letterSpacing: "0.14em", color: t.preview.muted }}>{n.toUpperCase()}</div>
                    ))}
                  </div>
                </div>
                <div style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.45rem", letterSpacing: "0.2em", color: t.preview.accent, marginBottom: 6 }}>COMING SOON</div>
                <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontWeight: 300, fontSize: "1.25rem", lineHeight: 1.1, color: t.preview.text, marginBottom: 6 }}>
                  A place to <em style={{ fontStyle: "italic" }}>breathe</em>
                </div>
                <div style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.5rem", lineHeight: 1.7, color: t.preview.muted, maxWidth: "26ch" }}>
                  Rest, nourishment, stillness. An intentional escape.
                </div>
              </div>
              {/* Info */}
              <div className="px-5 py-4" style={{ background: "#FAF7F2", borderTop: "1px solid rgba(228,216,201,0.6)" }}>
                <div className="flex gap-1.5 mb-3">
                  {t.swatches.map(h => (
                    <div key={h} style={{ width: 18, height: 18, borderRadius: "50%", background: h, border: "1px solid rgba(0,0,0,0.08)", flexShrink: 0 }} />
                  ))}
                </div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontWeight: 400, fontSize: "1rem", color: "#3D2E22", marginBottom: 2 }}>{t.name}</div>
                    <div style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.6875rem", color: "#9B8F84", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{t.subtitle}</div>
                    <div style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.8125rem", lineHeight: 1.65, color: "#7A6A5A", maxWidth: "30ch" }}>{t.description}</div>
                  </div>
                  <div className="flex-shrink-0 mt-0.5">
                    {isSaved ? (
                      <div className="label-sm px-3 py-1.5 flex items-center gap-1.5"
                        style={{ background: t.preview.accent + "18", border: `1px solid ${t.preview.accent}55`, color: t.id === "forest" ? "#8B6520" : "#8B5A30", borderRadius: 2 }}>
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                        Active
                      </div>
                    ) : (
                      <div className="label-sm px-3 py-1.5"
                        style={{ border: "1px solid rgba(184,144,128,0.4)", color: "#7A6A5A", borderRadius: 2, opacity: saving ? 0.5 : 1 }}>
                        {saving && isActive ? "Applying…" : "Set Active"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Image slot card ───────────────────────────────────────────────────────────

function ImageSlotCard({ slot, currentUrl, onSave }: {
  slot: ImageSlot;
  currentUrl: string;
  onSave: (key: string, url: string) => Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(currentUrl);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(true);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) { setError("Please select an image file."); return; }
    if (file.size > slot.maxMB * 1024 * 1024) { setError(`File must be under ${slot.maxMB} MB.`); return; }
    setError(""); setUploading(true);
    try {
      const fd = new FormData(); fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      setPreview(url); setSaved(false);
      await onSave(slot.key, url);
      setSaved(true);
    } catch { setError("Upload failed. Please try again."); }
    finally { setUploading(false); }
  }

  return (
    <div style={{ border: "1px solid rgba(228,216,201,0.8)", borderRadius: 4, overflow: "hidden" }}>
      {/* Preview */}
      <div className="relative bg-[#F5EFE7]" style={{ aspectRatio: slot.aspectCss, maxHeight: 220 }}>
        {preview ? (
          <Image src={preview} alt={slot.label} fill className="object-cover" sizes="400px" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="2" y="6" width="28" height="20" rx="2" stroke="#C9BAA8" strokeWidth="1.5"/>
              <circle cx="11" cy="13" r="3" stroke="#C9BAA8" strokeWidth="1.5"/>
              <path d="M2 22L9 15L14 20L20 14L30 22" stroke="#C9BAA8" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(250,247,242,0.85)" }}>
            <span className="label-sm" style={{ color: "var(--color-taupe)" }}>Uploading…</span>
          </div>
        )}
      </div>

      {/* Info + upload */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div style={{ fontFamily: "Jost", fontWeight: 400, fontSize: "0.875rem", color: "#3D2E22", marginBottom: 2 }}>{slot.label}</div>
            <div className="label-sm mb-1" style={{ color: "#9B8F84" }}>{slot.location}</div>
          </div>
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex-shrink-0 label-sm px-3 py-1.5 transition-colors"
            style={{
              border: "1px solid rgba(184,144,128,0.5)",
              color: "#7A6A5A",
              borderRadius: 2,
              background: "transparent",
              cursor: uploading ? "wait" : "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {uploading ? "Uploading…" : preview ? "Replace" : "Upload"}
          </button>
          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
        </div>

        {/* Spec grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3">
          <SpecRow label="Ratio" value={slot.aspectLabel} />
          <SpecRow label="Min size" value={`${slot.minWidth} × ${slot.minHeight} px`} />
          <SpecRow label="Format" value={slot.format} />
          <SpecRow label="Max file" value={`${slot.maxMB < 1 ? slot.maxMB * 1000 + " KB" : slot.maxMB + " MB"}`} />
        </div>

        <div style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.75rem", lineHeight: 1.6, color: "#9B8F84", borderTop: "1px solid rgba(228,216,201,0.6)", paddingTop: "0.625rem" }}>
          {slot.notes}
        </div>

        {error && (
          <p className="mt-2 text-xs" style={{ fontFamily: "Jost", color: "#B05A3A" }}>{error}</p>
        )}
        {saved && preview !== currentUrl && (
          <p className="mt-2 label-sm" style={{ color: "#7A9466" }}>Saved</p>
        )}
      </div>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-1.5">
      <span style={{ fontFamily: "Jost", fontWeight: 400, fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#9B8F84", minWidth: "3.5rem" }}>{label}</span>
      <span style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.75rem", color: "#3D2E22" }}>{value}</span>
    </div>
  );
}

// ─── Image manager ─────────────────────────────────────────────────────────────

function ImageManager() {
  const [images, setImages] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/admin/site-images").then(r => r.json()).then(d => {
      setImages(d); setLoaded(true);
    });
  }, []);

  async function handleSave(key: string, url: string) {
    await fetch("/api/admin/site-images", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, url }),
    });
    setImages(prev => ({ ...prev, [key]: url }));
  }

  // Group slots by page/location
  const homeSlots    = IMAGE_SLOTS.filter(s => s.key.startsWith("hero_home") || s.key === "atmosphere_home");
  const retreatSlots = IMAGE_SLOTS.filter(s => s.key === "hero_retreat" || s.key.startsWith("gallery"));
  const globalSlots  = IMAGE_SLOTS.filter(s => s.key === "logo_footer");

  const fallbacks: Record<string, string> = {};
  IMAGE_SLOTS.forEach(s => { fallbacks[s.key] = s.defaultSrc; });

  if (!loaded) {
    return <div className="label-sm mt-2" style={{ color: "var(--color-taupe-light)" }}>Loading…</div>;
  }

  return (
    <div className="space-y-10">
      <SlotGroup
        title="Homepage"
        slots={homeSlots}
        images={images}
        fallbacks={fallbacks}
        onSave={handleSave}
      />
      <SlotGroup
        title="Retreat Page"
        slots={retreatSlots}
        images={images}
        fallbacks={fallbacks}
        onSave={handleSave}
      />
      <SlotGroup
        title="Global"
        slots={globalSlots}
        images={images}
        fallbacks={fallbacks}
        onSave={handleSave}
      />
    </div>
  );
}

function SlotGroup({ title, slots, images, fallbacks, onSave }: {
  title: string;
  slots: ImageSlot[];
  images: Record<string, string>;
  fallbacks: Record<string, string>;
  onSave: (key: string, url: string) => Promise<void>;
}) {
  return (
    <div>
      <p className="label-md mb-4" style={{ color: "var(--color-taupe-light)" }}>{title}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {slots.map(slot => (
          <ImageSlotCard
            key={slot.key}
            slot={slot}
            currentUrl={images[slot.key] ?? fallbacks[slot.key] ?? ""}
            onSave={onSave}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Layout helpers ────────────────────────────────────────────────────────────

function SectionHeading({ label, description }: { label: string; description: string }) {
  return (
    <div className="mb-6">
      <h2 style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontWeight: 300, fontSize: "1.375rem", color: "var(--color-espresso)", marginBottom: 4 }}>
        {label}
      </h2>
      <p style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.875rem", color: "var(--color-taupe)", maxWidth: "56ch" }}>
        {description}
      </p>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function AppearancePage() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-10">
      {/* Page header */}
      <div className="mb-12">
        <p className="label-sm mb-2" style={{ color: "var(--color-taupe-light)" }}>Site Appearance</p>
        <h1 style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontWeight: 300, fontSize: "2rem", letterSpacing: "-0.01em", color: "var(--color-espresso)" }}>
          Theme &amp; Images
        </h1>
      </div>

      <div className="space-y-16">
        <ThemePicker />

        <div style={{ borderTop: "1px solid rgba(228,216,201,0.6)", paddingTop: "3.5rem" }}>
          <SectionHeading
            label="Site Images"
            description="Upload and replace every image on the public site. Images are saved instantly — no rebuild needed. Always upload at or above the minimum dimensions for sharp rendering on retina screens."
          />
          <ImageManager />
        </div>
      </div>
    </div>
  );
}
