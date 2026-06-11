"use client";

import { useState, useEffect } from "react";

type Theme = "desert" | "forest";

const themes = [
  {
    id: "desert" as Theme,
    name: "Desert",
    subtitle: "Warm desert luxury",
    description:
      "Sun-bleached linens, warm clay, and espresso tones. The original Exhale palette — an oasis of warmth and stillness.",
    swatches: [
      { hex: "#FAF7F2", label: "Linen" },
      { hex: "#E8DDD0", label: "Dune" },
      { hex: "#C9BAA8", label: "Stone" },
      { hex: "#B89080", label: "Clay" },
      { hex: "#C8845A", label: "Candle" },
      { hex: "#3D2E22", label: "Espresso" },
    ],
    preview: {
      bg: "#FAF7F2",
      surface: "#F5EFE7",
      accent: "#C8845A",
      text: "#3D2E22",
      muted: "#7A6A5A",
      border: "rgba(184,144,128,0.25)",
    },
  },
  {
    id: "forest" as Theme,
    name: "Forest",
    subtitle: "Dark forest retreat",
    description:
      "Deep canopy greens, amber string lights, and warm cream. Moody, luxurious — the palette of Exhale North.",
    swatches: [
      { hex: "#151911", label: "Canopy" },
      { hex: "#20301C", label: "Forest" },
      { hex: "#3A5030", label: "Moss" },
      { hex: "#7A9466", label: "Sage" },
      { hex: "#C8922A", label: "Amber" },
      { hex: "#F0EBE0", label: "Cream" },
    ],
    preview: {
      bg: "#151911",
      surface: "#1A2216",
      accent: "#C8922A",
      text: "#F0EBE0",
      muted: "#B8B0A0",
      border: "rgba(122,148,102,0.2)",
    },
  },
];

