import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Facilitators",
  description: "Meet the women leading and holding space at the EXHALE desert retreat.",
};

export default async function FacilitatorsPage() {
  const facilitators = await prisma.facilitator.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <>
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #EDE4D8 0%, #E0D0BC 60%, #D4C0A8 100%)",
          paddingTop: "calc(var(--section) + 4rem)",
          paddingBottom: "var(--section)",
        }}
      >
        <div className="absolute inset-0 grain-overlay" aria-hidden>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "50%",
              background: "linear-gradient(180deg, rgba(250,245,238,0.5) 0%, transparent 100%)",
            }}
          />
          <div
            className="absolute"
            style={{
              top: "10%",
              right: "8%",
              width: "35%",
              height: "60%",
              borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(212,149,106,0.18) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
        </div>

        <div
          className="relative z-10 max-w-[1180px] mx-auto"
          style={{ paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }}
        >
          <div className="flex items-center gap-3 mb-7">
            <span className="h-px w-5 block" style={{ background: "rgba(184,144,128,0.6)" }} />
            <span className="label-sm text-[#B89080]">The People</span>
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
            Meet Our
            <br />
            <span style={{ fontStyle: "italic" }}>Facilitators</span>
          </h1>
          <p
            className="mt-6 max-w-lg"
            style={{
              fontFamily: "Jost, system-ui, sans-serif",
              fontWeight: 300,
              fontSize: "0.9375rem",
              lineHeight: 1.8,
              color: "var(--color-taupe)",
            }}
          >
            Each facilitator brings her own depth, gift, and presence to the retreat — creating an experience that nourishes on every level.
          </p>
        </div>
      </section>

      {/* Facilitators */}
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
          {facilitators.length === 0 ? (
            <p
              style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontStyle: "italic",
                fontSize: "1.375rem",
                color: "var(--color-taupe)",
              }}
            >
              Facilitators will be announced soon.
            </p>
          ) : (
            <div className="space-y-0">
              {facilitators.map((f, i) => (
                <div
                  key={f.id}
                  className="py-16 grid md:grid-cols-12 gap-10 md:gap-16 items-start"
                  style={{
                    borderTop: i === 0 ? "none" : "1px solid rgba(184,144,128,0.2)",
                  }}
                >
                  {/* Photo column */}
                  <div className="md:col-span-4">
                    {f.image ? (
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          paddingBottom: "120%",
                          overflow: "hidden",
                        }}
                      >
                        <Image
                          src={f.image}
                          alt={f.name}
                          fill
                          className="object-cover"
                          style={{ objectPosition: "center top" }}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          paddingBottom: "120%",
                          background: "linear-gradient(160deg, #E8DDD0 0%, #D4C0A8 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily: "Cormorant Garamond, Georgia, serif",
                            fontStyle: "italic",
                            fontSize: "clamp(3rem, 8vw, 5rem)",
                            color: "rgba(184,144,128,0.5)",
                          }}
                        >
                          {f.name[0]}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Text column */}
                  <div className="md:col-span-7 md:col-start-6">
                    <div className="flex items-center gap-3 mb-5">
                      <span className="h-px w-5 block" style={{ background: "var(--color-clay)", opacity: 0.5 }} />
                      {f.title ? (
                        <span className="label-sm text-[#B89080]">{f.title}</span>
                      ) : (
                        <span className="label-sm text-[#B89080]">Facilitator</span>
                      )}
                    </div>

                    <h2
                      style={{
                        fontFamily: "Cormorant Garamond, Georgia, serif",
                        fontWeight: 300,
                        fontSize: "clamp(2rem, 4vw, 3rem)",
                        lineHeight: 1.1,
                        letterSpacing: "-0.01em",
                        color: "var(--color-espresso)",
                        marginBottom: "1.5rem",
                      }}
                    >
                      {f.name}
                    </h2>

                    <p
                      style={{
                        fontFamily: "Jost, system-ui, sans-serif",
                        fontWeight: 300,
                        fontSize: "0.9375rem",
                        lineHeight: 1.85,
                        color: "var(--color-taupe)",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {f.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
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
            Ready to join us?
          </p>
          <Link
            href="/retreat"
            className="label-md text-[#B89080] hover:text-[#7A6A5A] transition-colors border-b border-current pb-px"
          >
            Reserve a place
          </Link>
        </div>
      </section>
    </>
  );
}
