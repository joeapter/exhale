"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SyncStripeButton({ retreatId }: { retreatId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sync() {
    setLoading(true);
    setError(null);
    const response = await fetch(`/api/admin/retreats/${retreatId}/stripe-sync`, {
      method: "POST",
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Stripe sync failed.");
      setLoading(false);
      return;
    }
    setLoading(false);
    router.refresh();
  }

  return (
    <div>
      <button type="button" onClick={sync} disabled={loading} className="label-sm underline text-[#B89080] disabled:opacity-60">
        {loading ? "Syncing..." : "Sync Stripe"}
      </button>
      {error && <p className="text-xs text-red-700 mt-1">{error}</p>}
    </div>
  );
}
