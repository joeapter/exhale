"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";

type Package = {
  id: string;
  name: string;
  description?: string | null;
  occupancy?: string | null;
  images?: string[];
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
  const [activeImageByPackage, setActiveImageByPackage] = useState<Record<string, number>>({});
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  const [selectedPackage, setSelectedPackage] = useState<string>(
    retreat.packages[0]?.id ?? ""
  );
  const paymentType = "DEPOSIT" as const;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    dietaryNeeds: "",
    healthNotes: "",
    roomingPref: "NO_PREFERENCE" as "WITH_FRIEND" | "NO_PREFERENCE",
    friendName: "",
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

  useEffect(() => {
    if (!lightbox) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightbox]);

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

  function getPackageImages(pkg: Package) {
    if (pkg.images && pkg.images.length > 0) return pkg.images;
    return ["/assets/desert-glamping-at-sunset.png"];
  }

  function getActiveImageIndex(pkg: Package) {
    const images = getPackageImages(pkg);
    const index = activeImageByPackage[pkg.id] ?? 0;
    return index >= 0 && index < images.length ? index : 0;
  }

  function setPackageImageIndex(pkgId: string, index: number, length: number) {
    if (length <= 0) return;
    const wrapped = ((index % length) + length) % length;
    setActiveImageByPackage((prev) => ({ ...prev, [pkgId]: wrapped }));
  }

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

            {/* Package options */}
            <div className="mb-10 space-y-5">
              {retreat.packages.map((p) => {
                const isSelected = selectedPackage === p.id;
                const isSoldOut = p.available === 0;
                const packageImages = getPackageImages(p);
                const activeImageIndex = getActiveImageIndex(p);
                const activeImage = packageImages[activeImageIndex];
                const occupancyText =
                  p.occupancy?.trim() ||
                  "Occupancy details provided after booking";
                const descriptionText =
                  p.description?.trim() ||
                  "Beautifully appointed accommodation with full access to all retreat amenities.";

                return (
                <div
                  key={p.id}
                  onClick={() => !isSoldOut && setSelectedPackage(p.id)}
                  onKeyDown={(event) => {
                    if (isSoldOut) return;
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedPackage(p.id);
                    }
                  }}
                  className="w-full text-left overflow-hidden"
                  role="button"
                  tabIndex={isSoldOut ? -1 : 0}
                  style={{
                    border: isSelected
                      ? "1px solid rgba(184,144,128,0.65)"
                      : "1px solid rgba(184,144,128,0.28)",
                    opacity: isSoldOut ? 0.55 : 1,
                    cursor: isSoldOut ? "not-allowed" : "pointer",
                    background: isSelected ? "rgba(250,247,242,0.65)" : "rgba(250,247,242,0.35)",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr]">
                    <div className="bg-[#E5D6C4]">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setLightbox({
                            src: activeImage,
                            alt: `${p.name} accommodation`,
                          });
                        }}
                        className="relative h-44 sm:h-[176px] w-full overflow-hidden"
                        aria-label={`Enlarge ${p.name} image`}
                        style={{ cursor: "zoom-in" }}
                      >
                        <img
                          src={activeImage}
                          alt={`${p.name} accommodation`}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      </button>

                      {packageImages.length > 1 && (
                        <div
                          className="flex items-center gap-2 p-2.5"
                          style={{
                            background: "rgba(255,255,255,0.88)",
                            borderTop: "1px solid rgba(184,144,128,0.18)",
                            borderRadius: "0 0 12px 12px",
                          }}
                        >
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              setPackageImageIndex(p.id, activeImageIndex - 1, packageImages.length);
                            }}
                            className="h-8 w-8 shrink-0 rounded-full border text-[#8A7563]"
                            style={{
                              borderColor: "rgba(184,144,128,0.4)",
                              background: "rgba(250,247,242,0.96)",
                            }}
                            aria-label={`Previous ${p.name} image`}
                          >
                            {"<"}
                          </button>

                          <div className="flex flex-1 items-center justify-center gap-1.5 overflow-hidden">
                            {packageImages.map((imgSrc, idx) => (
                              <button
                                key={`${p.id}-${idx}`}
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setPackageImageIndex(p.id, idx, packageImages.length);
                                }}
                                className="relative h-9 w-11 shrink-0 overflow-hidden"
                                style={{
                                  border:
                                    idx === activeImageIndex
                                      ? "1px solid #8A7563"
                                      : "1px solid rgba(138,117,99,0.35)",
                                  borderRadius: "8px",
                                  boxShadow:
                                    idx === activeImageIndex
                                      ? "0 2px 10px rgba(61,46,34,0.12)"
                                      : "0 1px 6px rgba(61,46,34,0.06)",
                                }}
                                aria-label={`View ${p.name} image ${idx + 1}`}
                              >
                                <img
                                  src={imgSrc}
                                  alt={`${p.name} thumbnail ${idx + 1}`}
                                  className="absolute inset-0 h-full w-full object-cover"
                                />
                              </button>
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              setPackageImageIndex(p.id, activeImageIndex + 1, packageImages.length);
                            }}
                            className="h-8 w-8 shrink-0 rounded-full border text-[#8A7563]"
                            style={{
                              borderColor: "rgba(184,144,128,0.4)",
                              background: "rgba(250,247,242,0.96)",
                            }}
                            aria-label={`Next ${p.name} image`}
                          >
                            {">"}
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-5 mb-3">
                        <div className="flex items-baseline gap-3">
                          {/* Selection dot */}
                          <span
                            style={{
                              display: "inline-block",
                              width: "7px",
                              height: "7px",
                              borderRadius: "50%",
                              background: isSelected ? "var(--color-clay)" : "transparent",
                              border: `1px solid ${isSelected ? "var(--color-clay)" : "rgba(184,144,128,0.5)"}`,
                              flexShrink: 0,
                              marginTop: "0.45rem",
                              transition: "all 0.2s ease",
                            }}
                          />
                          <span
                            style={{
                              fontFamily: "Cormorant Garamond, Georgia, serif",
                              fontWeight: isSelected ? 400 : 300,
                              fontSize: "clamp(1.25rem, 2vw, 1.55rem)",
                              color: isSelected ? "var(--color-espresso)" : "var(--color-taupe)",
                              lineHeight: 1.2,
                              transition: "color 0.2s ease",
                            }}
                          >
                            {p.name}
                          </span>
                        </div>

                        <div className="shrink-0 text-right">
                          <div
                            style={{
                              fontFamily: "Cormorant Garamond, Georgia, serif",
                              fontWeight: 300,
                              fontSize: "clamp(1.2rem, 1.8vw, 1.4rem)",
                              color: "var(--color-espresso)",
                              lineHeight: 1,
                            }}
                          >
                            {formatCurrency(p.fullPrice)}
                          </div>
                          <div className="label-sm text-[#9B8F84] mt-1">or {formatCurrency(p.depositAmount)} deposit</div>
                        </div>
                      </div>

                      <p
                        style={{
                          fontFamily: "Jost, system-ui, sans-serif",
                          fontWeight: 300,
                          fontSize: "0.875rem",
                          lineHeight: 1.7,
                          color: "var(--color-taupe)",
                        }}
                      >
                        {descriptionText}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1">
                        <span className="label-sm text-[#9B8F84]">{occupancyText}</span>
                        {isSoldOut && (
                          <span className="label-sm" style={{ color: "var(--color-taupe-light)" }}>
                            Sold out
                          </span>
                        )}
                        {!isSoldOut && p.available <= 2 && (
                          <span className="label-sm" style={{ color: "var(--color-candle)" }}>
                            {p.available} remaining
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>

            {pkg && (
              <p
                className="mb-10"
                style={{
                  fontFamily: "Jost, system-ui, sans-serif",
                  fontWeight: 300,
                  fontSize: "0.875rem",
                  color: "var(--color-taupe)",
                }}
              >
                Deposit due after reservation: {formatCurrency(pkg.depositAmount)}
              </p>
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
                <label style={labelStyle}>Roommate request</label>
                <select
                  name="roomingPref"
                  value={form.roomingPref}
                  onChange={handleChange}
                  style={{ ...fieldStyle, appearance: "none" as const }}
                >
                  <option value="NO_PREFERENCE">No preference</option>
                  <option value="WITH_FRIEND">I&apos;m coming with a friend, please pair us</option>
                </select>
              </div>

              {form.roomingPref === "WITH_FRIEND" && (
                <div>
                  <label style={labelStyle}>Friend&apos;s name</label>
                  <input
                    name="friendName"
                    value={form.friendName}
                    onChange={handleChange}
                    placeholder="First and last name"
                    style={fieldStyle}
                  />
                </div>
              )}

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
                  if (form.roomingPref === "WITH_FRIEND" && !form.friendName.trim()) {
                    setError("Please add your friend's name for roommate pairing.");
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
                <label style={labelStyle}>Anything else you&apos;d like to share</label>
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
                    Deposit due
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
                {loading ? "Submitting…" : "Reserve Now"}
              </button>
            </div>

            <p
              className="mt-4 text-center"
              style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.75rem", color: "var(--color-taupe-light)" }}
            >
              After reserving, you&apos;ll see deposit payment details.
            </p>
          </div>
        )}
      </form>

      {lightbox && (
        <div
          className="fixed inset-0 z-[120] bg-black/80 p-4 sm:p-8 flex items-center justify-center"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute top-5 right-5 h-10 w-10 rounded-full border border-white/30 text-white"
            aria-label="Close image preview"
          >
            ×
          </button>
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[88vh] max-w-[92vw] object-contain"
          />
        </div>
      )}
    </div>
  );
}
