// Full-width atmospheric section — desert imagery and editorial copy
export default function HomeAtmosphere() {
  return (
    <section className="relative overflow-hidden" aria-label="Desert atmosphere">

      {/* Full-bleed atmospheric panel */}
      <div
        className="relative flex items-center justify-center overflow-hidden grain-overlay"
        style={{
          minHeight: "70vh",
          background: "linear-gradient(160deg, #C8B094 0%, #B89878 30%, #A88060 60%, #906850 100%)",
        }}
      >
        {/* Layered desert atmosphere */}
        <div className="absolute inset-0" aria-hidden>
          {/* Sky */}
          <div
            className="absolute top-0 left-0 right-0"
            style={{
              height: "45%",
              background: "linear-gradient(180deg, #E8D8C0 0%, #D8C4A8 60%, transparent 100%)",
              opacity: 0.7,
            }}
          />

          {/* Warm glow source */}
          <div
            className="absolute"
            style={{
              top: "15%",
              left: "38%",
              width: "40%",
              height: "50%",
              borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(212,149,106,0.45) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />

          {/* Dune silhouettes */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: "40%",
              background: "linear-gradient(180deg, transparent 0%, rgba(80,56,36,0.5) 100%)",
            }}
          />

          {/* Foreground dark warmth */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: "25%",
              background: "linear-gradient(180deg, transparent 0%, rgba(52,36,20,0.7) 100%)",
            }}
          />

          {/* Candle/fire glow suggestion at bottom center */}
          <div
            className="absolute"
            style={{
              bottom: "18%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "20%",
              height: "20%",
              borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(212,149,106,0.5) 0%, rgba(180,100,60,0.2) 40%, transparent 70%)",
              filter: "blur(20px)",
            }}
          />
        </div>

        {/* Centered editorial text */}
        <div className="relative z-10 text-center max-w-2xl px-8">
          <p
            className="mb-6"
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "clamp(0.75rem, 1vw, 0.8125rem)",
              letterSpacing: "0.22em",
              color: "rgba(250,247,242,0.65)",
              textTransform: "uppercase",
            }}
          >
            Negev Desert · Israel
          </p>

          <h2
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontWeight: 300,
              fontSize: "clamp(2.25rem, 5vw, 4.5rem)",
              lineHeight: 1.1,
              color: "#FAF7F2",
              letterSpacing: "-0.01em",
              marginBottom: "2rem",
            }}
          >
            Where the desert
            <br />
            <span style={{ fontStyle: "italic" }}>holds you.</span>
          </h2>

          <p
            style={{
              fontFamily: "Jost, system-ui, sans-serif",
              fontWeight: 300,
              fontSize: "clamp(0.875rem, 1.3vw, 1rem)",
              lineHeight: 1.8,
              color: "rgba(250,247,242,0.7)",
              maxWidth: "42ch",
              margin: "0 auto 2.5rem",
            }}
          >
            The Negev teaches you something about scale. About how small
            the noise in your head really is. About how much sky exists,
            and how quiet the world becomes when you let it.
          </p>

          <div
            className="mx-auto"
            style={{ width: "1px", height: "3.5rem", background: "linear-gradient(180deg, rgba(250,247,242,0.3) 0%, transparent 100%)" }}
          />
        </div>
      </div>

      {/* Below panel — dual column story text */}
      <div
        className="relative"
        style={{
          background: "var(--color-linen)",
          paddingTop: "var(--section)",
          paddingBottom: "var(--section)",
        }}
      >
        <div
          className="max-w-[1180px] mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-start"
          style={{ paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }}
        >
          <div>
            <h3
              style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontWeight: 300,
                fontSize: "clamp(1.625rem, 2.5vw, 2.25rem)",
                lineHeight: 1.2,
                color: "var(--color-espresso)",
                marginBottom: "1.25rem",
              }}
            >
              Not a program.
              <br />
              <span style={{ fontStyle: "italic" }}>An atmosphere.</span>
            </h3>
            <p className="prose-exhale">
              EXHALE is not a schedule of workshops. It is a carefully held
              space. There are invitations — to move, to gather, to reflect —
              but nothing is required of you except your presence. You are
              allowed to sleep. To sit. To walk alone at dawn. To simply be
              somewhere beautiful and let that be enough.
            </p>
          </div>

          <div>
            <h3
              style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontWeight: 300,
                fontSize: "clamp(1.625rem, 2.5vw, 2.25rem)",
                lineHeight: 1.2,
                color: "var(--color-espresso)",
                marginBottom: "1.25rem",
              }}
            >
              Built around
              <br />
              <span style={{ fontStyle: "italic" }}>women's rhythms.</span>
            </h3>
            <p className="prose-exhale">
              We understand that women carry a lot. We know how rarely
              rest is truly prioritized. Every decision at EXHALE — the
              pacing, the food, the programming, the sleeping arrangement —
              has been made with awareness of that reality, and with genuine
              care for what it takes to truly let go.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
