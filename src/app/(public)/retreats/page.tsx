import type { Metadata } from "next";
import Link from "next/link";
import { formatDateRange, retreatNights, formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Retreats",
  description: "Upcoming EXHALE desert retreats. Limited places available.",
};

// Sample data — replace with DB fetch after Prisma migration
const sampleRetreats = [
  {
    id: "1",
    slug: "summer-escape-2026",
    status: "PUBLISHED" as const,
    title: "Summer Escape",
    tagline: "Stillness in the crater",
    location: "Makhtesh Ramon, Negev",
    startDate: new Date("2026-08-07"),
    endDate: new Date("2026-08-09"),
    capacity: 16,
    spotsRemaining: 4,
    heroImage: null,
    packages: [
      { id: "p1", name: "Shared Tent", fullPrice: 290000, depositAmount: 80000, available: 3 },
      { id: "p2", name: "Private Tent", fullPrice: 390000, depositAmount: 100000, available: 1 },
    ],
  },
  {
    id: "2",
    slug: "autumn-stillness-2026",
    status: "PUBLISHED" as const,
    title: "Autumn Stillness",
    tagline: "Desert colors at golden hour",
    location: "Ein Avdat, Negev",
    startDate: new Date("2026-10-16"),
    endDate: new Date("2026-10-18"),
    capacity: 14,
    spotsRemaining: 14,
    heroImage: null,
    packages: [
      { id: "p3", name: "Shared Tent", fullPrice: 290000, depositAmount: 80000, available: 10 },
      { id: "p4", name: "Private Tent", fullPrice: 390000, depositAmount: 100000, available: 4 },
    ],
  },
];

