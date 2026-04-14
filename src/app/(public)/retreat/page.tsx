import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "EXHALE Desert Escape — June 7–9",
  description:
    "A women-only desert retreat at Noor Glamping, Israel. June 7–9. Two nights of real rest, beautiful food, and open sky.",
};

function formatRetreatDates(start: Date, end: Date) {
  const opts: Intl.DateTimeFormatOptions = { month: "long", day: "numeric" };
  const s = start.toLocaleDateString("en-US", opts);
  const eDay = end.toLocaleDateString("en-US", { day: "numeric" });
  return `${s}–${eDay}`;
}

function nightsBetween(start: Date, end: Date) {
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export default async function RetreatPage() {
  const retreat = await prisma.retreat.findUnique({
    where: { slug: "exhale-desert-escape" },
    include: {
      packages: { where: { isActive: true }, orderBy: { sortOrder: "asc" } },
      faqs: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!retreat) notFound();

  const lowestPrice = Math.min(...retreat.packages.map((p) => p.fullPrice));
  const dates = formatRetreatDates(retreat.startDate, retreat.endDate);
  const nights = nightsBetween(retreat.startDate, retreat.endDate);

  const inclusions = retreat.inclusions.length > 0
    ? retreat.inclusions
    : [
        "2 nights in a furnished glamping tent",
        "All meals from arrival dinner to departure breakfast — and of course, rosé",
        "Morning movement sessions",
        "Welcome amenity kit",
        "And much more",
      ];

  const faqs = retreat.faqs.length > 0
    ? retreat.faqs.map((f) => ({ q: f.question, a: f.answer }))
    : [
        { q: "Who is this for?", a: "Women who are ready to rest. No retreat experience needed. Just a willingness to stop for a few days." },
        { q: "Can I come alone?", a: "Yes — and many women do. The atmosphere is warm and there's a natural ease among guests." },
        { q: "What about dietary needs?", a: "Our kitchen accommodates vegetarian, vegan, gluten-free, and most other requirements. Share yours when you register." },
        { q: "How do I get there?", a: "We recommend driving. Noor Glamping is about 1 hour from Be'er Sheva and 2.5 hours from Tel Aviv. Full directions are sent after registration." },
      ];

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ minHeight: "80vh", display: "flex", alignItems: "flex-end" }}>
        <div className="absolute inset-0">
          <Image
            src="/assets/noor/grounds.webp"
            alt="Noor Glamping"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(180deg, rgba(20,14,8,0.15) 0%, rgba(20,14,8,0.65) 100%)",
            }}
          />
        </div>

        <div
          className="relative z-10 w-full max-w-[1180px] mx-auto"
          style={{
            paddingLeft: "var(--gutter)",
            paddingRight: "var(--gutter)",
            paddingBottom: "clamp(3.5rem, 7vw, 6rem)",
          }}
        >
          <p className="label-sm mb-6" style={{ color: "rgba(228,210,185,0.6)" }}>
            {dates} &nbsp;·&nbsp; {nights} nights &nbsp;·&nbsp; {retreat.location}
          </p>
          <h1
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontWeight: 300,
              fontSize: "clamp(3rem, 7vw, 6rem)",
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              color: "#FAF7F2",
              maxWidth: "16ch",
            }}
          >
            EXHALE
            <br />
            <em style={{ fontStyle: "italic", opacity: 0.85 }}>Desert Escape</em>
          </h1>
        </div>
      </section>

      {/* ── Overview + booking ── */}
      <section
        style={{
          background: "var(--color-linen)",
          paddingTop: "var(--section)",
          paddingBottom: "var(--section)",
        }}
      >
        <div
          className="max-w-[1180px] mx-auto grid md:grid-cols-12 gap-16"
          style={{ paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }}
        >
          {/* Left — overview */}
          <div className="md:col-span-7">
            <p
              style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: "clamp(1.25rem, 2vw, 1.625rem)",
                lineHeight: 1.55,
                color: "var(--color-taupe)",
                marginBottom: "2rem",
                maxWidth: "46ch",
              }}
            >
              {retreat.overview}
            </p>

            <p className="prose-exhale" style={{ maxWidth: "52ch" }}>
              Everything is prepared. The only thing required of you is to show up.
            </p>

            {/* What's included */}
            <div className="mt-12">
              <div className="flex items-center gap-3 mb-7">
                <span className="h-px w-5 block" style={{ background: "var(--color-clay)", opacity: 0.5 }} />
                <span className="label-sm text-[#B89080]">What&apos;s included</span>
              </div>
              <div className="space-y-0">
                {inclusions.map((item, i) => (
                  <div
                    key={i}
                    className="py-3"
                    style={{ borderTop: "1px solid rgba(184,144,128,0.18)" }}
                  >
                    <p
                      style={{
                        fontFamily: "Jost, system-ui, sans-serif",
                        fontWeight: 300,
                        fontSize: "0.9375rem",
                        color: "var(--color-taupe)",
                      }}
                    >
                      {item}
                    </p>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid rgba(184,144,128,0.18)" }} />
              </div>
            </div>
          </div>

          {/* Right — booking panel */}
          <div className="md:col-span-4 md:col-start-9">
            <div
              style={{
                position: "sticky",
                top: "6rem",
                borderTop: "1px solid rgba(184,144,128,0.3)",
                paddingTop: "2rem",
              }}
            >
              <p
                style={{
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                  fontWeight: 300,
                  fontSize: "1.75rem",
                  color: "var(--color-espresso)",
                  lineHeight: 1.2,
                  marginBottom: "0.25rem",
                }}
              >
                From {formatCurrency(lowestPrice)}
              </p>
              <p className="label-sm text-[#9B8F84] mb-5">per person · all inclusive</p>

              <div className="space-y-3 mb-7">
                {[
                  { label: "Dates", value: dates },
                  { label: "Duration", value: `${nights} nights` },
                  { label: "Location", value: retreat.location },
                  { label: "Group size", value: "Women only" },
                  { label: "Availability", value: `${retreat.spotsRemaining} places left` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-baseline gap-4">
                    <span className="label-sm text-[#9B8F84]">{label}</span>
                    <span
                      style={{
                        fontFamily: "Jost, system-ui, sans-serif",
                        fontWeight: 300,
                        fontSize: "0.875rem",
                        color: "var(--color-espresso)",
                        textAlign: "right",
                      }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {retreat.status === "SOLD_OUT" ? (
                <p
                  className="w-full text-center py-4 uppercase"
                  style={{
                    fontFamily: "Jost, system-ui, sans-serif",
                    fontWeight: 400,
                    fontSize: "0.75rem",
                    letterSpacing: "0.18em",
                    background: "rgba(184,144,128,0.15)",
                    color: "var(--color-taupe)",
                    marginBottom: "1rem",
                  }}
                >
                  Sold Out
                </p>
              ) : (
                <Link
                  href={`/register/${retreat.slug}`}
                  className="block w-full text-center py-4 uppercase transition-all duration-300"
                  style={{
                    fontFamily: "Jost, system-ui, sans-serif",
                    fontWeight: 400,
                    fontSize: "0.75rem",
                    letterSpacing: "0.18em",
                    background: "var(--color-espresso)",
                    color: "#FAF7F2",
                    marginBottom: "1rem",
                  }}
                >
                  Reserve a Place
                </Link>
              )}

              <p
                className="text-center"
                style={{
                  fontFamily: "Jost, system-ui, sans-serif",
                  fontWeight: 300,
                  fontSize: "0.75rem",
                  color: "var(--color-taupe-light)",
                }}
              >
                Deposit option available.{" "}
                <Link href="/faq" style={{ borderBottom: "1px solid currentColor", paddingBottom: "1px" }}>
                  Questions?
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Photo pair ── */}
      <section
        style={{ background: "var(--color-sand)", paddingTop: "var(--section-sm)", paddingBottom: "var(--section-sm)" }}
      >
        <div
          className="max-w-[1180px] mx-auto grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"
          style={{ paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }}
        >
          {[
            { src: "/assets/noor/interior.webp", alt: "Tent interior" },
            { src: "/assets/noor/bed.webp", alt: "Sleeping tent" },
            { src: "/assets/noor/lounge.webp", alt: "Lounge space" },
          ].map((img) => (
            <div key={img.src} className="relative overflow-hidden" style={{ aspectRatio: "4/5" }}>
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQs ── */}
      <section
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
          <div className="md:col-span-7">
            <div className="flex items-center gap-3 mb-10">
              <span className="h-px w-5 block" style={{ background: "var(--color-clay)", opacity: 0.5 }} />
              <span className="label-sm text-[#B89080]">Questions</span>
            </div>
            <div>
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="py-7"
                  style={{ borderTop: "1px solid rgba(184,144,128,0.2)" }}
                >
                  <h3
                    style={{
                      fontFamily: "Cormorant Garamond, Georgia, serif",
                      fontWeight: 400,
                      fontSize: "clamp(1.125rem, 1.8vw, 1.375rem)",
                      color: "var(--color-espresso)",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {faq.q}
                  </h3>
                  <p
                    style={{
                      fontFamily: "Jost, system-ui, sans-serif",
                      fontWeight: 300,
                      fontSize: "0.9375rem",
                      lineHeight: 1.8,
                      color: "var(--color-taupe)",
                    }}
                  >
                    {faq.a}
                  </p>
                </div>
              ))}
              <div style={{ borderTop: "1px solid rgba(184,144,128,0.2)" }} />
            </div>

            <div className="mt-10">
              <Link
                href="/faq"
                className="label-md text-[#7A6A5A] hover:text-[#3D2E22] transition-colors"
                style={{ borderBottom: "1px solid rgba(122,106,90,0.35)", paddingBottom: "2px" }}
              >
                More questions answered
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section
        className="grain-overlay"
        style={{
          background: "var(--color-espresso)",
          paddingTop: "var(--section)",
          paddingBottom: "var(--section)",
        }}
      >
        <div
          className="max-w-[1180px] mx-auto text-center"
          style={{ paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }}
        >
          <p className="label-sm mb-6" style={{ color: "rgba(184,144,128,0.7)" }}>
            {dates} &nbsp;·&nbsp; {retreat.location} &nbsp;·&nbsp; {retreat.spotsRemaining} places left
          </p>
          <h2
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontWeight: 300,
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              lineHeight: 1.05,
              color: "#FAF7F2",
              marginBottom: "2.5rem",
            }}
          >
            Ready to
            <em style={{ fontStyle: "italic" }}> exhale?</em>
          </h2>
          {retreat.status !== "SOLD_OUT" && (
            <Link
              href={`/register/${retreat.slug}`}
              style={{
                fontFamily: "Jost, system-ui, sans-serif",
                fontWeight: 400,
                fontSize: "0.75rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#FAF7F2",
                borderBottom: "1px solid rgba(250,247,242,0.35)",
                paddingBottom: "3px",
              }}
            >
              Reserve a place
            </Link>
          )}
        </div>
      </section>
    </>
  );
}
