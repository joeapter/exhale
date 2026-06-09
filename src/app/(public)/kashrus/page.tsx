import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kashrus",
  description: "Kashrus certification information for EXHALE retreat — under the supervision of Rabbi Lewin's Mehadrin Hechsher.",
};

const certifications = [
  {
    img: "/assets/Kashrus/badatz-eidah.png",
    alt: "Badatz Eidah Chareidis",
    name: "Badatz Eidah Chareidis",
    note: "Acceptable for use without issue.",
  },
  {
    img: "/assets/Kashrus/rubin.png",
    alt: "Badatz Mehadrin (Rav Rubin)",
    name: "Badatz Mehadrin (Rav Rubin)",
    note: "Acceptable for use without issue.",
  },
  {
    img: "/assets/Kashrus/sheiris.png",
    alt: "Sheiris Yisroel",
    name: "Sheiris Yisroel",
    note: "Acceptable for use.",
  },
  {
    img: "/assets/Kashrus/kehilos.png",
    alt: "Kehilos",
    name: "Kehilos",
    note: "Acceptable for use without issue for meat & chicken only.",
  },
  {
    img: "/assets/Kashrus/landau.png",
    alt: "Landau",
    name: "Landau",
    note: "Acceptable for use.",
  },
  {
    img: "/assets/Kashrus/tenuva.png",
    alt: "Vaadat Mehadrin of Tenuva",
    name: "Vaadat Mehadrin of Tenuva (Dairy)",
    note: "Acceptable for use without issue.",
  },
  {
    img: "/assets/Kashrus/beefland.png",
    alt: "Beefland",
    name: '"Beefland" meats — Rav Shmuel Aryeh Levine',
    note: "Acceptable for use without issue.",
    hebrew: 'בשחיטה מהודרת של הרה"ג שמואל אריה לוין שליט"א ראש ישיבת חפץ חיים בארגנטינה',
  },
  {
    img: "/assets/Kashrus/gross.png",
    alt: "Rav Mordechai Gross",
    name: 'Chicken — Rav Mordechai Gross shlit"a',
    note: 'Chicken with the Hechsher of Rav Mordechai Gross is acceptable for use without issue.',
  },
];

