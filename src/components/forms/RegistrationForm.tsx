"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";

type Package = {
  id: string;
  name: string;
  fullPrice: number;
  depositAmount: number;
  available: number;
};

type Retreat = {
  id: string;
  slug: string;
  title: string;
  packages: Package[];
};

type Step = 1 | 2 | 3;

export default function RegistrationForm({ retreat }: { retreat: Retreat }) {
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedPackage, setSelectedPackage] = useState<string>(
    retreat.packages[0]?.id ?? ""
  );
  const [paymentType, setPaymentType] = useState<"DEPOSIT" | "FULL">("DEPOSIT");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    dietaryNeeds: "",
    healthNotes: "",
    roomingPref: "NO_PREFERENCE" as "SOLO" | "WITH_FRIEND" | "NO_PREFERENCE",
    additionalNotes: "",
    emergencyName: "",
    emergencyPhone: "",
    emergencyRel: "",
  });

  const pkg = retreat.packages.find((p) => p.id === selectedPackage);
  const amountDue = pkg
    ? paymentType === "DEPOSIT"
      ? pkg.depositAmount
      : pkg.fullPrice
    : 0;

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          retreatId: retreat.id,
          packageId: selectedPackage,
          paymentType,
          ...form,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      // Redirect to Stripe checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const fieldStyle = {
    fontFamily: "Jost, system-ui, sans-serif",
    fontWeight: 300 as const,
    fontSize: "0.9375rem",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid rgba(184,144,128,0.45)",
    color: "var(--color-espresso)",
    padding: "0.625rem 0",
    width: "100%",
    outline: "none",
    borderRadius: 0,
    transition: "border-color 0.3s ease",
  };

  const labelStyle = {
    fontFamily: "Jost, system-ui, sans-serif",
    fontWeight: 400,
    fontSize: "0.7rem",
    letterSpacing: "0.16em",
    textTransform: "uppercase" as const,
    color: "var(--color-taupe-light)",
    display: "block",
    marginBottom: "0.25rem",
  };

  const stepTitles: Record<Step, string> = {
    1: "Package",
    2: "Your Details",
    3: "Health & Preferences",
  };

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center gap-0 mb-12">
        {([1, 2, 3] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className="flex items-center justify-center"
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: step >= s ? "var(--color-espresso)" : "transparent",
                  border: `1px solid ${step >= s ? "var(--color-espresso)" : "rgba(184,144,128,0.4)"}`,
                  transition: "all 0.3s ease",
                }}
              >
                <span
                  style={{
                    fontFamily: "Jost, system-ui, sans-serif",
                    fontWeight: 300,
                    fontSize: "0.6875rem",
                    color: step >= s ? "#FAF7F2" : "var(--color-taupe-light)",
                  }}
                >
                  {s}
                </span>
              </div>
              <span
                className="mt-1.5 label-sm"
                style={{ color: step >= s ? "var(--color-taupe)" : "var(--color-taupe-light)" }}
              >
                {stepTitles[s]}
              </span>
            </div>
            {i < 2 && (
              <div
                className="mx-3 mb-5"
                style={{
                  height: "1px",
                  width: "3rem",
                  background: step > s ? "var(--color-clay)" : "rgba(184,144,128,0.25)",
                  transition: "background 0.3s ease",
                }}
              />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>

        {/* ─── Step 1: Package Selection ─── */}
        {step === 1 && (
          <div>
            <h2
              style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontWeight: 300,
                fontSize: "clamp(1.625rem, 3vw, 2.25rem)",
                color: "var(--color-espresso)",
                marginBottom: "2.5rem",
              }}
            >
              Choose your accommodation
            </h2>

            {/* Package options */}
            <div className="space-y-4 mb-10">
              {retreat.packages.map((pkg) => (
                <label
                  key={pkg.id}
                  className="flex items-start gap-4 cursor-pointer"
                  style={{
                    padding: "1.5rem",
                    border: `1px solid ${
                      selectedPackage === pkg.id
                        ? "rgba(184,144,128,0.6)"
                        : "rgba(184,144,128,0.25)"
                    }`,
                    background: selectedPackage === pkg.id ? "rgba(184,144,128,0.06)" : "transparent",
                    transition: "all 0.2s ease",
                    opacity: pkg.available === 0 ? 0.45 : 1,
                  }}
                >
                  <input
                    type="radio"
                    name="package"
                    value={pkg.id}
                    checked={selectedPackage === pkg.id}
                    onChange={() => setSelectedPackage(pkg.id)}
                    disabled={pkg.available === 0}
                    className="mt-1 shrink-0"
                    style={{ accentColor: "var(--color-clay)" }}
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div
                          style={{
                            fontFamily: "Cormorant Garamond, Georgia, serif",
                            fontWeight: 400,
                            fontSize: "1.25rem",
                            color: "var(--color-espresso)",
                          }}
                        >
                          {pkg.name}
                        </div>
                        {pkg.available === 0 && (
                          <span className="label-sm" style={{ color: "var(--color-taupe-light)" }}>
                            Sold out
                          </span>
                        )}
                        {pkg.available > 0 && pkg.available <= 2 && (
                          <span className="label-sm" style={{ color: "var(--color-candle)" }}>
                            {pkg.available} remaining
                          </span>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <div
                          style={{
                            fontFamily: "Cormorant Garamond, Georgia, serif",
                            fontWeight: 300,
                            fontSize: "1.375rem",
                            color: "var(--color-espresso)",
                            lineHeight: 1,
                          }}
                        >
                          {formatCurrency(pkg.fullPrice)}
                        </div>
                        <div className="label-sm text-[#9B8F84] mt-0.5">full price</div>
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {/* Payment type */}
            {pkg && (
              <div className="mb-10">
                <div className="label-sm text-[#B89080] mb-4">Payment option</div>
                <div className="space-y-3">
                  {[
                    {
                      value: "DEPOSIT" as const,
                      label: "Pay deposit now",
                      sublabel: `${formatCurrency(pkg.depositAmount)} today — balance due 30 days before retreat`,
                    },
                    {
                      value: "FULL" as const,
                      label: "Pay in full",
                      sublabel: `${formatCurrency(pkg.fullPrice)} — no further payment required`,
                    },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-start gap-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="paymentType"
                        value={option.value}
                        checked={paymentType === option.value}
                        onChange={() => setPaymentType(option.value)}
                        className="mt-0.5 shrink-0"
                        style={{ accentColor: "var(--color-clay)" }}
                      />
                      <div>
                        <div
                          style={{
                            fontFamily: "Jost, system-ui, sans-serif",
                            fontWeight: 300,
                            fontSize: "0.9375rem",
                            color: "var(--color-espresso)",
                          }}
                        >
                          {option.label}
                        </div>
                        <div
                          style={{
                            fontFamily: "Jost, system-ui, sans-serif",
                            fontWeight: 300,
                            fontSize: "0.8125rem",
                            color: "var(--color-taupe-light)",
                            marginTop: "0.1rem",
                          }}
                        >
                          {option.sublabel}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!selectedPackage}
              className="w-full py-3.5 transition-all duration-300 uppercase disabled:opacity-50"
              style={{
                fontFamily: "Jost, system-ui, sans-serif",
                fontWeight: 400,
                fontSize: "0.75rem",
                letterSpacing: "0.18em",
                background: "var(--color-espresso)",
                color: "#FAF7F2",
                border: "none",
                cursor: selectedPackage ? "pointer" : "not-allowed",
              }}
            >
              Continue
            </button>
          </div>
        )}

        {/* ─── Step 2: Personal Details ─── */}
        {step === 2 && (
          <div>
            <h2
              style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontWeight: 300,
                fontSize: "clamp(1.625rem, 3vw, 2.25rem)",
                color: "var(--color-espresso)",
                marginBottom: "2.5rem",
              }}
            >
              Your details
            </h2>

            <div className="space-y-8">
              {/* Name row */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label style={labelStyle}>First name *</label>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                    placeholder="Your first name"
                    style={fieldStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Last name *</label>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Your last name"
                    style={fieldStyle}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Email address *</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  style={fieldStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Phone number</label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+972 50 000 0000"
                  style={fieldStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Date of birth</label>
                <input
                  name="dateOfBirth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  style={fieldStyle}
                />
              </div>

              {/* Rooming preference */}
              <div>
                <label style={labelStyle}>Rooming preference</label>
                <select
                  name="roomingPref"
                  value={form.roomingPref}
                  onChange={handleChange}
                  style={{ ...fieldStyle, appearance: "none" as const }}
                >
                  <option value="NO_PREFERENCE">No preference</option>
                  <option value="SOLO">I prefer my own space</option>
                  <option value="WITH_FRIEND">I'm coming with a friend (please pair us)</option>
                </select>
              </div>

              {/* Emergency contact */}
              <div>
                <div className="label-sm text-[#B89080] mb-5">Emergency contact</div>
                <div className="space-y-6">
                  <div>
                    <label style={labelStyle}>Name *</label>
                    <input
                      name="emergencyName"
                      value={form.emergencyName}
                      onChange={handleChange}
                      required
                      placeholder="Full name"
                      style={fieldStyle}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label style={labelStyle}>Phone *</label>
                      <input
                        name="emergencyPhone"
                        type="tel"
                        value={form.emergencyPhone}
                        onChange={handleChange}
                        required
                        placeholder="+972 50 000 0000"
                        style={fieldStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Relationship</label>
                      <input
                        name="emergencyRel"
                        value={form.emergencyRel}
                        onChange={handleChange}
                        placeholder="e.g. Partner, Sister"
                        style={fieldStyle}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3.5 transition-all duration-300 uppercase"
                style={{
                  fontFamily: "Jost, system-ui, sans-serif",
                  fontWeight: 400,
                  fontSize: "0.75rem",
                  letterSpacing: "0.18em",
                  background: "transparent",
                  border: "1px solid rgba(184,144,128,0.4)",
                  color: "var(--color-taupe)",
                  cursor: "pointer",
                }}
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!form.firstName || !form.lastName || !form.email || !form.emergencyName || !form.emergencyPhone) {
                    setError("Please fill in all required fields.");
                    return;
                  }
                  setError(null);
                  setStep(3);
                }}
                className="flex-[2] py-3.5 transition-all duration-300 uppercase"
                style={{
                  fontFamily: "Jost, system-ui, sans-serif",
                  fontWeight: 400,
                  fontSize: "0.75rem",
                  letterSpacing: "0.18em",
                  background: "var(--color-espresso)",
                  color: "#FAF7F2",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Continue
              </button>
            </div>
            {error && (
              <p className="mt-3 text-center" style={{ fontFamily: "Jost, system-ui, sans-serif", fontWeight: 300, fontSize: "0.8125rem", color: "var(--color-candle)" }}>
                {error}
              </p>
            )}
          </div>
        )}

        {/* ─── Step 3: Health & Preferences ─── */}
        {step === 3 && (
          <div>
            <h2
              style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontWeight: 300,
                fontSize: "clamp(1.625rem, 3vw, 2.25rem)",
                color: "var(--color-espresso)",
                marginBottom: "0.75rem",
              }}
            >
              A few more details
            </h2>
            <p
              style={{
                fontFamily: "Jost, system-ui, sans-serif",
                fontWeight: 300,
                fontSize: "0.875rem",
                color: "var(--color-taupe-light)",
                marginBottom: "2.5rem",
              }}
            >
              These help us prepare properly for you. Everything shared is kept in confidence.
            </p>

            <div className="space-y-8">
              <div>
                <label style={labelStyle}>Dietary needs or restrictions</label>
                <textarea
                  name="dietaryNeeds"
                  value={form.dietaryNeeds}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Vegetarian, vegan, gluten-free, allergies, etc."
                  style={{ ...fieldStyle, resize: "none" as const }}
                />
              </div>

              <div>
                <label style={labelStyle}>Health notes</label>
                <textarea
                  name="healthNotes"
                  value={form.healthNotes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Anything we should know to ensure you're comfortable and safe"
                  style={{ ...fieldStyle, resize: "none" as const }}
                />
              </div>

              <div>
                <label style={labelStyle}>Anything else you'd like to share</label>
                <textarea
                  name="additionalNotes"
                  value={form.additionalNotes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Intentions, hopes, questions, anything at all"
                  style={{ ...fieldStyle, resize: "none" as const }}
                />
              </div>
            </div>

            {/* Summary */}
            <div
              className="mt-10 mb-8 p-5"
              style={{ background: "rgba(184,144,128,0.08)", border: "1px solid rgba(184,144,128,0.2)" }}
            >
              <div className="label-sm text-[#B89080] mb-4">Booking Summary</div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.875rem", color: "var(--color-taupe)" }}>
                    {retreat.title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.875rem", color: "var(--color-taupe)" }}>
                    {pkg?.name}
                  </span>
                  <span style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.875rem", color: "var(--color-espresso)" }}>
                    {pkg ? formatCurrency(pkg.fullPrice) : ""}
                  </span>
                </div>
                <div
                  className="pt-3 flex justify-between"
                  style={{ borderTop: "1px solid rgba(184,144,128,0.25)", marginTop: "0.5rem" }}
                >
                  <span style={{ fontFamily: "Jost", fontWeight: 400, fontSize: "0.875rem", color: "var(--color-espresso)" }}>
                    {paymentType === "DEPOSIT" ? "Deposit due today" : "Total due today"}
                  </span>
                  <span style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontWeight: 300, fontSize: "1.25rem", color: "var(--color-espresso)" }}>
                    {formatCurrency(amountDue)}
                  </span>
                </div>
              </div>
            </div>

            {error && (
              <p
                className="mb-4"
                style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.8125rem", color: "var(--color-candle)" }}
              >
                {error}
              </p>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 py-3.5 transition-all duration-300 uppercase"
                style={{
                  fontFamily: "Jost, system-ui, sans-serif",
                  fontWeight: 400,
                  fontSize: "0.75rem",
                  letterSpacing: "0.18em",
                  background: "transparent",
                  border: "1px solid rgba(184,144,128,0.4)",
                  color: "var(--color-taupe)",
                  cursor: "pointer",
                }}
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] py-3.5 transition-all duration-300 uppercase disabled:opacity-60"
                style={{
                  fontFamily: "Jost, system-ui, sans-serif",
                  fontWeight: 400,
                  fontSize: "0.75rem",
                  letterSpacing: "0.18em",
                  background: "var(--color-espresso)",
                  color: "#FAF7F2",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Preparing checkout…" : `Proceed to Payment — ${formatCurrency(amountDue)}`}
              </button>
            </div>

            <p
              className="mt-4 text-center"
              style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.75rem", color: "var(--color-taupe-light)" }}
            >
              Payments processed securely by Stripe. You will be redirected to complete payment.
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
