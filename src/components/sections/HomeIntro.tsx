export default function HomeIntro() {
  return (
    <section
      className="relative overflow-hidden"
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
        <div className="grid md:grid-cols-12 gap-y-12 md:gap-0 items-center">

          {/* Left — atmospheric quote block */}
          <div className="md:col-span-5 md:col-start-1">
            {/* Decorative line */}
            <div
              className="mb-10"
              style={{ width: "1px", height: "4rem", background: "var(--color-clay)", opacity: 0.4 }}
            />

            <blockquote
              style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: "clamp(1.75rem, 3vw, 2.625rem)",
                lineHeight: 1.35,
                color: "var(--color-espresso)",
                letterSpacing: "-0.01em",
              }}
            >
              "There is a version of you that knows exactly what she needs.
              She's been waiting for permission."
            </blockquote>

            <div className="mt-8 flex items-center gap-3">
              <span className="h-px w-5 block" style={{ background: "var(--color-clay)", opacity: 0.5 }} />
              <span className="label-sm text-[#B89080]">Exhale — Desert Escape for Women</span>
            </div>
          </div>

          {/* Right — intro copy */}
          <div className="md:col-span-6 md:col-start-7">
            <div className="flex items-center gap-3 mb-7">
              <span className="h-px w-5 block" style={{ background: "var(--color-clay)", opacity: 0.5 }} />
              <span className="label-sm text-[#B89080]">What is EXHALE</span>
            </div>

            <h2
              style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontWeight: 300,
                fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
                lineHeight: 1.2,
                color: "var(--color-espresso)",
                marginBottom: "1.75rem",
              }}
            >
              A few days to stop performing.
              <br />
              <span style={{ fontStyle: "italic" }}>To remember what stillness feels like.</span>
            </h2>

            <div className="prose-exhale">
              <p>
                EXHALE is a women-only retreat held in the quiet of the Israeli
                desert. Not a yoga retreat. Not a wellness workshop. Not a spa
                weekend. Something softer and more essential than any of those.
              </p>
              <p style={{ marginTop: "1.4em" }}>
                It's two and a half days in a beautiful desert setting where the
                only agenda is genuine rest. Beautiful meals. Open sky. The
                company of women who understand. And the rare, generous gift
                of time — unscheduled, unpressured, yours.
              </p>
              <p style={{ marginTop: "1.4em" }}>
                EXHALE was created because too many women wait for permission
                to rest. We are here to give it.
              </p>
            </div>

            <div className="mt-10">
              <a
                href="/about"
                className="label-md text-[#7A6A5A] hover:text-[#3D2E22] transition-colors duration-300"
                style={{ borderBottom: "1px solid rgba(122,106,90,0.35)", paddingBottom: "2px" }}
              >
                Our story
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
