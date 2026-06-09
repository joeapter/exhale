import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How EXHALE collects, uses, and protects your personal information.",
};

const sections = [
  {
    title: "Information We Collect",
    body: `When you register for a retreat, we collect personal information you provide directly: your name, email address, phone number, date of birth, dietary needs, health notes, and emergency contact details. We also collect payment information processed securely through our payment provider — we do not store your card details on our servers.`,
  },
  {
    title: "How We Use Your Information",
    body: `We use your information to process your retreat registration, send confirmation and booking-related communications, prepare for your arrival (dietary and health requirements), and respond to your enquiries. We do not sell, rent, or share your personal information with third parties for marketing purposes.`,
  },
  {
    title: "Data Retention",
    body: `We retain your personal information for as long as necessary to fulfil the purposes for which it was collected, including any legal, accounting, or reporting requirements. Registrant records are kept for up to five years following the retreat date.`,
  },
  {
    title: "Cookies",
    body: `Our website uses only essential cookies required for secure authentication (admin area). We do not use advertising or analytics tracking cookies.`,
  },
  {
    title: "Your Rights",
    body: `You have the right to access, correct, or request deletion of the personal information we hold about you. To exercise any of these rights, please contact us at booking@exhale.co.il.`,
  },
  {
    title: "Contact",
    body: `For any privacy-related questions or requests, please reach us at booking@exhale.co.il. We will respond within a reasonable timeframe.`,
  },
];

export default function PrivacyPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #EDE4D8 0%, #E0D0BC 60%, #D4C0A8 100%)",
          paddingTop: "calc(var(--section) + 4rem)",
          paddingBottom: "var(--section)",
        }}
      >
        <div className="absolute inset-0 grain-overlay" aria-hidden>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "50%",
              background: "linear-gradient(180deg, rgba(250,245,238,0.5) 0%, transparent 100%)",
            }}
          />
        </div>
        <div
          className="relative z-10 max-w-[1180px] mx-auto"
          style={{ paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }}
        >
          <div className="flex items-center gap-3 mb-7">
            <span className="h-px w-5 block" style={{ background: "rgba(184,144,128,0.6)" }} />
            <span className="label-sm text-[#B89080]">Legal</span>
          </div>
          <h1
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontWeight: 300,
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "#3D2E22",
            }}
          >
            Privacy
            <br />
            <span style={{ fontStyle: "italic" }}>Policy</span>
          </h1>
          <p
            className="mt-4"
            style={{
              fontFamily: "Jost, system-ui, sans-serif",
              fontWeight: 300,
              fontSize: "0.8125rem",
              color: "var(--color-taupe-light)",
            }}
          >
            Last updated: April 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <section
        style={{
          background: "var(--color-linen)",
          paddingTop: "var(--section)",
          paddingBottom: "var(--section)",
        }}
      >
        <div
          className="max-w-[1180px] mx-auto"
          style={{ paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }}
        >
          <div className="max-w-2xl">
            <p
              className="mb-12"
              style={{
                fontFamily: "Jost, system-ui, sans-serif",
                fontWeight: 300,
                fontSize: "0.9375rem",
                lineHeight: 1.8,
                color: "var(--color-taupe)",
              }}
            >
              At EXHALE, we respect your privacy and are committed to protecting the personal information you share with us. This policy explains how we collect, use, and safeguard your data.
            </p>

            <div className="space-y-0">
              {sections.map((section, i) => (
                <div
                  key={i}
                  className="py-8"
                  style={{ borderTop: "1px solid rgba(184,144,128,0.2)" }}
                >
                  <h2
                    style={{
                      fontFamily: "Cormorant Garamond, Georgia, serif",
                      fontWeight: 400,
                      fontSize: "clamp(1.125rem, 1.8vw, 1.375rem)",
                      color: "var(--color-espresso)",
                      lineHeight: 1.25,
                      marginBottom: "0.875rem",
                    }}
                  >
                    {section.title}
                  </h2>
                  <p
                    style={{
                      fontFamily: "Jost, system-ui, sans-serif",
                      fontWeight: 300,
                      fontSize: "0.9375rem",
                      lineHeight: 1.8,
                      color: "var(--color-taupe)",
                    }}
                  >
                    {section.body}
                  </p>
                </div>
              ))}
              <div style={{ borderTop: "1px solid rgba(184,144,128,0.2)" }} />
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section
        style={{
          background: "var(--color-sand)",
          paddingTop: "var(--section-sm)",
          paddingBottom: "var(--section-sm)",
        }}
      >
        <div
          className="max-w-[1180px] mx-auto text-center"
          style={{ paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }}
        >
          <p
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontStyle: "italic",
              fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
              color: "var(--color-taupe)",
              marginBottom: "1.25rem",
            }}
          >
            Questions about your data?
          </p>
          <Link
            href="/contact"
            className="label-md text-[#B89080] hover:text-[#7A6A5A] transition-colors border-b border-current pb-px"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </>
  );
}
