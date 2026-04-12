import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Booking Confirmed",
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
          <span className="label-sm text-[#B89080]">Booking Confirmed</span>
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
          You're coming.
          <br />
          <span style={{ fontStyle: "italic", opacity: 0.8 }}>We can't wait.</span>
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
          Your place has been reserved and your payment processed. A confirmation
          has been sent to your email with everything you need to know.
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
          Between now and then — rest. We'll be in touch with a packing list,
          directions, and all the practical details you need, closer to the date.
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
            href="/contact"
            className="label-md text-[#9B8F84] hover:text-[#7A6A5A] transition-colors"
          >
            Questions? Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}
