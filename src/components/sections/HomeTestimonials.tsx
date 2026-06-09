const testimonials = [
  {
    quote:
      "Maya and team! This was such an amazing, beautiful experience. The place, the food, the setup, and the company were all so wonderful. Thank you so much. You really delivered!",
    name: "Effie S.",
  },
  {
    quote: "Thank you Maya and everyone involved. It was amazing in every way.",
    name: "Racheli F.",
  },
  {
    quote:
      "Maya, thank you so much for a truly unforgettable experience. You pulled it off with class and finesse. A wonderful five-star retreat: relaxing and rejuvenating, with the perfect blend of activities and restfulness in a gorgeous, serene environment, complete with an awesome group of women. Please do this again and keep us posted. Thank you from deep within my heart.",
    name: "Jane S.",
    featured: true,
  },
  {
    quote:
      "I don't have the words to say thank you properly. This retreat was truly a treat. The food, the women, the accommodations, the calmness, and I can go on and on. Bottom line: thank you, and I am looking forward to doing this again.",
    name: "Rivka R.",
  },
  {
    quote:
      "Thank you for a well-run and well-thought-out retreat. Thank you for all of the attention to detail that made it so special. The food was amazing!",
    name: "Devorah R.",
  },
  {
    quote:
      "I think I will be reaping the benefits from the conversations and involvement over the past two days for a while.",
    name: "Cyndi S.",
  },
];

export default function HomeTestimonials() {
  const featured = testimonials.find((testimonial) => testimonial.featured);
  const supporting = testimonials.filter((testimonial) => !testimonial.featured);

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
        <div className="grid gap-10 md:grid-cols-12 md:gap-0 mb-16 md:mb-24">
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <span
                className="h-px w-5 block"
                style={{ background: "var(--color-clay)", opacity: 0.5 }}
              />
              <span className="label-sm text-[#B89080]">In their words</span>
            </div>
            <h2
              style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontWeight: 300,
                fontSize: "clamp(2.25rem, 5vw, 4rem)",
                lineHeight: 1.05,
                color: "var(--color-espresso)",
              }}
            >
              What it felt
              <br />
              <em style={{ fontStyle: "italic", color: "var(--color-taupe)" }}>like to be there.</em>
            </h2>
          </div>

          {featured && (
            <figure
              className="md:col-span-7 md:col-start-6"
              style={{
                borderLeft: "1px solid rgba(184,144,128,0.35)",
                paddingLeft: "clamp(1.5rem, 4vw, 4rem)",
              }}
            >
              <span
                aria-hidden
                style={{
                  display: "block",
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                  fontSize: "5rem",
                  fontWeight: 300,
                  lineHeight: 0.65,
                  color: "var(--color-clay)",
                  opacity: 0.45,
                  marginBottom: "1.5rem",
                }}
              >
                &ldquo;
              </span>
              <blockquote
                style={{
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 300,
                  fontSize: "clamp(1.5rem, 2.8vw, 2.25rem)",
                  lineHeight: 1.45,
                  color: "var(--color-espresso)",
                  marginBottom: "1.75rem",
                }}
              >
                {featured.quote}
              </blockquote>
              <figcaption className="label-sm text-[#9B8F84]">{featured.name}</figcaption>
            </figure>
          )}
        </div>

        <div
          className="grid md:grid-cols-2"
          style={{ borderTop: "1px solid rgba(184,144,128,0.28)" }}
        >
          {supporting.map((testimonial, index) => (
            <figure
              key={testimonial.name}
              className={`py-10 md:py-14 ${
                index === supporting.length - 1
                  ? "md:col-span-2 md:px-[clamp(4rem,12vw,12rem)] md:text-center"
                  : index % 2 === 1
                    ? "md:pl-[clamp(2rem,4vw,4rem)]"
                    : "md:pr-[clamp(2rem,4vw,4rem)]"
              }`}
              style={{
                borderBottom: "1px solid rgba(184,144,128,0.28)",
              }}
            >
              <blockquote
                style={{
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 300,
                  fontSize: "clamp(1.25rem, 2vw, 1.625rem)",
                  lineHeight: 1.55,
                  color: "var(--color-espresso)",
                  marginBottom: "1.5rem",
                }}
              >
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="label-sm text-[#9B8F84]">{testimonial.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
