"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MarkPaidFullButton({
  registrationId,
  paidFull = false,
}: {
  registrationId: string;
  paidFull?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (loading) return;

    if (paidFull) {
      const confirmed = window.confirm(
        "Mark this registration as unpaid? This will revert the paid-in-full status and move it back to pending."
      );
      if (!confirmed) return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/admin/registrations/${registrationId}/paid-full`,
        { method: paidFull ? "DELETE" : "POST" }
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to update payment status.");
      }

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update payment status."
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
            : paidFull
              ? "rgba(180,100,100,1)"
              : "rgba(90,122,90,1)",
          textDecoration: "underline",
          textUnderlineOffset: "2px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Saving..." : paidFull ? "Mark Unpaid" : "Mark Paid Full"}
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
