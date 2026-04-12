const experiences = [
  {
    number: "01",
    title: "The Setting",
    body: "Deep in the Negev desert, where the horizon is wide and the silence is total. Our glamping site is intimate, beautifully arranged, and designed to feel like an extension of the landscape — not a break from it.",
  },
  {
    number: "02",
    title: "The Accommodation",
    body: "Furnished canvas tents with real beds, soft linens, lantern light, and views of the desert at night. Private enough to feel like your own. Open enough to feel held by something much larger.",
  },
  {
    number: "03",
    title: "The Food",
    body: "Meals prepared with intention. Fresh, abundant, seasonal, beautiful. We eat together slowly — around a long table, under the sky. Food that nourishes without making a show of it.",
  },
  {
    number: "04",
    title: "The Programming",
    body: "Morning movement in the desert air. Evening gatherings around a fire. Optional sound, breath, and creative sessions. Generous time to do absolutely nothing. A pace designed to actually work.",
  },
  {
    number: "05",
    title: "The Company",
    body: "Women who have stepped away from the noise to remember themselves. There is something rare about a room of women who've all made the same courageous choice to rest.",
  },
];

export default function HomeExperience() {
  return (
    <section
      className="relative"
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

        {/* Header */}
        <div className="grid md:grid-cols-12 mb-16 md:mb-20">
          <div className="md:col-span-7">
            <div className="flex items-center gap-3 mb-7">
              <span className="h-px w-5 block" style={{ background: "var(--color-clay)", opacity: 0.5 }} />
              <span className="label-sm text-[#B89080]">The Experience</span>
            </div>
            <h2
              style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontWeight: 300,
                fontSize: "clamp(2rem, 4vw, 3.25rem)",
                lineHeight: 1.15,
                color: "var(--color-espresso)",
              }}
            >
              Every detail considered.
              <br />
              <span style={{ fontStyle: "italic" }}>Nothing left to chance.</span>
            </h2>
          </div>
        </div>

        {/* Experience items — flowing list, not cards */}
        <div className="space-y-0">
          {experiences.map((item, i) => (
            <div
              key={item.number}
              className="grid md:grid-cols-12 py-10 md:py-12"
              style={{
                borderTop: "1px solid rgba(184,144,128,0.2)",
              }}
            >
              {/* Number */}
              <div className="md:col-span-1 mb-4 md:mb-0">
                <span
                  className="label-sm text-[#C9BAA8]"
                  style={{ letterSpacing: "0.08em" }}
                >
                  {item.number}
                </span>
              </div>

              {/* Title */}
              <div className="md:col-span-3 mb-3 md:mb-0 md:col-start-2">
                <h3
                  style={{
                    fontFamily: "Cormorant Garamond, Georgia, serif",
                    fontWeight: 400,
                    fontSize: "clamp(1.25rem, 2vw, 1.625rem)",
                    color: "var(--color-espresso)",
                    lineHeight: 1.2,
                  }}
                >
                  {item.title}
                </h3>
              </div>

              {/* Body */}
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
                  {item.body}
                </p>
              </div>
            </div>
          ))}

          {/* Last border */}
          <div style={{ borderTop: "1px solid rgba(184,144,128,0.2)" }} />
        </div>
      </div>
    </section>
  );
}
