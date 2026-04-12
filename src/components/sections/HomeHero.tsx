"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function HomeHero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = [titleRef.current, subRef.current, ctaRef.current];
    elements.forEach((el, i) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      setTimeout(() => {
        if (!el) return;
        el.style.transition = "opacity 1.2s cubic-bezier(0.25,0.46,0.45,0.94), transform 1.2s cubic-bezier(0.25,0.46,0.45,0.94)";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 300 + i * 200);
    });
  }, []);

  return (
    <section
      className="relative min-h-screen flex flex-col justify-end overflow-hidden grain-overlay"
      style={{ background: "linear-gradient(165deg, #E8DDD0 0%, #D4C5B0 40%, #C4A898 100%)" }}
    >
      {/* Desert landscape illustration — CSS-composed atmospheric layers */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        {/* Sky gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, #F0E8DC 0%, #E4D4C0 35%, #D8C4A8 65%, #C8B094 100%)",
          }}
        />

        {/* Sun haze */}
        <div
          className="absolute"
          style={{
            top: "8%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(60vw, 500px)",
            height: "min(60vw, 500px)",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(220,170,100,0.35) 0%, rgba(220,170,100,0.12) 40%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        {/* Distant dune silhouette — back layer */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: "55%",
            background: "linear-gradient(180deg, transparent 0%, rgba(184,148,120,0.15) 30%, rgba(160,124,96,0.4) 100%)",
          }}
        />

        {/* Dune shape left */}
        <div
          className="absolute bottom-0"
          style={{
            left: "-5%",
            width: "55%",
            height: "42%",
            background: "linear-gradient(135deg, rgba(196,168,144,0.0) 0%, rgba(180,148,120,0.55) 100%)",
            borderRadius: "50% 80% 0 0",
            filter: "blur(1px)",
          }}
        />

        {/* Dune shape right */}
        <div
          className="absolute bottom-0"
          style={{
            right: "-8%",
            width: "50%",
            height: "38%",
            background: "linear-gradient(225deg, rgba(196,168,144,0.0) 0%, rgba(172,140,112,0.6) 100%)",
            borderRadius: "80% 50% 0 0",
            filter: "blur(1px)",
          }}
        />

        {/* Atmospheric haze band */}
        <div
          className="absolute"
          style={{
            bottom: "38%",
            left: 0,
            right: 0,
            height: "12%",
            background: "linear-gradient(180deg, transparent 0%, rgba(228,216,200,0.25) 50%, transparent 100%)",
            filter: "blur(8px)",
          }}
        />

        {/* Tent silhouette suggestion — subtle */}
        <div
          className="absolute"
          style={{
            bottom: "38%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "2px",
            height: "12%",
            background: "rgba(96,72,52,0.2)",
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: "38%",
            left: "calc(50% - 6%)",
            width: "12%",
            height: "9%",
            background: "rgba(96,72,52,0.12)",
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            filter: "blur(0.5px)",
          }}
        />

        {/* Soft bottom fade into content overlay */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: "50%",
            background: "linear-gradient(180deg, transparent 0%, rgba(61,46,34,0.55) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div
        className="relative z-10 w-full max-w-[1180px] mx-auto pb-20 md:pb-28"
        style={{ paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }}
      >
        <div className="max-w-2xl">
          {/* Label */}
          <div className="flex items-center gap-3 mb-8">
            <span className="block h-px w-5" style={{ background: "rgba(228,216,200,0.55)" }} />
            <span
              className="label-sm"
              style={{ color: "rgba(228,216,200,0.8)" }}
            >
              Desert Escape for Women · Israel
            </span>
          </div>

          {/* Title */}
          <h1
            ref={titleRef}
            className="text-[#FAF7F2] mb-6"
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontWeight: 300,
              fontSize: "clamp(3.5rem, 9vw, 7.5rem)",
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
            }}
          >
            Exhale.
            <br />
            <span style={{ fontStyle: "italic", fontWeight: 300, opacity: 0.88 }}>
              Finally.
            </span>
          </h1>

          {/* Subheading */}
          <p
            ref={subRef}
            style={{
              fontFamily: "Jost, system-ui, sans-serif",
              fontWeight: 300,
              fontSize: "clamp(0.9375rem, 1.5vw, 1.0625rem)",
              color: "rgba(250,247,242,0.75)",
              lineHeight: 1.8,
              maxWidth: "38ch",
              marginBottom: "2.5rem",
            }}
          >
            A women-only retreat in the Israeli desert. Three days of genuine
            rest, nourishing meals, open sky, and the kind of quiet you
            forgot existed.
          </p>

          {/* CTAs */}
          <div ref={ctaRef} className="flex flex-wrap items-center gap-4">
            <Link
              href="/retreats"
              className="inline-flex items-center gap-3 px-7 py-3.5 transition-all duration-300 uppercase"
              style={{
                fontFamily: "Jost, system-ui, sans-serif",
                fontWeight: 400,
                fontSize: "0.75rem",
                letterSpacing: "0.18em",
                background: "rgba(250,247,242,0.12)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(250,247,242,0.3)",
                color: "#FAF7F2",
              }}
            >
              See Upcoming Retreats
              <span aria-hidden className="block h-px w-5" style={{ background: "rgba(250,247,242,0.6)" }} />
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center label-sm transition-colors duration-300"
              style={{ color: "rgba(250,247,242,0.6)" }}
            >
              Learn more
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 right-[var(--gutter)] z-10 flex flex-col items-center gap-2"
        style={{ "--gutter": "clamp(1.5rem, 5vw, 4rem)" } as React.CSSProperties}
        aria-hidden
      >
        <div
          className="h-10 w-px"
          style={{
            background: "linear-gradient(180deg, transparent 0%, rgba(250,247,242,0.4) 100%)",
          }}
        />
      </div>
    </section>
  );
}
