import Link from "next/link";

export default function HomeRetreatCTA() {
  return (
    <section
      className="relative overflow-hidden grain-overlay"
      style={{
        background: "var(--color-espresso)",
        paddingTop: "var(--section)",
        paddingBottom: "var(--section)",
      }}
    >
      {/* Subtle warmth layer */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 80%, rgba(212,149,106,0.12) 0%, transparent 70%)",
        }}
      />

      <div
        className="relative z-10 max-w-[1180px] mx-auto"
        style={{ paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }}
      >
        <div className="max-w-xl">
          <div className="flex items-center gap-3 mb-9">
            <span className="h-px w-5 block" style={{ background: "rgba(184,144,128,0.5)" }} />
            <span className="label-sm" style={{ color: "rgba(184,144,128,0.9)" }}>
              Upcoming Retreat
            </span>
          </div>

          <h2
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontWeight: 300,
              fontSize: "clamp(2rem, 4.5vw, 3.75rem)",
              lineHeight: 1.1,
              color: "#FAF7F2",
              letterSpacing: "-0.01em",
              marginBottom: "1.5rem",
            }}
          >
            Summer Escape
            <br />
            <span style={{ fontStyle: "italic", opacity: 0.85 }}>Makhtesh Ramon</span>
          </h2>

          <p
            style={{
              fontFamily: "Jost, system-ui, sans-serif",
              fontWeight: 300,
              fontSize: "0.9375rem",
              lineHeight: 1.8,
              color: "rgba(228,216,201,0.7)",
              marginBottom: "0.75rem",
            }}
          >
            7–9 August 2026 · 3 days, 2 nights · Limited to 16 women
          </p>

          <p
            style={{
              fontFamily: "Jost, system-ui, sans-serif",
              fontWeight: 300,
              fontSize: "0.9375rem",
              lineHeight: 1.8,
              color: "rgba(228,216,201,0.7)",
              marginBottom: "3rem",
            }}
          >
            The crater at dusk. Cool desert mornings. Fire-lit evenings.
            Meals eaten slowly. Rest that actually lands. A few places remain.
          </p>

          <div className="flex flex-wrap items-baseline gap-x-8 gap-y-4">
            <Link
              href="/retreats/summer-escape-2026"
              style={{
                fontFamily: "Jost, system-ui, sans-serif",
                fontWeight: 400,
                fontSize: "0.75rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#FAF7F2",
                borderBottom: "1px solid rgba(250,247,242,0.35)",
                paddingBottom: "3px",
                transition: "border-color 0.3s ease",
              }}
            >
              View Retreat Details
            </Link>

            <Link
              href="/retreats"
              style={{
                fontFamily: "Jost, system-ui, sans-serif",
                fontWeight: 300,
                fontSize: "0.8125rem",
                color: "rgba(184,144,128,0.65)",
                letterSpacing: "0.05em",
                transition: "color 0.3s ease",
              }}
            >
              All retreats
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
