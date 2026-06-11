"use client";

import { useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  CheckoutElementsProvider,
  PaymentElement,
  useCheckoutElements,
} from "@stripe/react-stripe-js/checkout";

type Currency = "ILS" | "USD";

type SessionDetails = {
  clientSecret: string;
  amount: number;
  chargedAmount: number;
  chargedCurrency: Currency;
  exchangeRate: string | null;
  exchangeRateSource: string | null;
  exchangeRateQuotedAt: string | null;
};

function money(amount: number, currency: Currency) {
  return new Intl.NumberFormat(currency === "ILS" ? "he-IL" : "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "USD" ? 2 : 0,
    maximumFractionDigits: currency === "USD" ? 2 : 0,
  }).format(amount / 100);
}

function PaymentForm({
  token,
  details,
  onPaid,
}: {
  token: string;
  details: SessionDetails;
  onPaid: () => void;
}) {
  const checkoutState = useCheckoutElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pay(event: React.FormEvent) {
    event.preventDefault();
    if (checkoutState.type !== "success") return;
    setSubmitting(true);
    setError(null);

    const result = await checkoutState.checkout.confirm({
      redirect: "if_required",
      returnUrl: window.location.href,
    });
    if (result.type === "error") {
      setError(result.error.message);
      setSubmitting(false);
      return;
    }

    const response = await fetch(`/api/payments/${token}/sync`, { method: "POST" });
    const data = await response.json();
    if (response.ok && data.paid) {
      onPaid();
      return;
    }
    setError(data.error ?? "Payment is still processing. Please wait a moment and try again.");
    setSubmitting(false);
  }

  if (checkoutState.type === "loading") {
    return <p className="text-sm text-[#9B8F84]">Preparing secure card fields...</p>;
  }
  if (checkoutState.type === "error") {
    return <p className="text-sm text-red-700">{checkoutState.error.message}</p>;
  }

  return (
    <form onSubmit={pay} className="space-y-6">
      <PaymentElement options={{ layout: "accordion" }} />
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full px-6 py-4 label-sm text-white disabled:opacity-60"
        style={{ background: "var(--color-espresso)" }}
      >
        {submitting
          ? "Processing..."
          : `Pay ${money(details.chargedAmount, details.chargedCurrency)}`}
      </button>
      <p className="text-center text-xs text-[#9B8F84]">
        Secure card processing by Stripe. EXHALE never stores your card details.
      </p>
    </form>
  );
}

export default function PaymentPageClient({
  token,
  publishableKey,
  ilsAmount,
  lockedCurrency,
}: {
  token: string;
  publishableKey: string;
  ilsAmount: number;
  lockedCurrency: Currency | null;
}) {
  const stripe = useMemo(() => loadStripe(publishableKey), [publishableKey]);
  const [details, setDetails] = useState<SessionDetails | null>(null);
  const [loadingCurrency, setLoadingCurrency] = useState<Currency | null>(null);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function chooseCurrency(currency: Currency) {
    setLoadingCurrency(currency);
    setError(null);
    const response = await fetch(`/api/payments/${token}/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currency }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Unable to prepare payment.");
      setLoadingCurrency(null);
      return;
    }
    setDetails(data);
    setLoadingCurrency(null);
  }

  if (paid) {
    return (
      <div className="py-10 text-center">
        <p className="label-sm text-[#B89080] mb-4">Payment received</p>
        <h2 className="text-4xl mb-4">Thank you.</h2>
        <p>Your payment is complete and your EXHALE reservation has been updated.</p>
      </div>
    );
  }

  if (!details) {
    if (lockedCurrency) {
      return (
        <div>
          <p className="mb-6">
            This one-time payment has been prepared in {lockedCurrency}.
          </p>
          <button
            type="button"
            disabled={Boolean(loadingCurrency)}
            onClick={() => chooseCurrency(lockedCurrency)}
            className="w-full px-6 py-4 label-sm text-white disabled:opacity-60"
            style={{ background: "var(--color-espresso)" }}
          >
            {loadingCurrency ? "Preparing payment..." : `Continue ${lockedCurrency} payment`}
          </button>
          {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
        </div>
      );
    }

    return (
      <div>
        <p className="mb-6">
          Choose the currency for this payment. Your reservation balance remains fixed in ILS.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <button
            type="button"
            disabled={Boolean(loadingCurrency)}
            onClick={() => chooseCurrency("ILS")}
            className="p-5 text-left border disabled:opacity-60"
            style={{ borderColor: "rgba(184,144,128,0.45)", background: "#FDFAF6" }}
          >
            <span className="label-sm block mb-2 text-[#9B8F84]">Pay in shekels</span>
            <strong className="serif text-3xl font-normal">{money(ilsAmount, "ILS")}</strong>
          </button>
          <button
            type="button"
            disabled={Boolean(loadingCurrency)}
            onClick={() => chooseCurrency("USD")}
            className="p-5 text-left border disabled:opacity-60"
            style={{ borderColor: "rgba(184,144,128,0.45)", background: "#FDFAF6" }}
          >
            <span className="label-sm block mb-2 text-[#9B8F84]">Pay in US dollars</span>
            <strong className="serif text-3xl font-normal">Current rate</strong>
            <span className="block mt-1 text-xs text-[#9B8F84]">
              Quoted and fixed when selected
            </span>
          </button>
        </div>
        {loadingCurrency && (
          <p className="mt-4 text-sm text-[#9B8F84]">
            Preparing {loadingCurrency} payment...
          </p>
        )}
        {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-7 pb-5 border-b" style={{ borderColor: "rgba(184,144,128,0.25)" }}>
        <p className="label-sm text-[#9B8F84] mb-2">Amount to pay</p>
        <p className="serif text-4xl text-[#3D2E22]">
          {money(details.chargedAmount, details.chargedCurrency)}
        </p>
        {details.chargedCurrency === "USD" && details.exchangeRate && (
          <p className="mt-2 text-xs text-[#9B8F84]">
            Credits {money(details.amount, "ILS")} at ₪1 = $
            {Number(details.exchangeRate).toFixed(6)} · {details.exchangeRateSource}
          </p>
        )}
      </div>
      <CheckoutElementsProvider
        stripe={stripe}
        options={{
          clientSecret: details.clientSecret,
          elementsOptions: {
            appearance: {
              theme: "stripe",
              variables: {
                colorPrimary: "#3D2E22",
                colorText: "#3D2E22",
                colorBackground: "#FDFAF6",
                colorDanger: "#9A3412",
                fontFamily: "Jost, system-ui, sans-serif",
                borderRadius: "0px",
              },
            },
          },
        }}
      >
        <PaymentForm token={token} details={details} onPaid={() => setPaid(true)} />
      </CheckoutElementsProvider>
    </div>
  );
}
