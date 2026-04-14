import Image from "next/image";

export default function HomeIntro() {
  return (
    <section
      style={{
        background: "var(--color-linen)",
        paddingTop: "var(--section)",
        paddingBottom: "var(--section)",
      }}
    >
      <div
        className="max-w-[1180px] mx-auto grid md:grid-cols-12 gap-y-16 md:gap-0 items-center"
        style={{ paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }}
      >
        {/* Left — photo */}
        <div className="md:col-span-5">
          <div
            className="relative overflow-hidden"
            style={{
              aspectRatio: "4/5",
              borderRadius: "2px",
            }}
          >
            <Image
              src="/assets/noor/bonfire.webp"
              alt="Evening bonfire at Noor Glamping"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
        </div>

        {/* Right — copy */}
        <div className="md:col-span-6 md:col-start-7">
          <div className="flex items-center gap-3 mb-8">
            <span className="h-px w-5 block" style={{ background: "var(--color-clay)", opacity: 0.5 }} />
            <span className="label-sm text-[#B89080]">What is EXHALE</span>
          </div>

          <h2
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontWeight: 300,
              fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
              lineHeight: 1.15,
              color: "var(--color-espresso)",
              marginBottom: "1.5rem",
            }}
          >
            Not a program.
            <br />
            <em style={{ fontStyle: "italic" }}>A few days to breathe.</em>
          </h2>

          <p className="prose-exhale" style={{ maxWidth: "44ch", marginBottom: "1.4em" }}>
            EXHALE is a women-only retreat at Noor Glamping in the Israeli desert.
            A total nervous system reset. Two nights of genuine rest —
            beautiful food, open sky, and the company of women who understand.
          </p>

          <p className="prose-exhale" style={{ maxWidth: "44ch", marginBottom: "2rem" }}>
            We've curated an amazing, inspirational program that will revive your body and soul.
          </p>

          <a
            href="/about"
            className="label-md text-[#7A6A5A] hover:text-[#3D2E22] transition-colors duration-300"
            style={{ borderBottom: "1px solid rgba(122,106,90,0.35)", paddingBottom: "2px" }}
          >
            Our story
          </a>
        </div>
      </div>
    </section>
  );
}