export default function ThemePage() {
  const [active, setActive] = useState<Theme | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<Theme | null>(null);

  useEffect(() => {
    fetch("/api/admin/theme")
      .then((r) => r.json())
      .then((d) => {
        setActive(d.theme);
        setSaved(d.theme);
      });
  }, []);

  async function applyTheme(theme: Theme) {
    if (saving || theme === saved) return;
    setSaving(true);
    setActive(theme);
    try {
      await fetch("/api/admin/theme", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme }),
      });
      setSaved(theme);
    } catch {
      setActive(saved);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <p
          className="label-sm mb-2"
          style={{ color: "var(--color-taupe-light)" }}
        >
          Site Appearance
        </p>
        <h1
          className="text-[2rem] font-light tracking-[-0.01em] mb-2"
          style={{
            fontFamily: "Cormorant Garamond, Georgia, serif",
            color: "var(--color-espresso)",
          }}
        >
          Theme
        </h1>
        <p
          className="text-sm font-light"
          style={{
            fontFamily: "Jost",
            color: "var(--color-taupe)",
            maxWidth: "52ch",
          }}
        >
          Switch the site palette between themes. Changes apply instantly to all
          visitors — no rebuild required.
        </p>
      </div>

      {/* Theme cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {themes.map((t) => {
          const isActive = active === t.id;
          const isSaved = saved === t.id;
          return (
            <button
              key={t.id}
              onClick={() => applyTheme(t.id)}
              disabled={saving}
              className="text-left transition-all duration-300"
              style={{
                border: isActive
                  ? `2px solid ${t.preview.accent}`
                  : "2px solid rgba(200,186,170,0.4)",
                borderRadius: "6px",
                overflow: "hidden",
                boxShadow: isActive
                  ? `0 0 0 1px ${t.preview.accent}22, 0 8px 32px ${t.preview.bg}60`
                  : "none",
                cursor: saving && !isActive ? "wait" : "pointer",
              }}
            >
              {/* Theme preview panel */}
              <div
                className="p-6 pb-5"
                style={{ background: t.preview.bg }}
              >
                {/* Mock site header */}
                <div
                  className="flex items-center justify-between mb-5 pb-3"
                  style={{ borderBottom: `1px solid ${t.preview.border}` }}
                >
                  <div className="flex flex-col gap-0.5">
                    <div
                      className="text-[0.6rem] tracking-[0.22em]"
                      style={{
                        fontFamily: "Jost",
                        fontWeight: 400,
                        color: t.preview.text,
                      }}
                    >
                      EXHALE
                    </div>
                    <div
                      className="text-[0.45rem] tracking-[0.18em]"
                      style={{
                        fontFamily: "Jost",
                        fontWeight: 300,
                        color: t.preview.muted,
                      }}
                    >
                      RETREAT FOR WOMEN
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {["Retreats", "About", "Register"].map((item) => (
                      <div
                        key={item}
                        className="text-[0.42rem] tracking-[0.14em]"
                        style={{
                          fontFamily: "Jost",
                          fontWeight: 300,
                          color: t.preview.muted,
                        }}
                      >
                        {item.toUpperCase()}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mock hero content */}
                <div className="mb-5">
                  <div
                    className="text-[0.5rem] tracking-[0.2em] mb-2"
                    style={{
                      fontFamily: "Jost",
                      fontWeight: 300,
                      color: t.preview.accent,
                    }}
                  >
                    COMING SOON
                  </div>
                  <div
                    className="text-[1.4rem] leading-[1.1] tracking-[-0.01em] mb-2"
                    style={{
                      fontFamily: "Cormorant Garamond, Georgia, serif",
                      fontWeight: 300,
                      color: t.preview.text,
                    }}
                  >
                    A place to{" "}
                    <span style={{ fontStyle: "italic" }}>breathe</span>
                  </div>
                  <div
                    className="text-[0.55rem] leading-[1.7]"
                    style={{
                      fontFamily: "Jost",
                      fontWeight: 300,
                      color: t.preview.muted,
                      maxWidth: "28ch",
                    }}
                  >
                    Rest, nourishment, stillness. An intentional escape from the
                    everyday.
                  </div>
                </div>

                {/* Mock CTA button */}
                <div className="flex items-center gap-3">
                  <div
                    className="text-[0.45rem] tracking-[0.2em] px-3 py-1.5"
                    style={{
                      fontFamily: "Jost",
                      fontWeight: 400,
                      border: `1px solid ${t.preview.accent}`,
                      color: t.preview.accent,
                    }}
                  >
                    JOIN THE WAITLIST
                  </div>
                  <div
                    className="text-[0.45rem] tracking-[0.14em]"
                    style={{
                      fontFamily: "Jost",
                      fontWeight: 300,
                      color: t.preview.muted,
                    }}
                  >
                    VIEW RETREATS →
                  </div>
                </div>
              </div>

              {/* Card info panel */}
              <div
                className="px-6 py-5"
                style={{
                  background: "#FAF7F2",
                  borderTop: "1px solid rgba(228,216,201,0.6)",
                }}
              >
                {/* Swatches */}
                <div className="flex gap-2 mb-4">
                  {t.swatches.map((s) => (
                    <div
                      key={s.label}
                      title={s.label}
                      className="rounded-full"
                      style={{
                        width: 22,
                        height: 22,
                        background: s.hex,
                        border: "1px solid rgba(0,0,0,0.08)",
                        flexShrink: 0,
                      }}
                    />
                  ))}
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div
                      className="text-sm mb-0.5"
                      style={{
                        fontFamily: "Cormorant Garamond, Georgia, serif",
                        fontWeight: 400,
                        fontSize: "1.0625rem",
                        color: "#3D2E22",
                      }}
                    >
                      {t.name}
                    </div>
                    <div
                      className="text-[0.7rem] tracking-[0.12em] mb-2"
                      style={{
                        fontFamily: "Jost",
                        fontWeight: 300,
                        color: "#9B8F84",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {t.subtitle}
                    </div>
                    <div
                      className="text-[0.8125rem] leading-[1.65]"
                      style={{
                        fontFamily: "Jost",
                        fontWeight: 300,
                        color: "#7A6A5A",
                        maxWidth: "32ch",
                      }}
                    >
                      {t.description}
                    </div>
                  </div>

                  <div className="flex-shrink-0 mt-1">
                    {isSaved ? (
                      <div
                        className="label-sm px-3 py-1.5 flex items-center gap-1.5"
                        style={{
                          background: t.preview.accent + "18",
                          border: `1px solid ${t.preview.accent}55`,
                          color: t.id === "forest" ? "#8B6520" : "#8B5A30",
                          borderRadius: "2px",
                        }}
                      >
                        <svg
                          width="10"
                          height="8"
                          viewBox="0 0 10 8"
                          fill="none"
                        >
                          <path
                            d="M1 4L3.5 6.5L9 1"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                        Active
                      </div>
                    ) : (
                      <div
                        className="label-sm px-3 py-1.5 transition-colors"
                        style={{
                          border: "1px solid rgba(184,144,128,0.4)",
                          color: "#7A6A5A",
                          borderRadius: "2px",
                          opacity: saving ? 0.5 : 1,
                        }}
                      >
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

      {/* Save feedback */}
      {saved && (
        <p
          className="mt-6 label-sm"
          style={{ color: "var(--color-taupe-light)" }}
        >
          {saving
            ? "Applying theme…"
            : `${saved === "forest" ? "Forest" : "Desert"} theme is live on the site.`}
        </p>
      )}
    </div>
  );
}
