"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MarkDepositPaidButton({
  registrationId,
}: {
  registrationId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/admin/registrations/${registrationId}/deposit-paid`,
        { method: "POST" }
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to update reservation.");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update reservation.");
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
          color: loading ? "var(--color-taupe-light)" : "rgba(90,122,90,1)",
          textDecoration: "underline",
          textUnderlineOffset: "2px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Saving..." : "Mark Deposit Paid"}
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
