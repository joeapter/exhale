import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about EXHALE retreats.",
};

const faqs = [
  {
    category: "The Retreat",
    items: [
      {
        q: "Who is EXHALE for?",
        a: "EXHALE is for women who are ready to rest. You don't need to be spiritual, experienced with retreats, or have any particular background. If you are a woman who is tired, or simply ready for three days of genuine space — this is for you.",
      },
      {
        q: "Is this a spiritual retreat?",
        a: "Not in a religious sense. EXHALE draws from a philosophy of intentional rest, beauty, and presence. There are elements of reflection and connection built into the experience, but there is no doctrine or prescribed spiritual practice required.",
      },
      {
        q: "How many women attend each retreat?",
        a: "We keep our retreats small — a maximum of 16 women per retreat. This is a deliberate choice. Smallness creates intimacy. It allows us to prepare food with care, to know each guest by name, and to hold the space in a way that isn't possible with larger groups.",
      },
      {
        q: "Do I have to participate in everything?",
        a: "Nothing is required. The morning movement session, the evening gathering, the guided walk — all are invitations, not obligations. You are welcome to sleep, to sit alone, to read, to simply be.",
      },
    ],
  },
  {
    category: "Practical",
    items: [
      {
        q: "Where exactly is the retreat held?",
        a: "Our retreats are held at carefully chosen sites in the Israeli desert — primarily in the Negev. The precise location and detailed directions are shared with registered guests approximately three weeks before the retreat.",
      },
      {
        q: "How do I get there?",
        a: "We recommend driving. Most sites are 2–3 hours from Tel Aviv and 1 hour from Be'er Sheva. Carpooling coordination via our guest WhatsApp group is available. Shuttle options from Tel Aviv may be arranged for an additional fee — contact us to enquire.",
      },
      {
        q: "What should I bring?",
        a: "A full packing list is sent after registration. In brief: layers (desert nights are cool even in summer), comfortable walking shoes, sunscreen, a good book, and whatever helps you rest. We provide linens, towels, and basic toiletries.",
      },
      {
        q: "Is the desert too hot in summer?",
        a: "Desert heat is different from coastal heat. It is dry, which makes it far more manageable. Our programming is scheduled around the cooler parts of the day — early mornings and evenings. The midday hours are for shade, rest, and swimming (where available).",
      },
    ],
  },
  {
    category: "Health & Dietary",
    items: [
      {
        q: "Can you accommodate my dietary needs?",
        a: "Yes. Our kitchen accommodates vegetarian, vegan, gluten-free, and most other dietary needs with genuine care and creativity. Please share your requirements clearly in your registration form.",
      },
      {
        q: "Are there any health requirements?",
        a: "EXHALE is appropriate for most women in general good health. We ask that you share any health conditions relevant to your stay in your registration — not to gatekeep, but to care for you well. If you have specific concerns, please reach out and we'll discuss.",
      },
    ],
  },
  {
    category: "Booking & Payment",
    items: [
      {
        q: "Can I pay a deposit to secure my place?",
        a: "Yes. You may secure your place with a deposit at the time of registration. The remaining balance is due 30 days before the retreat start date. Full payment is also accepted at registration.",
      },
      {
        q: "What is your cancellation policy?",
        a: "Cancellations made more than 60 days before the retreat receive a full refund less a small administrative fee. Cancellations between 30–60 days are eligible for a 50% refund or a credit toward a future retreat. Cancellations within 30 days are non-refundable, but we will do our best to fill your place and offer a partial credit. Full policy details are shared at registration.",
      },
      {
        q: "What if a retreat is sold out?",
        a: "Contact us to be added to our waitlist. We frequently have cancellations, and waitlisted guests are notified immediately when a place becomes available.",
      },
    ],
  },
];

export default function FaqPage() {
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
            Questions &
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
            {faqs.map((section, si) => (
              <div key={section.category} className={si > 0 ? "mt-16" : ""}>
                <div className="flex items-center gap-3 mb-8">
                  <span className="h-px w-5 block" style={{ background: "var(--color-clay)", opacity: 0.5 }} />
                  <span className="label-sm text-[#B89080]">{section.category}</span>
                </div>

                <div className="space-y-0">
                  {section.items.map((item, qi) => (
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
                        {item.q}
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
                        {item.a}
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
            We'd love to hear from you
          </Link>
        </div>
      </section>
    </>
  );
}
