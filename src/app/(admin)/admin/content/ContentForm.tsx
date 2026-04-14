"use client";

import { useState } from "react";

type Item = { key: string; label: string; value: string; type: string };

export default function ContentForm({ items }: { items: Item[] }) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(items.map((i) => [i.key, i.value]))
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed to save.");
      setSaved(true);
    } catch {
      setError("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const inputBase = {
    fontFamily: "Jost",
    fontWeight: 300,
    fontSize: "0.875rem",
    background: "var(--color-linen)",
    border: "1px solid rgba(184,144,128,0.25)",
    color: "var(--color-espresso)",
    width: "100%",
    outline: "none",
  };

  return (
    <div>
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.key}
            className="p-5"
            style={{ background: "#FAF7F2", border: "1px solid rgba(228,216,201,0.8)" }}
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <div style={{ fontFamily: "Jost", fontWeight: 400, fontSize: "0.875rem", color: "var(--color-espresso)" }}>{item.label}</div>
                <div className="label-sm text-[#9B8F84] mt-0.5">{item.key}</div>
              </div>
              <span className="label-sm text-[#9B8F84]">{item.type}</span>
            </div>

            {item.type === "RICHTEXT" ? (
              <textarea
                value={values[item.key] ?? ""}
                onChange={(e) => { setValues((v) => ({ ...v, [item.key]: e.target.value })); setSaved(false); }}
                rows={4}
                style={{ ...inputBase, padding: "0.75rem", resize: "vertical", lineHeight: 1.7 }}
              />
            ) : (
              <input
                value={values[item.key] ?? ""}
                onChange={(e) => { setValues((v) => ({ ...v, [item.key]: e.target.value })); setSaved(false); }}
                style={{ ...inputBase, padding: "0.625rem 0.75rem" }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-7 py-3 uppercase transition-all disabled:opacity-60"
          style={{
            fontFamily: "Jost", fontWeight: 400, fontSize: "0.75rem", letterSpacing: "0.16em",
            background: "var(--color-espresso)", color: "#FAF7F2", border: "none", cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
        {saved && <span style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.875rem", color: "#5A7A5A" }}>Saved.</span>}
        {error && <span style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.875rem", color: "var(--color-candle)" }}>{error}</span>}
      </div>
    </div>
  );
}
