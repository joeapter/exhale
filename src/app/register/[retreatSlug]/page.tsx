import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import RegistrationForm from "@/components/forms/RegistrationForm";

export const metadata: Metadata = {
  title: "Reserve a Place",
  description: "Reserve your place at an EXHALE desert retreat.",
};

type Props = {
  params: Promise<{ retreatSlug: string }>;
};

export default async function RegisterPage({ params }: Props) {
  const { retreatSlug } = await params;

  const retreat = await prisma.retreat.findUnique({
    where: { slug: retreatSlug },
    include: {
      packages: {
        where: { available: { gt: 0 } },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!retreat || retreat.status === "SOLD_OUT" || retreat.status === "CANCELED") {
    notFound();
  }

  const registrationRetreat = {
    id: retreat.id,
    slug: retreat.slug,
    title: retreat.title,
    location: retreat.location,
    startDate: retreat.startDate,
    endDate: retreat.endDate,
    spotsRemaining: retreat.spotsRemaining,
    packages: retreat.packages.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      occupancy: p.occupancy,
      images: p.images,
      fullPrice: p.fullPrice,
      depositAmount: p.depositAmount,
      available: p.available,
    })),
  };

  if (retreat.spotsRemaining === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--color-linen)", paddingTop: "6rem" }}
      >
        <div className="text-center max-w-sm px-8">
          <h1
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontWeight: 300,
              fontSize: "2.5rem",
              color: "var(--color-espresso)",
              marginBottom: "1rem",
            }}
          >
            This retreat is fully booked.
          </h1>
          <p className="prose-exhale mb-8">
            We'd love to add you to the waitlist and notify you if a place becomes available.
          </p>
          <a href="/contact" className="label-md text-[#B89080] border-b border-current pb-px">
            Join the waitlist
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "var(--color-linen)",
        paddingTop: "calc(var(--section) + 4rem)",
        paddingBottom: "var(--section)",
        minHeight: "100vh",
      }}
    >
      <div
        className="max-w-[1180px] mx-auto grid md:grid-cols-12 gap-12 items-start"
        style={{ paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }}
      >
        {/* Left — context */}
        <div className="md:col-span-4 md:sticky md:top-24">
          <div className="flex items-center gap-3 mb-7">
            <span className="h-px w-5 block" style={{ background: "var(--color-clay)", opacity: 0.5 }} />
            <span className="label-sm text-[#B89080]">Reserve a Place</span>
          </div>
          <h1
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontWeight: 300,
              fontSize: "clamp(1.875rem, 3vw, 2.75rem)",
              lineHeight: 1.15,
              color: "var(--color-espresso)",
              marginBottom: "0.5rem",
            }}
          >
            {retreat.title}
          </h1>
          <p
            style={{
              fontFamily: "Jost, system-ui, sans-serif",
              fontWeight: 300,
              fontSize: "0.875rem",
              color: "var(--color-taupe)",
              marginBottom: "1rem",
            }}
          >
            {retreat.location}
          </p>
          <p
            style={{
              fontFamily: "Jost, system-ui, sans-serif",
              fontWeight: 300,
              fontSize: "0.875rem",
              color: "var(--color-taupe)",
            }}
          >
            {retreat.startDate.toLocaleDateString("en-IL", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            {" — "}
            {retreat.endDate.toLocaleDateString("en-IL", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>

          <div
            className="mt-8 pt-6"
            style={{ borderTop: "1px solid rgba(184,144,128,0.2)" }}
          >
            <p
              style={{
                fontFamily: "Jost, system-ui, sans-serif",
                fontWeight: 300,
                fontSize: "0.8125rem",
                color: "var(--color-taupe-light)",
                lineHeight: 1.75,
              }}
            >
              Your place is secured with a deposit. The remaining balance is due 30 days before the retreat.
            </p>
            {retreat.spotsRemaining <= 5 && (
              <p
                className="mt-3"
                style={{
                  fontFamily: "Jost, system-ui, sans-serif",
                  fontWeight: 400,
                  fontSize: "0.8125rem",
                  color: "var(--color-candle)",
                }}
              >
                {retreat.spotsRemaining} places remaining
              </p>
            )}
          </div>
        </div>

        {/* Right — form */}
        <div className="md:col-span-7 md:col-start-6">
          <RegistrationForm retreat={registrationRetreat} />
        </div>
      </div>
    </div>
  );
}
