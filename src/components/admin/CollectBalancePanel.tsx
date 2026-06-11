"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { formatCurrency } from "@/lib/utils";

type ManualMethod = "BANK_TRANSFER" | "BIT" | "CASH" | "OTHER";

export default function CollectBalancePanel({
  registrationId,
  balance,
}: {
  registrationId: string;
  balance: number;
}) {
  const router = useRouter();
  const [link, setLink] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [loadingLink, setLoadingLink] = useState(false);
  const [manualAmount, setManualAmount] = useState(String(balance / 100));
  const [manualMethod, setManualMethod] = useState<ManualMethod>("BIT");
  const [notes, setNotes] = useState("");
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generateLink() {
    setLoadingLink(true);
    setError(null);
    const response = await fetch(
      `/api/admin/registrations/${registrationId}/payment-link`,
      { method: "POST" }
    );
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Unable to create payment link.");
      setLoadingLink(false);
      return;
    }
    setLink(data.url);
    setQr(await QRCode.toDataURL(data.url, { width: 280, margin: 1 }));
    setLoadingLink(false);
  }

  async function recordPayment(event: React.FormEvent) {
    event.preventDefault();
    const amount = Math.round(Number(manualAmount) * 100);
    if (!Number.isFinite(amount) || amount <= 0 || amount > balance) {
      setError("Enter an amount within the outstanding balance.");
      return;
    }
    setRecording(true);
    setError(null);
    const response = await fetch(
      `/api/admin/registrations/${registrationId}/manual-payment`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, method: manualMethod, notes: notes || undefined }),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Unable to record payment.");
      setRecording(false);
      return;
    }
    setRecording(false);
    router.refresh();
  }

  if (balance <= 0) {
    return <p className="text-sm text-[#5A7A5A]">Paid in full.</p>;
  }

  return (
    <div className="grid lg:grid-cols-2 gap-5 mt-5">
      <div className="p-5 border bg-white/60" style={{ borderColor: "rgba(228,216,201,0.8)" }}>
        <p className="label-sm text-[#9B8F84] mb-2">Card payment</p>
        <p className="text-sm mb-4">
          Generate a one-time EXHALE payment page for {formatCurrency(balance)}. The guest can
          choose ILS or USD and enter their card on this computer or scan the QR code.
        </p>
        <button
          type="button"
          onClick={generateLink}
          disabled={loadingLink}
          className="px-4 py-2.5 label-sm text-white disabled:opacity-60"
          style={{ background: "var(--color-espresso)" }}
        >
          {loadingLink ? "Generating..." : "Generate card payment"}
        </button>
        {link && (
          <div className="mt-5">
            <div className="flex flex-wrap gap-3">
              <a href={link} target="_blank" className="label-sm underline text-[#B89080]">
                Open payment page
              </a>
              <button
                type="button"
                className="label-sm underline text-[#9B8F84]"
                onClick={() => navigator.clipboard.writeText(link)}
              >
                Copy link
              </button>
            </div>
            {qr && <img src={qr} alt="Payment page QR code" className="mt-4 w-44 h-44" />}
            <p className="mt-2 text-xs text-[#9B8F84]">The link expires in four hours.</p>
          </div>
        )}
      </div>

      <form
        onSubmit={recordPayment}
        className="p-5 border bg-white/60"
        style={{ borderColor: "rgba(228,216,201,0.8)" }}
      >
        <p className="label-sm text-[#9B8F84] mb-2">Record manual payment</p>
        <label className="block text-xs text-[#9B8F84] mt-4">
          Amount in ILS
          <input
            type="number"
            min="0.01"
            step="0.01"
            max={balance / 100}
            value={manualAmount}
            onChange={(event) => setManualAmount(event.target.value)}
            className="field-base"
          />
        </label>
        <label className="block text-xs text-[#9B8F84] mt-4">
          Method
          <select
            value={manualMethod}
            onChange={(event) => setManualMethod(event.target.value as ManualMethod)}
            className="field-base"
          >
            <option value="BIT">Bit</option>
            <option value="BANK_TRANSFER">Bank transfer</option>
            <option value="CASH">Cash</option>
            <option value="OTHER">Other</option>
          </select>
        </label>
        <label className="block text-xs text-[#9B8F84] mt-4">
          Note
          <input value={notes} onChange={(event) => setNotes(event.target.value)} className="field-base" />
        </label>
        <button
          type="submit"
          disabled={recording}
          className="mt-5 px-4 py-2.5 label-sm border disabled:opacity-60"
          style={{ borderColor: "var(--color-espresso)", color: "var(--color-espresso)" }}
        >
          {recording ? "Recording..." : "Record payment"}
        </button>
      </form>
      {error && <p className="lg:col-span-2 text-sm text-red-700">{error}</p>}
    </div>
  );
}
