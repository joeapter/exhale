"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";

export default function InlineAmountEdit({
  registrationId,
  amount,
  endpoint,
  bodyKey,
  prefix = "",
}: {
  registrationId: string;
  amount: number;        // agorot
  endpoint: string;      // e.g. "amount-due" | "amount-paid"
  bodyKey: string;       // e.g. "amountDue" | "amountPaid"
  prefix?: string;       // text shown before the value in view mode, e.g. "of "
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function startEdit() {
    setDraft(String(amount / 100));
    setError(null);
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  }

  function cancel() {
    setEditing(false);
    setError(null);
  }

  async function save() {
    const shekel = parseFloat(draft);
    if (isNaN(shekel) || shekel < 0) {
      setError("Enter a valid amount");
      return;
    }
    const agorot = Math.round(shekel * 100);
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/registrations/${registrationId}/${endpoint}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [bodyKey]: agorot }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to update amount.");
      setEditing(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update amount.");
    } finally {
      setSaving(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") save();
    if (e.key === "Escape") cancel();
  }

  if (editing) {
    return (
      <div>
        <div className="flex items-center gap-1 mt-0.5">
          <span style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.75rem", color: "var(--color-taupe-light)" }}>
            ₪
          </span>
          <input
            ref={inputRef}
            type="number"
            min="0"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={saving}
            style={{
              width: "72px",
              fontFamily: "Jost",
              fontWeight: 300,
              fontSize: "0.8125rem",
              color: "var(--color-espresso)",
              border: "1px solid rgba(184,144,128,0.7)",
              padding: "1px 5px",
              background: "white",
              outline: "none",
            }}
          />
        </div>
        <div className="flex items-center gap-2 mt-1">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="label-sm uppercase"
            style={{
              letterSpacing: "0.1em",
              color: saving ? "var(--color-taupe-light)" : "rgba(90,122,90,1)",
              textDecoration: "underline",
              textUnderlineOffset: "2px",
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "..." : "Save"}
          </button>
          <button
            type="button"
            onClick={cancel}
            disabled={saving}
            className="label-sm uppercase"
            style={{
              letterSpacing: "0.1em",
              color: "var(--color-taupe-light)",
              textDecoration: "underline",
              textUnderlineOffset: "2px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
        {error && (
          <p style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.6875rem", color: "var(--color-candle)", marginTop: "2px" }}>
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={startEdit}
      title="Click to adjust"
      style={{
        fontFamily: "Jost",
        fontWeight: 300,
        fontSize: "0.75rem",
        color: "var(--color-taupe-light)",
        cursor: "pointer",
        textDecoration: "underline",
        textDecorationStyle: "dotted",
        textUnderlineOffset: "2px",
        background: "none",
        border: "none",
        padding: 0,
        display: "block",
        marginTop: "2px",
      }}
    >
      {prefix}{formatCurrency(amount)}
    </button>
  );
}
