"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteFacilitatorButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    await fetch(`/api/admin/facilitators/${id}`, { method: "DELETE" });
    router.refresh();
  }

  if (confirming) {
    return (
      <span className="flex items-center gap-2">
        <span style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.8125rem", color: "var(--color-taupe-light)" }}>
          Remove {name}?
        </span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          style={{ fontFamily: "Jost", fontWeight: 400, fontSize: "0.8125rem", color: "#c0392b", background: "none", border: "none", cursor: "pointer" }}
        >
          {deleting ? "Removing…" : "Yes"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.8125rem", color: "var(--color-taupe-light)", background: "none", border: "none", cursor: "pointer" }}
        >
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      style={{
        fontFamily: "Jost",
        fontWeight: 300,
        fontSize: "0.8125rem",
        color: "var(--color-taupe-light)",
        background: "none",
        border: "none",
        cursor: "pointer",
      }}
    >
      Remove
    </button>
  );
}
