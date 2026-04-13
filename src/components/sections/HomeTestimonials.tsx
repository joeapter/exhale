const testimonials = [
  {
    quote: "I arrived exhausted and left feeling like myself again. Not a new version. The original one.",
    name: "Ronit A.",
    location: "Tel Aviv",
  },
  {
    quote: "The desert does something to you — it makes everything else feel very far away, in the best possible sense.",
    name: "Yael M.",
    location: "Jerusalem",
  },
];

export default function HomeTestimonials() {
  return (
    <section
      style={{
        background: "var(--color-dune)",
        paddingTop: "var(--section)",
        paddingBottom: "var(--section)",
      }}
    >
      <div
        className="max-w-[1180px] mx-auto"
        style={{ paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }}
      >
        <div className="flex items-center gap-3 mb-14 md:mb-20">
          <span className="h-px w-5 block" style={{ background: "var(--color-clay)", opacity: 0.5 }} />
          <span className="label-sm text-[#B89080]">Women who've been</span>
        </div>

        <div>
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="grid md:grid-cols-12"
              style={{
                paddingBottom: "clamp(4rem, 7vw, 6rem)",
                marginBottom: i < testimonials.length - 1 ? "clamp(4rem, 7vw, 6rem)" : 0,
              }}
            >
              <div className={i % 2 === 0 ? "md:col-span-7 md:col-start-1" : "md:col-span-7 md:col-start-5"}>
                <blockquote
                  style={{
                    fontFamily: "Cormorant Garamond, Georgia, serif",
                    fontStyle: "italic",
                    fontWeight: 300,
                    fontSize: "clamp(1.375rem, 2.2vw, 1.875rem)",
                    lineHeight: 1.5,
                    color: "var(--color-espresso)",
                    marginBottom: "1.5rem",
                  }}
                >
                  {t.quote}
                </blockquote>
                <p
                  style={{
                    fontFamily: "Jost, system-ui, sans-serif",
                    fontWeight: 300,
                    fontSize: "0.6875rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--color-taupe-light)",
                  }}
                >
                  {t.name}
                  <span className="mx-2" style={{ opacity: 0.4 }}>·</span>
                  {t.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
