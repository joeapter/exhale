import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story behind EXHALE — a women-only desert retreat born from the belief that rest is not a luxury, it is a necessity.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #E8DDD0 0%, #D8C9B5 60%, #C8B094 100%)",
          paddingTop: "calc(var(--section) + 4rem)",
          paddingBottom: "var(--section)",
          minHeight: "60vh",
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        {/* Atmospheric layers */}
        <div className="absolute inset-0 grain-overlay" aria-hidden>
          <div
            className="absolute top-0 left-0 right-0"
            style={{
              height: "60%",
              background: "linear-gradient(180deg, rgba(248,240,228,0.6) 0%, transparent 100%)",
            }}
          />
          <div
            className="absolute"
            style={{
              top: "10%",
              right: "10%",
              width: "40%",
              height: "50%",
              borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(212,149,106,0.25) 0%, transparent 70%)",
              filter: "blur(50px)",
            }}
          />
        </div>

        <div
          className="relative z-10 max-w-[1180px] mx-auto w-full"
          style={{ paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }}
        >
          <div className="flex items-center gap-3 mb-7">
            <span className="h-px w-5 block" style={{ background: "rgba(184,144,128,0.6)" }} />
            <span className="label-sm text-[#B89080]">Our Story</span>
          </div>
          <h1
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontWeight: 300,
              fontSize: "clamp(3rem, 7vw, 6rem)",
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              color: "#3D2E22",
              maxWidth: "14ch",
            }}
          >
            About
            <br />
            <span style={{ fontStyle: "italic" }}>EXHALE</span>
          </h1>
        </div>
      </section>

      {/* Philosophy */}
      <section
        style={{
          background: "var(--color-linen)",
          paddingTop: "var(--section)",
          paddingBottom: "var(--section)",
        }}
      >
        <div
          className="max-w-[1180px] mx-auto grid md:grid-cols-12 gap-12"
          style={{ paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }}
        >
          <div className="md:col-span-5">
            <h2
              style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontWeight: 300,
                fontSize: "clamp(1.75rem, 3.5vw, 3rem)",
                lineHeight: 1.15,
                color: "var(--color-espresso)",
              }}
            >
              Why EXHALE
              <br />
              <span style={{ fontStyle: "italic" }}>exists.</span>
            </h2>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <div className="prose-exhale space-y-5">
              <p>
                EXHALE was born from a simple observation: the women around
                us — brilliant, generous, capable women — were running on empty.
                Not because they hadn't tried to rest. But because the places
                they went to rest weren't actually restful.
              </p>
              <p>
                We wanted something different. Something honest and beautiful
                and incorporated the healing properties of the desert.
              </p>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
