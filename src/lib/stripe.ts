import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function isStripeConfigured() {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
      (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
        process.env.STRIPE_PUBLISHABLE_KEY)
  );
}

export function getStripeSecretKey() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured.");
  return key;
}

export function getStripe() {
  if (!stripeClient) {
    stripeClient = new Stripe(getStripeSecretKey(), { typescript: true });
  }

  return stripeClient;
}

export function getStripePublishableKey() {
  return (
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ??
    process.env.STRIPE_PUBLISHABLE_KEY ??
    ""
  );
}

export function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_URL) {
    return process.env.NEXT_PUBLIC_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

type StripeFxQuote = {
  id: string;
  created: number;
  rates: {
    ils: {
      rate_details: {
        base_rate: number;
        reference_rate: number;
        reference_rate_provider: string;
      };
    };
  };
};

export async function getUsdQuoteForIls() {
  const body = new URLSearchParams({
    to_currency: "usd",
    "from_currencies[]": "ils",
    lock_duration: "none",
  });
  const response = await fetch("https://api.stripe.com/v1/fx_quotes", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getStripeSecretKey()}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Stripe-Version": "2026-05-27.preview",
    },
    body,
    cache: "no-store",
  });
  const result = (await response.json()) as StripeFxQuote | { error?: { message?: string } };
  if (!response.ok || !("rates" in result)) {
    const message = "error" in result ? result.error?.message : undefined;
    throw new Error(message ?? "Unable to retrieve the current USD exchange rate.");
  }

  return {
    stripeFxQuoteId: result.id,
    rate: result.rates.ils.rate_details.base_rate,
    referenceRate: result.rates.ils.rate_details.reference_rate,
    source: `Stripe/${result.rates.ils.rate_details.reference_rate_provider.toUpperCase()}`,
    quotedAt: new Date(result.created * 1000),
  };
}
