import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Reservation Received",
};

type Props = {
  searchParams: Promise<{ ref?: string }>;
};

export default async function ConfirmationPage({ searchParams }: Props) {
  const { ref } = await searchParams;

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "var(--color-linen)",
        paddingTop: "6rem",
        paddingBottom: "6rem",
        paddingLeft: "var(--gutter)",
        paddingRight: "var(--gutter)",
      }}
    >
      <div className="max-w-xl w-full text-center">
        {/* Decorative element */}
        <div
          className="mx-auto mb-10"
          style={{
            width: "1px",
            height: "4rem",
            background: "linear-gradient(180deg, transparent 0%, var(--color-clay) 100%)",
            opacity: 0.5,
          }}
        />

        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="h-px w-8 block" style={{ background: "var(--color-clay)", opacity: 0.5 }} />
          <span className="label-sm text-[#B89080]">Reservation Received</span>
          <span className="h-px w-8 block" style={{ background: "var(--color-clay)", opacity: 0.5 }} />
        </div>

        <h1
          style={{
            fontFamily: "Cormorant Garamond, Georgia, serif",
            fontWeight: 300,
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            lineHeight: 1.1,
            color: "var(--color-espresso)",
            marginBottom: "1.5rem",
          }}
        >
          You&apos;re almost set.
          <br />
          <span style={{ fontStyle: "italic", opacity: 0.8 }}>Deposit confirms your place.</span>
        </h1>

        <p
          style={{
            fontFamily: "Jost, system-ui, sans-serif",
            fontWeight: 300,
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "var(--color-taupe)",
            marginBottom: "1rem",
          }}
        >
          Your reservation has been received. To confirm your unit, please send
          the deposit to our booking contact below.
        </p>

        {ref && (
          <p
            style={{
              fontFamily: "Jost, system-ui, sans-serif",
              fontWeight: 300,
              fontSize: "0.8125rem",
              color: "var(--color-taupe-light)",
              marginBottom: "2.5rem",
            }}
          >
            Reference: <span style={{ fontWeight: 400, color: "var(--color-taupe)" }}>{ref}</span>
          </p>
        )}

        <div
          className="mx-auto mb-8 text-left"
          style={{
            maxWidth: "28rem",
            border: "1px solid rgba(184,144,128,0.3)",
            background: "rgba(250,247,242,0.65)",
            padding: "1.1rem 1.25rem",
          }}
        >
          <p
            style={{
              fontFamily: "Jost, system-ui, sans-serif",
              fontWeight: 400,
              fontSize: "0.75rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--color-taupe-light)",
              marginBottom: "0.8rem",
            }}
          >
            Deposit Payment Details
          </p>
          <p style={{ fontFamily: "Jost, system-ui, sans-serif", fontWeight: 300, fontSize: "0.9rem", color: "var(--color-taupe)", lineHeight: 1.8 }}>
            <strong style={{ color: "var(--color-espresso)", fontWeight: 400 }}>Maya Apter</strong>
            <br />
            Email:{" "}
            <a href="mailto:booking@exhale.co.il" style={{ color: "var(--color-espresso)" }}>
              booking@exhale.co.il
            </a>
            <br />
            Phone / WhatsApp:{" "}
            <a href="https://wa.me/972587280062" style={{ color: "var(--color-espresso)" }}>
              +972-58-728-0062
            </a>
            <br />
            Payment methods: Bit or Bank Transfer
          </p>
        </div>

        <p
          style={{
            fontFamily: "Jost, system-ui, sans-serif",
            fontWeight: 300,
            fontSize: "0.9375rem",
            lineHeight: 1.8,
            color: "var(--color-taupe)",
            marginBottom: "3rem",
          }}
        >
          Reservation is not confirmed until deposit has been paid. Once received,
          we will mark your reservation as reserved and send final details.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-3 px-7 py-3.5 transition-all duration-300 uppercase"
            style={{
              fontFamily: "Jost, system-ui, sans-serif",
              fontWeight: 400,
              fontSize: "0.75rem",
              letterSpacing: "0.18em",
              background: "var(--color-espresso)",
              color: "#FAF7F2",
            }}
          >
            Return Home
          </Link>
          <Link
            href="mailto:booking@exhale.co.il"
            className="label-md text-[#9B8F84] hover:text-[#7A6A5A] transition-colors"
          >
            Email Maya
          </Link>
        </div>
      </div>
    </div>
  );
}
