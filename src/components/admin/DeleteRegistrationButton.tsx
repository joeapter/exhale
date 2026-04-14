"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  registrationId: string;
  guestName?: string;
  redirectTo?: string;
};

export default function DeleteRegistrationButton({
  registrationId,
  guestName,
  redirectTo,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (loading) return;

    const name = guestName?.trim() ? ` for ${guestName.trim()}` : "";
    const confirmed = window.confirm(
      `Delete this registration${name}? This cannot be undone.`
    );
    if (!confirmed) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/registrations/${registrationId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to delete registration.");
      }

      if (redirectTo) {
        router.push(redirectTo);
        return;
      }
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete registration."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="label-sm uppercase transition-colors"
        style={{
          letterSpacing: "0.12em",
          color: loading ? "var(--color-taupe-light)" : "rgba(180,100,100,1)",
          textDecoration: "underline",
          textUnderlineOffset: "2px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Deleting..." : "Delete"}
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
