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

const stepLabels: Record<Step, string> = {
  1: "Package",
  2: "Your details",
  3: "Wellness notes",
};

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
    fontSize: "0.6875rem",
    letterSpacing: "0.16em",
    textTransform: "uppercase" as const,
    color: "var(--color-taupe-light)",
    display: "block",
    marginBottom: "0.25rem",
  };

  return (
    <div>
      {/* ── Step indicator — editorial text, not circles ── */}
      <div className="flex items-center gap-6 mb-12">
        {([1, 2, 3] as Step[]).map((s) => (
          <span
            key={s}
            style={{
              fontFamily: "Jost, system-ui, sans-serif",
              fontWeight: step === s ? 400 : 300,
              fontSize: "0.6875rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color:
                step === s
                  ? "var(--color-espresso)"
                  : step > s
                  ? "var(--color-taupe-light)"
                  : "rgba(155,143,132,0.45)",
              borderBottom: step === s ? "1px solid var(--color-clay)" : "none",
              paddingBottom: step === s ? "2px" : 0,
              transition: "all 0.3s ease",
            }}
          >
            {stepLabels[s]}
          </span>
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

            {/* Package options — editorial rows, not boxes */}
            <div className="mb-10">
              {retreat.packages.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => p.available > 0 && setSelectedPackage(p.id)}
                  disabled={p.available === 0}
                  className="w-full text-left"
                  style={{
                    borderTop: i === 0 ? "1px solid rgba(184,144,128,0.2)" : "none",
                    borderBottom: "1px solid rgba(184,144,128,0.2)",
                    padding: "1.25rem 0",
                    opacity: p.available === 0 ? 0.4 : 1,
                    cursor: p.available === 0 ? "not-allowed" : "pointer",
                    background: "none",
                    transition: "opacity 0.2s ease",
                  }}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <div className="flex items-baseline gap-4">
                      {/* Selection dot */}
                      <span
                        style={{
                          display: "inline-block",
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background:
                            selectedPackage === p.id
                              ? "var(--color-clay)"
                              : "transparent",
                          border: `1px solid ${
                            selectedPackage === p.id
                              ? "var(--color-clay)"
                              : "rgba(184,144,128,0.5)"
                          }`,
                          flexShrink: 0,
                          marginBottom: "1px",
                          transition: "all 0.2s ease",
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "Cormorant Garamond, Georgia, serif",
                          fontWeight: selectedPackage === p.id ? 400 : 300,
                          fontSize: "clamp(1.125rem, 1.8vw, 1.375rem)",
                          color:
                            selectedPackage === p.id
                              ? "var(--color-espresso)"
                              : "var(--color-taupe)",
                          transition: "color 0.2s ease",
                        }}
                      >
                        {p.name}
                      </span>
                      {p.available === 0 && (
                        <span className="label-sm" style={{ color: "var(--color-taupe-light)" }}>
                          Sold out
                        </span>
                      )}
                      {p.available > 0 && p.available <= 2 && (
                        <span className="label-sm" style={{ color: "var(--color-candle)" }}>
                          {p.available} remaining
                        </span>
                      )}
                    </div>
                    <span
                      style={{
                        fontFamily: "Cormorant Garamond, Georgia, serif",
                        fontWeight: 300,
                        fontSize: "clamp(1.125rem, 1.6vw, 1.25rem)",
                        color: "var(--color-taupe)",
                        flexShrink: 0,
                      }}
                    >
                      {formatCurrency(p.fullPrice)}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Payment type */}
            {pkg && (
              <div className="mb-10">
                <div
                  style={{
                    fontFamily: "Jost, system-ui, sans-serif",
                    fontWeight: 400,
                    fontSize: "0.6875rem",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--color-taupe-light)",
                    marginBottom: "1.25rem",
                  }}
                >
                  Payment option
                </div>
                <div className="space-y-5">
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
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setPaymentType(option.value)}
                      className="w-full text-left"
                      style={{ background: "none", padding: 0, cursor: "pointer" }}
                    >
                      <div className="flex items-baseline gap-4">
                        <span
                          style={{
                            display: "inline-block",
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background:
                              paymentType === option.value
                                ? "var(--color-clay)"
                                : "transparent",
                            border: `1px solid ${
                              paymentType === option.value
                                ? "var(--color-clay)"
                                : "rgba(184,144,128,0.5)"
                            }`,
                            flexShrink: 0,
                            marginBottom: "1px",
                            transition: "all 0.2s ease",
                          }}
                        />
                        <div>
                          <div
                            style={{
                              fontFamily: "Jost, system-ui, sans-serif",
                              fontWeight: paymentType === option.value ? 400 : 300,
                              fontSize: "0.9375rem",
                              color: "var(--color-espresso)",
                              transition: "font-weight 0.2s ease",
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
                              marginTop: "0.15rem",
                            }}
                          >
                            {option.sublabel}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!selectedPackage}
              className="w-full py-4 transition-all duration-300 uppercase disabled:opacity-50"
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
                  <option value="WITH_FRIEND">I&apos;m coming with a friend (please pair us)</option>
                </select>
              </div>

              <div>
                <div
                  style={{
                    fontFamily: "Jost, system-ui, sans-serif",
                    fontWeight: 400,
                    fontSize: "0.6875rem",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--color-taupe-light)",
                    marginBottom: "1.5rem",
                  }}
                >
                  Emergency contact
                </div>
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
                className="flex-1 py-4 transition-all duration-300 uppercase"
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
                className="flex-[2] py-4 transition-all duration-300 uppercase"
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

        {/* ─── Step 3: Wellness Notes ─── */}
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

            {/* Summary — minimal, no box */}
            <div className="mt-10 mb-8">
              <div
                style={{
                  borderTop: "1px solid rgba(184,144,128,0.2)",
                  paddingTop: "1.5rem",
                }}
              >
                <div
                  style={{
                    fontFamily: "Jost, system-ui, sans-serif",
                    fontWeight: 400,
                    fontSize: "0.6875rem",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--color-taupe-light)",
                    marginBottom: "1rem",
                  }}
                >
                  Booking summary
                </div>
                <div className="flex justify-between items-baseline mb-2">
                  <span style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.9375rem", color: "var(--color-taupe)" }}>
                    {retreat.title}
                  </span>
                </div>
                <div className="flex justify-between items-baseline mb-5">
                  <span style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.9375rem", color: "var(--color-taupe)" }}>
                    {pkg?.name}
                  </span>
                  <span style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.9375rem", color: "var(--color-espresso)" }}>
                    {pkg ? formatCurrency(pkg.fullPrice) : ""}
                  </span>
                </div>
                <div
                  className="flex justify-between items-baseline pt-4"
                  style={{ borderTop: "1px solid rgba(184,144,128,0.2)" }}
                >
                  <span style={{ fontFamily: "Jost", fontWeight: 400, fontSize: "0.9375rem", color: "var(--color-espresso)" }}>
                    {paymentType === "DEPOSIT" ? "Deposit due today" : "Total due today"}
                  </span>
                  <span style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontWeight: 300, fontSize: "1.375rem", color: "var(--color-espresso)" }}>
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
                className="flex-1 py-4 transition-all duration-300 uppercase"
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
                className="flex-[2] py-4 transition-all duration-300 uppercase disabled:opacity-60"
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
                {loading ? "Preparing checkout…" : `Reserve — ${formatCurrency(amountDue)}`}
              </button>
            </div>

            <p
              className="mt-4 text-center"
              style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.75rem", color: "var(--color-taupe-light)" }}
            >
              Payments processed securely by Stripe.
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
