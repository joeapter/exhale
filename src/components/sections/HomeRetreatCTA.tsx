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
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 80%, rgba(212,149,106,0.1) 0%, transparent 70%)",
        }}
      />

      <div
        className="relative z-10 max-w-[1180px] mx-auto"
        style={{ paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }}
      >
        <div className="max-w-lg">
          <div className="flex items-center gap-3 mb-9">
            <span className="h-px w-5 block" style={{ background: "rgba(184,144,128,0.5)" }} />
            <span className="label-sm" style={{ color: "rgba(184,144,128,0.9)" }}>
              Upcoming
            </span>
          </div>

          <h2
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontWeight: 300,
              fontSize: "clamp(2.25rem, 5vw, 4rem)",
              lineHeight: 1.05,
              color: "#FAF7F2",
              letterSpacing: "-0.01em",
              marginBottom: "1.25rem",
            }}
          >
            EXHALE
            <br />
            <em style={{ fontStyle: "italic", opacity: 0.85 }}>Desert Escape</em>
          </h2>

          <p
            style={{
              fontFamily: "Jost, system-ui, sans-serif",
              fontWeight: 300,
              fontSize: "0.9375rem",
              color: "rgba(228,216,201,0.65)",
              lineHeight: 1.8,
              marginBottom: "0.5rem",
            }}
          >
            June 7–9 &nbsp;·&nbsp; 2 nights &nbsp;·&nbsp; Noor Glamping, Israel
          </p>

          <p
            style={{
              fontFamily: "Jost, system-ui, sans-serif",
              fontWeight: 300,
              fontSize: "0.9375rem",
              color: "rgba(228,216,201,0.65)",
              lineHeight: 1.8,
              marginBottom: "3rem",
            }}
          >
            A small group of women. Limited places.
          </p>

          <div className="flex flex-wrap items-baseline gap-x-8 gap-y-4">
            <Link
              href="/retreat"
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
              Reserve a place
            </Link>
            <Link
              href="/retreat"
              style={{
                fontFamily: "Jost, system-ui, sans-serif",
                fontWeight: 300,
                fontSize: "0.8125rem",
                color: "rgba(184,144,128,0.65)",
                letterSpacing: "0.05em",
              }}
            >
              View details
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
