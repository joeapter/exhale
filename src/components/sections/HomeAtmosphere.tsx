import Image from "next/image";

export default function HomeAtmosphere() {
  return (
    <section className="relative overflow-hidden" aria-label="The place">

      {/* Full-bleed photo */}
      <div className="relative overflow-hidden" style={{ minHeight: "70vh" }}>
        <Image
          src="/assets/noor/fire.webp"
          alt="Evening fire at Noor Glamping"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(20,14,8,0.1) 0%, rgba(20,14,8,0.5) 100%)",
          }}
          aria-hidden
        />

        {/* Centered text */}
        <div className="absolute inset-0 flex items-end justify-center pb-16 md:pb-24 z-10">
          <div className="text-center px-8">
            <h2
              style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontWeight: 300,
                fontSize: "clamp(2rem, 5vw, 4.5rem)",
                lineHeight: 1.1,
                color: "#FAF7F2",
                letterSpacing: "-0.01em",
              }}
            >
              Noor Glamping
              <br />
              <em style={{ fontStyle: "italic", opacity: 0.85 }}>Desert. South Israel.</em>
            </h2>
          </div>
        </div>
      </div>

      {/* Below — asymmetric editorial text */}
      <div
        style={{
          background: "var(--color-linen)",
          paddingTop: "var(--section)",
          paddingBottom: "var(--section)",
        }}
      >
        <div
          className="max-w-[1180px] mx-auto grid md:grid-cols-12"
          style={{ paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }}
        >
          <div className="md:col-span-7 md:col-start-1 mb-14 md:mb-0">
            <h3
              style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontWeight: 300,
                fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                lineHeight: 1.15,
                color: "var(--color-espresso)",
                marginBottom: "1.25rem",
              }}
            >
              An atmosphere,
              <em style={{ fontStyle: "italic" }}> not a schedule.</em>
            </h3>
            <p className="prose-exhale" style={{ maxWidth: "48ch" }}>
              There are invitations — to move, to gather, to be still —
              but nothing is required of you except your presence.
              You are allowed to sleep in. To walk alone. To simply be
              somewhere beautiful.
            </p>
          </div>

          <div
            className="md:col-span-4 md:col-start-9"
            style={{ paddingTop: "clamp(2rem, 4vw, 4rem)" }}
          >
            <div
              style={{
                width: "1px",
                height: "2.5rem",
                background: "var(--color-clay)",
                opacity: 0.3,
                marginBottom: "1.5rem",
              }}
            />
            <p
              style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: "clamp(1.125rem, 1.6vw, 1.375rem)",
                lineHeight: 1.55,
                color: "var(--color-taupe)",
              }}
            >
              Every detail — the pacing, the food, the space —
              has been made with genuine care for what women
              actually need to let go.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
