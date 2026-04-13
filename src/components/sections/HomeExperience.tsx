const experiences = [
  {
    number: "01",
    title: "The Place",
    body: "Noor Glamping sits in the desert of southern Israel — furnished tents, hot baths, hammocks, and a long horizon.",
  },
  {
    number: "02",
    title: "The Rest",
    body: "Morning movement in the desert air. Fire in the evenings. Time in between that belongs entirely to you.",
  },
  {
    number: "03",
    title: "The Food",
    body: "Nourishing, seasonal, beautiful. We eat together slowly — around a long table, under the sky.",
  },
  {
    number: "04",
    title: "The Company",
    body: "Women who've made the same choice to stop and rest. Something rare happens when you're in that room.",
  },
];

export default function HomeExperience() {
  return (
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

        <div className="grid md:grid-cols-12 mb-14">
          <div className="md:col-span-7">
            <div className="flex items-center gap-3 mb-7">
              <span className="h-px w-5 block" style={{ background: "var(--color-clay)", opacity: 0.5 }} />
              <span className="label-sm text-[#B89080]">What to expect</span>
            </div>
            <h2
              style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontWeight: 300,
                fontSize: "clamp(2rem, 4vw, 3.25rem)",
                lineHeight: 1.1,
                color: "var(--color-espresso)",
              }}
            >
              Everything considered.
              <br />
              <em style={{ fontStyle: "italic" }}>Nothing required of you.</em>
            </h2>
          </div>
        </div>

        <div>
          {experiences.map((item) => (
            <div
              key={item.number}
              className="grid md:grid-cols-12 py-9"
              style={{ borderTop: "1px solid rgba(184,144,128,0.2)" }}
            >
              <div className="md:col-span-1 mb-3 md:mb-0">
                <span className="label-sm text-[#C9BAA8]" style={{ letterSpacing: "0.08em" }}>
                  {item.number}
                </span>
              </div>
              <div className="md:col-span-3 mb-2 md:mb-0 md:col-start-2">
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
          <div style={{ borderTop: "1px solid rgba(184,144,128,0.2)" }} />
        </div>
      </div>
    </section>
  );
}
