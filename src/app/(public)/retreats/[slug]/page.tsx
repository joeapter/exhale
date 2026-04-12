import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDateRange, retreatNights, formatCurrency } from "@/lib/utils";

// Sample retreat data — replace with: await getRetreatBySlug(slug)
const sampleRetreats: Record<string, SampleRetreat> = {
  "summer-escape-2026": {
    id: "1",
    slug: "summer-escape-2026",
    status: "PUBLISHED",
    title: "Summer Escape",
    tagline: "Stillness in the crater",
    overview: `Three days in the heart of Makhtesh Ramon — the world's largest erosion crater — during the soft heat of early August. The days are warm and alive. The nights are cool and scattered with stars. The rhythm is entirely your own.

This retreat is for women who are ready to stop. To eat well. To sleep. To move their bodies in the morning air. To sit around a fire in the evening with women they'll remember for years.

We provide everything. You bring yourself.`,
    philosophy: `Makhtesh Ramon is not gentle. It is vast and elemental and profoundly humbling. We chose it deliberately — because some kinds of rest require scale. Require the reminder that there is a world that existed long before your to-do list and will continue long after.

The crater teaches perspective without effort. You simply arrive, and it happens.`,
    location: "Makhtesh Ramon, Negev Desert",
    locationDetail: `Our site sits at the edge of the crater, with unobstructed views across the Ramon crater floor. We are within the Makhtesh Ramon Nature Reserve, 1 hour from Be'er Sheva and 3 hours from Tel Aviv.

Transfer options from Tel Aviv and Be'er Sheva are available for an additional fee. Detailed directions and a site map are sent upon registration.`,
    startDate: new Date("2026-08-07"),
    endDate: new Date("2026-08-09"),
    capacity: 16,
    spotsRemaining: 4,
    heroImage: null,
    accommodations: `All guests stay in spacious canvas bell tents furnished with a real raised bed, quality cotton linens, a bedside table, lanterns, and a small rug. Each tent faces the crater.

Shared tents accommodate two women — you may request to be paired with a friend, or we'll pair you thoughtfully. Private tents are available at a supplement. Both options share access to the communal bathhouse, which is private and beautifully appointed.`,
    dining: `Meals are central to the EXHALE experience. Our chef prepares three full meals each day using seasonal, local ingredients — hearty breakfasts, leisurely lunches, and evening meals eaten long and slowly around the communal table under the open sky.

We accommodate all dietary needs. Please include yours in your registration.`,
    inclusions: [
      "2 nights' accommodation in furnished canvas tent",
      "All meals from arrival dinner to departure breakfast",
      "Morning movement sessions (optional)",
      "Evening fire gathering",
      "Sound and breathwork sessions",
      "Nature walk with a desert guide",
      "Welcome amenity kit",
      "Access to all communal areas",
    ],
    exclusions: [
      "Transportation to and from the site",
      "Private massage (available on request)",
      "Alcoholic beverages",
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrive & Settle",
        activities: [
          "Afternoon arrival from 14:00",
          "Welcome tea and orientation",
          "Free time to settle, walk, rest",
          "Welcome dinner together at sunset",
          "Optional evening gathering around the fire",
        ],
      },
      {
        day: 2,
        title: "The Full Day",
        activities: [
          "Sunrise walk (optional) — 06:00",
          "Morning movement session — 07:30",
          "Full breakfast together — 09:00",
          "Free morning — rest, journal, explore, do nothing",
          "Long, leisurely lunch — 13:00",
          "Afternoon rest or guided nature walk",
          "Sound and breathwork session — 17:30",
          "Sunset dinner",
          "Fire gathering — 20:30",
        ],
      },
      {
        day: 3,
        title: "Settle & Depart",
        activities: [
          "Final morning movement — 07:30",
          "Closing breakfast — 09:00",
          "Closing circle",
          "Departure by 12:00",
        ],
      },
    ],
    packages: [
      {
        id: "p1",
        name: "Shared Tent",
        description: "Share a beautifully furnished bell tent with one other woman. We can pair you with a friend or match you thoughtfully.",
        fullPrice: 290000,
        depositAmount: 80000,
        available: 3,
      },
      {
        id: "p2",
        name: "Private Tent",
        description: "Your own tent, entirely to yourself. All the same furnishings and views — simply yours alone.",
        fullPrice: 390000,
        depositAmount: 100000,
        available: 1,
      },
    ],
    faqs: [
      {
        question: "What should I bring?",
        answer: "A packing list is sent after registration. In short: layers for warm days and cool desert nights, comfortable walking shoes, sunscreen, and whatever helps you rest. We provide linens, towels, and toiletry basics.",
      },
      {
        question: "Is this right for me if I've never done a retreat before?",
        answer: "Absolutely. EXHALE is not a spiritual intensive or an advanced wellness program. It is simply a beautiful few days in the desert. If you are ready for rest, you are ready for EXHALE.",
      },
      {
        question: "What if I have dietary restrictions?",
        answer: "Please share your dietary needs in your registration form. Our chef accommodates vegetarian, vegan, gluten-free, and most other requirements with genuine care.",
      },
      {
        question: "Can I come alone?",
        answer: "Yes — and many women do. EXHALE attracts warm, grounded women, and there is a natural ease to the atmosphere. You will not feel alone. You may also request a solo tent if you prefer your own space.",
      },
    ],
  },
};