export default function KashrusPage() {
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
        </div>

        <div
          className="relative z-10 max-w-[1180px] mx-auto"
          style={{ paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }}
        >
          <div className="flex items-center gap-3 mb-7">
            <span className="h-px w-5 block" style={{ background: "rgba(184,144,128,0.6)" }} />
            <span className="label-sm text-[#B89080]">Dietary Standards</span>
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
            Kashrus
            <br />
            <span style={{ fontStyle: "italic" }}>Standards</span>
          </h1>
        </div>
      </section>

      {/* Intro — Hechsher + description */}
      <section
        style={{
          background: "var(--color-linen)",
          paddingTop: "var(--section)",
          paddingBottom: "2.5rem",
        }}
      >
        <div
          className="max-w-[1180px] mx-auto"
          style={{ paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }}
        >
          <div className="max-w-2xl">
            {/* Hechsher seal */}
            <div className="mb-10">
              <Image
                src="/assets/Hechsher.png"
                alt="Rabbi Lewin Mehadrin Hechsher"
                width={140}
                height={140}
                className="object-contain"
                style={{ filter: "drop-shadow(0 4px 16px rgba(61,46,34,0.12))" }}
              />
            </div>

            <h2
              style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontWeight: 300,
                fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                lineHeight: 1.2,
                color: "var(--color-espresso)",
                marginBottom: "1.25rem",
              }}
            >
              Kashrus Information From Rabbi Lewin
            </h2>

            <div className="space-y-3">
              <p
                style={{
                  fontFamily: "Jost, system-ui, sans-serif",
                  fontWeight: 300,
                  fontSize: "0.9375rem",
                  lineHeight: 1.8,
                  color: "var(--color-taupe)",
                }}
              >
                Rabbi Lewin&apos;s Mehadrin Hechsher allows the following Hechsherim at our retreat.
              </p>
              <p
                style={{
                  fontFamily: "Jost, system-ui, sans-serif",
                  fontWeight: 300,
                  fontSize: "0.9375rem",
                  lineHeight: 1.8,
                  color: "var(--color-taupe)",
                }}
              >
                For additional information, please contact Rabbi Lewin directly:{" "}
                <a
                  href="tel:+19172137932"
                  className="text-[#B89080] border-b border-current pb-px hover:text-[#7A6A5A] transition-colors"
                  style={{ fontWeight: 400 }}
                >
                  +1 (917) 213-7932
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications grid */}
      <section
        style={{
          background: "var(--color-sand)",
          paddingTop: "2.5rem",
          paddingBottom: "var(--section)",
        }}
      >
        <div
          className="max-w-[1180px] mx-auto"
          style={{ paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }}
        >
          <div className="flex items-center gap-3 mb-10">
            <span className="h-px w-5 block" style={{ background: "var(--color-clay)", opacity: 0.5 }} />
            <span className="label-sm text-[#B89080]">Accepted Certifications</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-px" style={{ background: "rgba(184,144,128,0.15)" }}>
            {certifications.map((cert) => (
              <div
                key={cert.name}
                className="flex items-start gap-5 p-6"
                style={{ background: "var(--color-sand)" }}
              >
                {/* Logo */}
                <div
                  className="shrink-0 flex items-center justify-center"
                  style={{
                    width: 72,
                    height: 72,
                    background: "rgba(255,255,255,0.7)",
                    borderRadius: "0.75rem",
                    border: "1px solid rgba(184,144,128,0.2)",
                    padding: "0.5rem",
                  }}
                >
                  <Image
                    src={cert.img}
                    alt={cert.alt}
                    width={56}
                    height={56}
                    className="object-contain w-full h-full"
                  />
                </div>

                {/* Text */}
                <div className="min-w-0">
                  <h3
                    style={{
                      fontFamily: "Cormorant Garamond, Georgia, serif",
                      fontWeight: 400,
                      fontSize: "1.125rem",
                      lineHeight: 1.25,
                      color: "var(--color-espresso)",
                      marginBottom: "0.375rem",
                    }}
                  >
                    {cert.name}
                  </h3>
                  <p
                    style={{
                      fontFamily: "Jost, system-ui, sans-serif",
                      fontWeight: 300,
                      fontSize: "0.8125rem",
                      lineHeight: 1.7,
                      color: "var(--color-taupe)",
                    }}
                  >
                    {cert.note}
                  </p>
                  {cert.hebrew && (
                    <p
                      className="mt-1"
                      dir="rtl"
                      style={{
                        fontFamily: "Jost, system-ui, sans-serif",
                        fontWeight: 300,
                        fontSize: "0.75rem",
                        lineHeight: 1.7,
                        color: "var(--color-taupe-light)",
                      }}
                    >
                      {cert.hebrew}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional policies */}
      <section
        style={{
          background: "var(--color-linen)",
          paddingTop: "var(--section-sm)",
          paddingBottom: "var(--section-sm)",
        }}
      >
        <div
          className="max-w-[1180px] mx-auto"
          style={{ paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }}
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-8">
              <span className="h-px w-5 block" style={{ background: "var(--color-clay)", opacity: 0.5 }} />
              <span className="label-sm text-[#B89080]">Further Reading</span>
            </div>

            <div
              className="py-6"
              style={{ borderTop: "1px solid rgba(184,144,128,0.2)", borderBottom: "1px solid rgba(184,144,128,0.2)" }}
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-baseline justify-between gap-4">
                  <span
                    style={{
                      fontFamily: "Cormorant Garamond, Georgia, serif",
                      fontWeight: 400,
                      fontSize: "1.0625rem",
                      color: "var(--color-espresso)",
                    }}
                  >
                    Rabbi&apos;s Hechsher Policy
                  </span>
                  <a
                    href="https://torahkollel.com/#section-slRQUic15"
                    target="_blank"
                    rel="noreferrer"
                    className="label-sm text-[#B89080] border-b border-current pb-px hover:text-[#7A6A5A] transition-colors shrink-0"
                  >
                    View page
                  </a>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <span
                    style={{
                      fontFamily: "Cormorant Garamond, Georgia, serif",
                      fontWeight: 400,
                      fontSize: "1.0625rem",
                      color: "var(--color-espresso)",
                    }}
                  >
                    Full Kashrus Policy Document
                  </span>
                  <a
                    href="https://docs.google.com/document/d/1Kxg7N3XJp5r4Y08sU5TyIZp5orrI-g5ihRygFlFQvmw/edit?tab=t.0"
                    target="_blank"
                    rel="noreferrer"
                    className="label-sm text-[#B89080] border-b border-current pb-px hover:text-[#7A6A5A] transition-colors shrink-0"
                  >
                    View document
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Questions CTA */}
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
            Have a dietary question?
          </p>
          <Link
            href="/contact"
            className="label-md text-[#B89080] hover:text-[#7A6A5A] transition-colors border-b border-current pb-px"
          >
            Reach out to us
          </Link>
        </div>
      </section>
    </>
  );
}
