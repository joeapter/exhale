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
                Spas that felt clinical. Retreats that felt like courses.
                Wellness weekends that felt like someone else's idea of healing.
                We wanted something different. Something honest and beautiful
                and specific to the way women actually need to recover.
              </p>
              <p>
                So we went to the desert. We set up beautiful tents. We cooked
                extraordinary food. We created space for women to arrive without
                an agenda, stay without obligation, and leave genuinely
                restored.
              </p>
              <p>
                EXHALE is not trying to fix you. It is simply a few days where
                nothing is required of you, and everything is prepared for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section
        style={{
          background: "var(--color-sand)",
          paddingTop: "var(--section)",
          paddingBottom: "var(--section)",
        }}
      >
        <div
          className="max-w-[1180px] mx-auto"
          style={{ paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }}
        >
          <div className="flex items-center gap-3 mb-14">
            <span className="h-px w-5 block" style={{ background: "var(--color-clay)", opacity: 0.5 }} />
            <span className="label-sm text-[#B89080]">What We Believe</span>
          </div>

          {[
            {
              title: "Rest is not a reward.",
              body: "It is not something you have to earn. It does not require justification. It is not a treat for after the hard work is done. Rest is necessary, ongoing, and entirely your right — always.",
            },
            {
              title: "Beauty is nourishment.",
              body: "A beautiful setting is not a luxury add-on. The way a space looks and feels changes what is possible inside it. We invest in beauty because it matters to the experience of rest.",
            },
            {
              title: "Women hold each other well.",
              body: "There is something particular that happens in a gathering of women who have all made the same courageous choice to step away. We honor that, and we create space for it.",
            },
            {
              title: "Silence is a language.",
              body: "We do not fill every moment with programming or noise. We trust you to know what you need, and we create the conditions for you to find it.",
            },
          ].map((v, i) => (
            <div
              key={i}
              className="grid md:grid-cols-12 py-10 md:py-12"
              style={{ borderTop: "1px solid rgba(184,144,128,0.2)" }}
            >
              <div className="md:col-span-4">
                <h3
                  style={{
                    fontFamily: "Cormorant Garamond, Georgia, serif",
                    fontWeight: 400,
                    fontSize: "clamp(1.125rem, 1.8vw, 1.5rem)",
                    color: "var(--color-espresso)",
                    lineHeight: 1.25,
                    marginBottom: "0.75rem",
                  }}
                >
                  {v.title}
                </h3>
              </div>
              <div className="md:col-span-6 md:col-start-6">
                <p
                  style={{
                    fontFamily: "Jost, system-ui, sans-serif",
                    fontWeight: 300,
                    fontSize: "0.9375rem",
                    lineHeight: 1.8,
                    color: "var(--color-taupe)",
                  }}
                >
                  {v.body}
                </p>
              </div>
            </div>
          ))}
          <div style={{ borderTop: "1px solid rgba(184,144,128,0.2)" }} />
        </div>
      </section>

      {/* Founder */}
      <section
        style={{
          background: "var(--color-linen)",
          paddingTop: "var(--section)",
          paddingBottom: "var(--section)",
        }}
      >
        <div
          className="max-w-[1180px] mx-auto grid md:grid-cols-12 gap-12 items-start"
          style={{ paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }}
        >
          {/* Founder portrait placeholder */}
          <div className="md:col-span-4">
            <div
              className="aspect-[3/4] grain-overlay relative"
              style={{
                background: "linear-gradient(160deg, #D8C9B5 0%, #C0A88C 60%, #A88870 100%)",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: "radial-gradient(ellipse 80% 80% at 50% 30%, rgba(240,220,190,0.4) 0%, transparent 70%)",
                }}
              />
            </div>
          </div>

          {/* Founder text */}
          <div className="md:col-span-7 md:col-start-6 md:pt-6">
            <div className="flex items-center gap-3 mb-7">
              <span className="h-px w-5 block" style={{ background: "var(--color-clay)", opacity: 0.5 }} />
              <span className="label-sm text-[#B89080]">The Founder</span>
            </div>

            <h2
              style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontWeight: 300,
                fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                lineHeight: 1.2,
                color: "var(--color-espresso)",
                marginBottom: "1.5rem",
              }}
            >
              Created with love
              <br />
              <span style={{ fontStyle: "italic" }}>by women, for women.</span>
            </h2>

            <div className="prose-exhale space-y-4">
              <p>
                EXHALE was founded by a group of women who felt the absence of a
                retreat that truly understood them. Not a spa, not a seminar,
                not a spiritual intensive — something warmer, more honest, and
                beautifully simpler than any of those.
              </p>
              <p>
                Our team includes designers, chefs, facilitators, and guides who
                share a single commitment: that every woman who comes to
                EXHALE leaves having genuinely rested, nourished, and
                remembered something essential about herself.
              </p>
              <p>
                We are based in Israel. We love the desert with our whole hearts.
                We believe in long meals and early mornings and the particular
                magic of women who have chosen to be present.
              </p>
            </div>

            <div className="mt-8">
              <a
                href="/contact"
                className="label-md text-[#7A6A5A] hover:text-[#3D2E22] transition-colors duration-300"
                style={{ borderBottom: "1px solid rgba(122,106,90,0.35)", paddingBottom: "2px" }}
              >
                Get in touch
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