type SampleRetreat = {
  id: string;
  slug: string;
  status: string;
  title: string;
  tagline?: string;
  overview: string;
  philosophy?: string;
  location: string;
  locationDetail?: string;
  startDate: Date;
  endDate: Date;
  capacity: number;
  spotsRemaining: number;
  heroImage: null;
  accommodations?: string;
  dining?: string;
  inclusions: string[];
  exclusions: string[];
  itinerary: { day: number; title: string; activities: string[] }[];
  packages: { id: string; name: string; description?: string; fullPrice: number; depositAmount: number; available: number }[];
  faqs: { question: string; answer: string }[];
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const retreat = sampleRetreats[slug];
  if (!retreat) return { title: "Retreat Not Found" };
  return {
    title: `${retreat.title} — ${retreat.startDate.getFullYear()}`,
    description: retreat.overview.substring(0, 160),
  };
}

export default async function RetreatDetailPage({ params }: Props) {
  const { slug } = await params;
  const retreat = sampleRetreats[slug];

  if (!retreat) notFound();

  const isSoldOut = retreat.status === "SOLD_OUT" || retreat.spotsRemaining === 0;
  const nights = retreatNights(retreat.startDate, retreat.endDate);

  return (
    <>
      {/* Hero */}
      <section
        className="relative overflow-hidden grain-overlay"
        style={{
          background: "linear-gradient(160deg, #E0D0BC 0%, #C8B094 50%, #B89878 100%)",
          paddingTop: "calc(var(--section) + 5rem)",
          paddingBottom: "var(--section)",
          minHeight: "70vh",
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <div className="absolute inset-0" aria-hidden>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(180deg, rgba(248,240,228,0.55) 0%, transparent 100%)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40%", background: "linear-gradient(180deg, transparent 0%, rgba(61,46,34,0.35) 100%)" }} />
          <div style={{ position: "absolute", top: "15%", left: "60%", width: "35%", height: "50%", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(212,149,106,0.3) 0%, transparent 70%)", filter: "blur(50px)" }} />
        </div>

        <div
          className="relative z-10 w-full max-w-[1180px] mx-auto"
          style={{ paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }}
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8">
            <Link href="/retreats" className="label-sm text-[#B89080] hover:text-[#7A6A5A] transition-colors">
              Retreats
            </Link>
            <span className="label-sm text-[#C9BAA8]">·</span>
            <span className="label-sm text-[#9B8F84]">{retreat.title}</span>
          </div>

          <div className="label-sm text-[#B89080] mb-4">{retreat.location}</div>

          <h1
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontWeight: 300,
              fontSize: "clamp(3rem, 7vw, 6rem)",
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              color: "#3D2E22",
              marginBottom: "0.75rem",
            }}
          >
            {retreat.title}
          </h1>

          {retreat.tagline && (
            <p
              style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: "clamp(1.25rem, 2.5vw, 2rem)",
                color: "rgba(61,46,34,0.7)",
                marginBottom: "1.75rem",
              }}
            >
              {retreat.tagline}
            </p>
          )}

          {/* Quick stats */}
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            <div>
              <div className="label-sm text-[#9B8F84]">Dates</div>
              <div style={{ fontFamily: "Jost, system-ui, sans-serif", fontWeight: 300, fontSize: "0.9375rem", color: "#3D2E22" }}>
                {formatDateRange(retreat.startDate, retreat.endDate)}
              </div>
            </div>
            <div>
              <div className="label-sm text-[#9B8F84]">Duration</div>
              <div style={{ fontFamily: "Jost, system-ui, sans-serif", fontWeight: 300, fontSize: "0.9375rem", color: "#3D2E22" }}>
                {nights} nights
              </div>
            </div>
            <div>
              <div className="label-sm text-[#9B8F84]">Group</div>
              <div style={{ fontFamily: "Jost, system-ui, sans-serif", fontWeight: 300, fontSize: "0.9375rem", color: "#3D2E22" }}>
                Up to {retreat.capacity} women
              </div>
            </div>
            {!isSoldOut && retreat.spotsRemaining <= 6 && (
              <div>
                <div className="label-sm text-[#9B8F84]">Availability</div>
                <div style={{ fontFamily: "Jost, system-ui, sans-serif", fontWeight: 300, fontSize: "0.9375rem", color: "var(--color-candle)" }}>
                  {retreat.spotsRemaining} places remaining
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main content + sidebar */}
      <section
        style={{
          background: "var(--color-linen)",
          paddingTop: "var(--section)",
          paddingBottom: "var(--section)",
        }}
      >
        <div
          className="max-w-[1180px] mx-auto grid md:grid-cols-12 gap-12 md:gap-16 items-start"
          style={{ paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }}
        >
          {/* Left — main content */}
          <div className="md:col-span-7 space-y-16">

            {/* Overview */}
            <div>
              <div className="flex items-center gap-3 mb-7">
                <span className="h-px w-5 block" style={{ background: "var(--color-clay)", opacity: 0.5 }} />
                <span className="label-sm text-[#B89080]">Overview</span>
              </div>
              <div className="prose-exhale space-y-4">
                {retreat.overview.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            {/* Itinerary */}
            <div>
              <div className="flex items-center gap-3 mb-7">
                <span className="h-px w-5 block" style={{ background: "var(--color-clay)", opacity: 0.5 }} />
                <span className="label-sm text-[#B89080]">Sample Itinerary</span>
              </div>
              <div className="space-y-0">
                {retreat.itinerary.map((day, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-12 py-8"
                    style={{ borderTop: "1px solid rgba(184,144,128,0.18)" }}
                  >
                    <div className="col-span-3">
                      <div className="label-sm text-[#C9BAA8]">Day {day.day}</div>
                      <div
                        style={{
                          fontFamily: "Cormorant Garamond, Georgia, serif",
                          fontWeight: 400,
                          fontSize: "1.125rem",
                          color: "var(--color-espresso)",
                          marginTop: "0.25rem",
                        }}
                      >
                        {day.title}
                      </div>
                    </div>
                    <div className="col-span-9">
                      <ul className="space-y-1.5">
                        {day.activities.map((a, j) => (
                          <li
                            key={j}
                            style={{
                              fontFamily: "Jost, system-ui, sans-serif",
                              fontWeight: 300,
                              fontSize: "0.9rem",
                              color: "var(--color-taupe)",
                              lineHeight: 1.6,
                            }}
                          >
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid rgba(184,144,128,0.18)" }} />
              </div>
            </div>

            {/* Accommodations */}
            {retreat.accommodations && (
              <div>
                <div className="flex items-center gap-3 mb-7">
                  <span className="h-px w-5 block" style={{ background: "var(--color-clay)", opacity: 0.5 }} />
                  <span className="label-sm text-[#B89080]">Accommodation</span>
                </div>
                <div className="prose-exhale">
                  {retreat.accommodations.split("\n\n").map((para, i) => (
                    <p key={i} style={{ marginTop: i > 0 ? "1.4em" : 0 }}>{para}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Dining */}
            {retreat.dining && (
              <div>
                <div className="flex items-center gap-3 mb-7">
                  <span className="h-px w-5 block" style={{ background: "var(--color-clay)", opacity: 0.5 }} />
                  <span className="label-sm text-[#B89080]">Dining</span>
                </div>
                <div className="prose-exhale">
                  {retreat.dining.split("\n\n").map((para, i) => (
                    <p key={i} style={{ marginTop: i > 0 ? "1.4em" : 0 }}>{para}</p>
                  ))}
                </div>
              </div>
            )}

            {/* What's included */}
            <div>
              <div className="flex items-center gap-3 mb-7">
                <span className="h-px w-5 block" style={{ background: "var(--color-clay)", opacity: 0.5 }} />
                <span className="label-sm text-[#B89080]">What's Included</span>
              </div>
              <ul className="space-y-3">
                {retreat.inclusions.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-4"
                  >
                    <span
                      className="mt-2 shrink-0 block rounded-full"
                      style={{ width: "4px", height: "4px", background: "var(--color-clay)", opacity: 0.7 }}
                    />
                    <span
                      style={{
                        fontFamily: "Jost, system-ui, sans-serif",
                        fontWeight: 300,
                        fontSize: "0.9375rem",
                        color: "var(--color-taupe)",
                        lineHeight: 1.6,
                      }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              {retreat.exclusions.length > 0 && (
                <div className="mt-6">
                  <p className="label-sm text-[#9B8F84] mb-3">Not included</p>
                  <ul className="space-y-2">
                    {retreat.exclusions.map((item, i) => (
                      <li
                        key={i}
                        style={{
                          fontFamily: "Jost, system-ui, sans-serif",
                          fontWeight: 300,
                          fontSize: "0.875rem",
                          color: "var(--color-taupe-light)",
                        }}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* FAQs */}
            {retreat.faqs.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-7">
                  <span className="h-px w-5 block" style={{ background: "var(--color-clay)", opacity: 0.5 }} />
                  <span className="label-sm text-[#B89080]">Questions</span>
                </div>
                <div className="space-y-0">
                  {retreat.faqs.map((faq, i) => (
                    <div
                      key={i}
                      className="py-7"
                      style={{ borderTop: "1px solid rgba(184,144,128,0.18)" }}
                    >
                      <h3
                        style={{
                          fontFamily: "Cormorant Garamond, Georgia, serif",
                          fontWeight: 400,
                          fontSize: "1.125rem",
                          color: "var(--color-espresso)",
                          marginBottom: "0.625rem",
                        }}
                      >
                        {faq.question}
                      </h3>
                      <p
                        style={{
                          fontFamily: "Jost, system-ui, sans-serif",
                          fontWeight: 300,
                          fontSize: "0.9rem",
                          color: "var(--color-taupe)",
                          lineHeight: 1.75,
                        }}
                      >
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                  <div style={{ borderTop: "1px solid rgba(184,144,128,0.18)" }} />
                </div>
              </div>
            )}
          </div>

          {/* Right — sticky booking card */}
          <div className="md:col-span-4 md:col-start-9 md:sticky md:top-24">
            <div
              style={{
                background: "var(--color-sand)",
                border: "1px solid rgba(184,144,128,0.25)",
                padding: "2rem",
              }}
            >
              <div className="label-sm text-[#B89080] mb-5">Select Package</div>

              <div className="space-y-4 mb-8">
                {retreat.packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    style={{
                      borderBottom: "1px solid rgba(184,144,128,0.2)",
                      paddingBottom: "1rem",
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div
                          style={{
                            fontFamily: "Cormorant Garamond, Georgia, serif",
                            fontWeight: 400,
                            fontSize: "1.125rem",
                            color: "var(--color-espresso)",
                          }}
                        >
                          {pkg.name}
                        </div>
                        {pkg.description && (
                          <p
                            style={{
                              fontFamily: "Jost, system-ui, sans-serif",
                              fontWeight: 300,
                              fontSize: "0.8125rem",
                              color: "var(--color-taupe-light)",
                              lineHeight: 1.6,
                              marginTop: "0.25rem",
                            }}
                          >
                            {pkg.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <div
                          style={{
                            fontFamily: "Cormorant Garamond, Georgia, serif",
                            fontWeight: 300,
                            fontSize: "1.375rem",
                            color: "var(--color-espresso)",
                            lineHeight: 1,
                          }}
                        >
                          {formatCurrency(pkg.fullPrice)}
                        </div>
                        <div className="label-sm text-[#9B8F84] mt-0.5">
                          or {formatCurrency(pkg.depositAmount)} deposit
                        </div>
                        {pkg.available === 0 ? (
                          <div className="label-sm mt-1" style={{ color: "var(--color-taupe-light)" }}>Sold out</div>
                        ) : pkg.available <= 2 ? (
                          <div className="label-sm mt-1" style={{ color: "var(--color-candle)" }}>
                            {pkg.available} left
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {isSoldOut ? (
                <div className="text-center py-4">
                  <p
                    className="label-sm text-[#9B8F84] mb-4"
                    style={{ letterSpacing: "0.12em" }}
                  >
                    This retreat is fully booked
                  </p>
                  <Link
                    href="/contact"
                    className="label-md text-[#7A6A5A] border-b border-current pb-px hover:text-[#3D2E22] transition-colors"
                  >
                    Join the waitlist
                  </Link>
                </div>
              ) : (
                <>
                  <Link
                    href={`/register/${retreat.slug}`}
                    className="flex items-center justify-center w-full py-3.5 transition-all duration-300 mb-3"
                    style={{
                      fontFamily: "Jost, system-ui, sans-serif",
                      fontWeight: 400,
                      fontSize: "0.75rem",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      background: "var(--color-espresso)",
                      color: "#FAF7F2",
                    }}
                  >
                    Reserve My Place
                  </Link>
                  <p
                    className="text-center"
                    style={{
                      fontFamily: "Jost, system-ui, sans-serif",
                      fontWeight: 300,
                      fontSize: "0.75rem",
                      color: "var(--color-taupe-light)",
                    }}
                  >
                    Secure your place with a deposit.
                    <br />
                    Full payment due 30 days before arrival.
                  </p>
                </>
              )}
            </div>

            {/* Contact nudge */}
            <div className="mt-6 text-center">
              <Link
                href="/contact"
                className="label-sm text-[#9B8F84] hover:text-[#7A6A5A] transition-colors"
              >
                Questions? We're here.
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
