"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MarkStaffButton({
  registrationId,
  isStaff = false,
}: {
  registrationId: string;
  isStaff?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (loading) return;

    if (isStaff) {
      const confirmed = window.confirm(
        "Remove staff status from this registration? They will be included in payment totals again."
      );
      if (!confirmed) return;
    } else {
      const confirmed = window.confirm(
        "Mark this registration as staff? No payment will be required and they will be excluded from retreat financial totals."
      );
      if (!confirmed) return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/admin/registrations/${registrationId}/staff`,
        { method: isStaff ? "DELETE" : "POST" }
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to update staff status.");
      }

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update staff status."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="label-sm uppercase transition-colors"
        style={{
          letterSpacing: "0.12em",
          color: loading
            ? "var(--color-taupe-light)"
            : isStaff
              ? "rgba(100,100,180,1)"
              : "var(--color-taupe)",
          textDecoration: "underline",
          textUnderlineOffset: "2px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading
          ? "Saving..."
          : isStaff
            ? "Remove Staff"
            : "Mark Staff"}
      </button>
      {error && (
        <p
          className="mt-1"
          style={{
            fontFamily: "Jost, system-ui, sans-serif",
            fontWeight: 300,
            fontSize: "0.6875rem",
            color: "var(--color-candle)",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
