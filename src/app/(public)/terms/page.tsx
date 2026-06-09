import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for booking and attending an EXHALE retreat.",
};

const sections = [
  {
    title: "Booking & Registration",
    body: `A reservation is confirmed only upon receipt of a deposit or full payment as selected at checkout. Spots are limited and are allocated on a first-come, first-served basis. EXHALE reserves the right to decline a registration at its discretion.`,
  },
  {
    title: "Payment",
    body: `All prices are quoted in ILS (New Israeli Shekel) and are inclusive of VAT where applicable. When booking with a deposit, the remaining balance is due no later than 30 days before the retreat start date. Failure to settle the balance by the due date may result in cancellation of your booking without refund of the deposit.`,
  },
  {
    title: "Cancellation by You",
    body: `If you need to cancel your booking, please notify us in writing at booking@exhale.co.il as soon as possible. Cancellations received more than 60 days before the retreat start date will receive a full refund minus any payment-processing fees. Cancellations received 30–60 days before the start date will forfeit the deposit. Cancellations within 30 days of the start date are non-refundable. In all cases, your place may be transferred to another person subject to our approval.`,
  },
  {
    title: "Cancellation by EXHALE",
    body: `In the unlikely event that EXHALE cancels a retreat, you will receive a full refund of all amounts paid. EXHALE is not liable for any additional costs incurred (travel, accommodation, etc.) resulting from cancellation.`,
  },
  {
    title: "Health & Participation",
    body: `By registering, you confirm that you are in good health and able to participate in retreat activities. You agree to inform us of any medical conditions, dietary requirements, or physical limitations that may affect your participation. EXHALE reserves the right to exclude any participant whose conduct or condition poses a risk to themselves or others, without refund.`,
  },
  {
    title: "Liability",
    body: `EXHALE takes all reasonable precautions to ensure the safety and comfort of participants. However, participation in retreat activities is at your own risk. EXHALE is not liable for loss, injury, or damage to personal property during the retreat, except where such loss or damage results from our negligence.`,
  },
  {
    title: "Photography & Media",
    body: `EXHALE may photograph or film retreat activities for promotional purposes. By attending, you consent to your image being used in such materials. If you prefer not to be photographed, please inform us in writing before the retreat.`,
  },
  {
    title: "Changes to These Terms",
    body: `EXHALE reserves the right to amend these terms at any time. The version in effect at the time of your booking governs your registration. We will notify you of any material changes that affect an existing booking.`,
  },
  {
    title: "Contact",
    body: `For any questions regarding these terms, please contact us at booking@exhale.co.il.`,
  },
];

export default function TermsPage() {
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
            Terms &amp;
            <br />
            <span style={{ fontStyle: "italic" }}>Conditions</span>
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
              Please read these terms carefully before completing your registration. By booking a place at an EXHALE retreat, you agree to be bound by the following terms and conditions.
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
            Have a question about your booking?
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
