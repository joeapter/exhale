import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about EXHALE retreats.",
};

export default async function FaqPage() {
  const rawFaqs = await prisma.faq.findMany({
    where: { isActive: true },
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });

  // Group by category
  const grouped = rawFaqs.reduce<Record<string, { question: string; answer: string }[]>>((acc, faq) => {
    const cat = faq.category ?? "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push({ question: faq.question, answer: faq.answer });
    return acc;
  }, {});

  const sections = Object.entries(grouped);

  return (
    <>
      {/* Header */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #EDE4D8 0%, #E0D0BC 60%, #D4C0A8 100%)",
          paddingTop: "calc(var(--section) + 4rem)",
          paddingBottom: "var(--section)",
        }}
      >
        <div className="absolute inset-0 grain-overlay" aria-hidden>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(180deg, rgba(250,245,238,0.5) 0%, transparent 100%)" }} />
        </div>

        <div
          className="relative z-10 max-w-[1180px] mx-auto"
          style={{ paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }}
        >
          <div className="flex items-center gap-3 mb-7">
            <span className="h-px w-5 block" style={{ background: "rgba(184,144,128,0.6)" }} />
            <span className="label-sm text-[#B89080]">Common Questions</span>
          </div>
          <h1
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontWeight: 300,
              fontSize: "clamp(3rem, 7vw, 6rem)",
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              color: "#3D2E22",
            }}
          >
            Questions &amp;
            <br />
            <span style={{ fontStyle: "italic" }}>Answers</span>
          </h1>
        </div>
      </section>

      {/* FAQ content */}
      <section
        style={{
          background: "var(--color-linen)",
          paddingTop: "var(--section)",
          paddingBottom: "var(--section)",
        }}
      >
        <div
          className="max-w-[1180px] mx-auto"
          style={{ paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }}
        >
          <div className="max-w-2xl">
            {sections.length === 0 ? (
              <p style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.9375rem", color: "var(--color-taupe-light)" }}>
                Coming soon.
              </p>
            ) : sections.map(([category, items], si) => (
              <div key={category} className={si > 0 ? "mt-16" : ""}>
                <div className="flex items-center gap-3 mb-8">
                  <span className="h-px w-5 block" style={{ background: "var(--color-clay)", opacity: 0.5 }} />
                  <span className="label-sm text-[#B89080]">{category}</span>
                </div>

                <div className="space-y-0">
                  {items.map((item, qi) => (
                    <div
                      key={qi}
                      className="py-7"
                      style={{ borderTop: "1px solid rgba(184,144,128,0.2)" }}
                    >
                      <h3
                        style={{
                          fontFamily: "Cormorant Garamond, Georgia, serif",
                          fontWeight: 400,
                          fontSize: "clamp(1.125rem, 1.8vw, 1.375rem)",
                          color: "var(--color-espresso)",
                          lineHeight: 1.25,
                          marginBottom: "0.875rem",
                        }}
                      >
                        {item.question}
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
                        {item.answer}
                      </p>
                    </div>
                  ))}
                  <div style={{ borderTop: "1px solid rgba(184,144,128,0.2)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still have questions */}
      <section
        style={{
          background: "var(--color-sand)",
          paddingTop: "var(--section-sm)",
          paddingBottom: "var(--section-sm)",
        }}
      >
        <div
          className="max-w-[1180px] mx-auto text-center"
          style={{ paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }}
        >
          <p
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontStyle: "italic",
              fontSize: "clamp(1.375rem, 2.5vw, 2rem)",
              color: "var(--color-taupe)",
              marginBottom: "1.25rem",
            }}
          >
            Still have a question?
          </p>
          <Link
            href="/contact"
            className="label-md text-[#B89080] hover:text-[#7A6A5A] transition-colors border-b border-current pb-px"
          >
            We&apos;d love to hear from you
          </Link>
        </div>
      </section>
    </>
  );
}