export default async function RetreatsPage() {
  // Uncomment to use live data:
  // const retreats = await getPublishedRetreats();
  const retreats = sampleRetreats;

  return (
    <>
      {/* Header */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #EDE4D8 0%, #E0D0BC 60%, #D0BCA4 100%)",
          paddingTop: "calc(var(--section) + 4rem)",
          paddingBottom: "var(--section)",
        }}
      >
        <div className="absolute inset-0 grain-overlay" aria-hidden>
          <div
            className="absolute top-0 left-0 right-0"
            style={{ height: "50%", background: "linear-gradient(180deg, rgba(250,245,238,0.5) 0%, transparent 100%)" }}
          />
        </div>

        <div
          className="relative z-10 max-w-[1180px] mx-auto"
          style={{ paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }}
        >
          <div className="flex items-center gap-3 mb-7">
            <span className="h-px w-5 block" style={{ background: "rgba(184,144,128,0.6)" }} />
            <span className="label-sm text-[#B89080]">2026 Season</span>
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
            Upcoming
            <br />
            <span style={{ fontStyle: "italic" }}>Retreats</span>
          </h1>
          <p
            className="mt-6 max-w-sm"
            style={{
              fontFamily: "Jost, system-ui, sans-serif",
              fontWeight: 300,
              fontSize: "0.9375rem",
              lineHeight: 1.8,
              color: "var(--color-taupe)",
            }}
          >
            Each retreat is held for a small group of women only.
            Places are limited and fill early.
          </p>
        </div>
      </section>

      {/* Retreats list */}
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
          {retreats.length === 0 ? (
            <div className="text-center py-20">
              <p
                style={{
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                  fontStyle: "italic",
                  fontSize: "1.5rem",
                  color: "var(--color-taupe)",
                }}
              >
                New dates will be announced soon.
              </p>
              <p className="mt-4 label-sm text-[#B89080]">
                <Link href="/contact" className="hover:text-[#7A6A5A] transition-colors">
                  Contact us to be notified
                </Link>
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {retreats.map((retreat, i) => {
                const isSoldOut = (retreat.status as string) === "SOLD_OUT" || retreat.spotsRemaining === 0;
                const nights = retreatNights(retreat.startDate, retreat.endDate);
                const lowestPrice = Math.min(...retreat.packages.map((p) => p.fullPrice));

                return (
                  <div
                    key={retreat.id}
                    className="grid md:grid-cols-12 items-start"
                    style={{
                      paddingTop: "3.5rem",
                      paddingBottom: "3.5rem",
                      borderTop: "1px solid rgba(184,144,128,0.2)",
                    }}
                  >
                    {/* Date */}
                    <div className="md:col-span-2 mb-4 md:mb-0">
                      <div
                        style={{
                          fontFamily: "Cormorant Garamond, Georgia, serif",
                          fontWeight: 300,
                          fontSize: "clamp(1.75rem, 2.5vw, 2.5rem)",
                          lineHeight: 1.1,
                          color: "var(--color-clay)",
                        }}
                      >
                        {retreat.startDate.toLocaleDateString("en-IL", { day: "numeric" })}
                        <span style={{ opacity: 0.6 }}>–</span>
                        {retreat.endDate.toLocaleDateString("en-IL", { day: "numeric" })}
                      </div>
                      <div className="label-sm text-[#9B8F84] mt-1">
                        {retreat.startDate.toLocaleDateString("en-IL", { month: "long", year: "numeric" })}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="md:col-span-5 md:col-start-3 mb-5 md:mb-0">
                      <div className="label-sm text-[#B89080] mb-2">{retreat.location}</div>
                      <h2
                        style={{
                          fontFamily: "Cormorant Garamond, Georgia, serif",
                          fontWeight: 300,
                          fontSize: "clamp(1.625rem, 2.5vw, 2.25rem)",
                          lineHeight: 1.15,
                          color: "var(--color-espresso)",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {retreat.title}
                      </h2>
                      {retreat.tagline && (
                        <p
                          style={{
                            fontFamily: "Cormorant Garamond, Georgia, serif",
                            fontStyle: "italic",
                            fontWeight: 300,
                            fontSize: "1.0625rem",
                            color: "var(--color-taupe)",
                          }}
                        >
                          {retreat.tagline}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-4">
                        <span className="label-sm text-[#9B8F84]">{nights} nights</span>
                        <span className="label-sm text-[#9B8F84]">Up to {retreat.capacity} women</span>
                        {!isSoldOut && retreat.spotsRemaining <= 5 && (
                          <span className="label-sm" style={{ color: "var(--color-candle)" }}>
                            {retreat.spotsRemaining} places left
                          </span>
                        )}
                        {isSoldOut && (
                          <span className="label-sm" style={{ color: "var(--color-taupe-light)" }}>
                            Sold out
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price + CTA */}
                    <div className="md:col-span-3 md:col-start-9 md:text-right flex flex-col md:items-end gap-4">
                      <div>
                        <div className="label-sm text-[#9B8F84] mb-1">From</div>
                        <div
                          style={{
                            fontFamily: "Cormorant Garamond, Georgia, serif",
                            fontWeight: 300,
                            fontSize: "clamp(1.5rem, 2vw, 2rem)",
                            color: "var(--color-espresso)",
                            lineHeight: 1,
                          }}
                        >
                          {formatCurrency(lowestPrice)}
                        </div>
                        <div className="label-sm text-[#9B8F84] mt-1">per person</div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Link
                          href={`/retreats/${retreat.slug}`}
                          className="inline-flex items-center justify-center px-6 py-2.5 transition-all duration-300"
                          style={{
                            fontFamily: "Jost, system-ui, sans-serif",
                            fontWeight: 400,
                            fontSize: "0.75rem",
                            letterSpacing: "0.16em",
                            textTransform: "uppercase",
                            border: "1px solid rgba(184,144,128,0.5)",
                            color: "var(--color-espresso)",
                          }}
                        >
                          View Details
                        </Link>

                        {!isSoldOut && (
                          <Link
                            href={`/register/${retreat.slug}`}
                            className="inline-flex items-center justify-center px-6 py-2.5 transition-all duration-300"
                            style={{
                              fontFamily: "Jost, system-ui, sans-serif",
                              fontWeight: 400,
                              fontSize: "0.75rem",
                              letterSpacing: "0.16em",
                              textTransform: "uppercase",
                              background: "var(--color-espresso)",
                              color: "#FAF7F2",
                            }}
                          >
                            Reserve a Place
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div style={{ borderTop: "1px solid rgba(184,144,128,0.2)" }} />
            </div>
          )}
        </div>
      </section>

      {/* Bottom note */}
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
              fontSize: "clamp(1.25rem, 2vw, 1.75rem)",
              color: "var(--color-taupe)",
              marginBottom: "1rem",
            }}
          >
            Not sure which retreat is right for you?
          </p>
          <Link
            href="/contact"
            className="label-md text-[#B89080] hover:text-[#7A6A5A] transition-colors duration-300 border-b border-current pb-px"
          >
            We're happy to help you choose
          </Link>
        </div>
      </section>
    </>
  );
}
