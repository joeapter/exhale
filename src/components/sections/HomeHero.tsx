"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function HomeHero() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const children = Array.from(el.children) as HTMLElement[];
    children.forEach((child, i) => {
      child.style.opacity = "0";
      child.style.transform = "translateY(18px)";
      setTimeout(() => {
        child.style.transition = `opacity 1.4s cubic-bezier(0.25,0.46,0.45,0.94) ${i * 160}ms, transform 1.4s cubic-bezier(0.25,0.46,0.45,0.94) ${i * 160}ms`;
        child.style.opacity = "1";
        child.style.transform = "translateY(0)";
      }, 200 + i * 160);
    });
  }, []);

  return (
    <section
      className="relative min-h-screen flex flex-col justify-end overflow-hidden grain-overlay"
      aria-label="EXHALE — Desert escape for women"
    >
      {/* ── Atmospheric desert background ── */}
      <div className="absolute inset-0" aria-hidden>
        {/* Sky — warm dawn palette */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, #EEE4D4 0%, #E2CEB6 28%, #D4B898 55%, #C4A080 78%, #B08860 100%)",
          }}
        />

        {/* Distant sun haze — off-centre for asymmetry */}
        <div
          className="absolute"
          style={{
            top: "4%",
            left: "42%",
            width: "clamp(280px, 52vw, 560px)",
            height: "clamp(280px, 52vw, 560px)",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(224,172,96,0.4) 0%, rgba(224,172,96,0.15) 35%, transparent 65%)",
            filter: "blur(48px)",
            transform: "translateX(-50%)",
          }}
        />

        {/* Mid-horizon heat shimmer */}
        <div
          className="absolute"
          style={{
            top: "45%",
            left: 0,
            right: 0,
            height: "8%",
            background: "linear-gradient(180deg, transparent 0%, rgba(232,212,180,0.3) 50%, transparent 100%)",
            filter: "blur(12px)",
          }}
        />

        {/* Dune — far left, large, soft */}
        <div
          className="absolute bottom-0"
          style={{
            left: "-12%",
            width: "58%",
            height: "46%",
            background: "radial-gradient(ellipse 80% 80% at 60% 100%, rgba(168,136,104,0.7) 0%, rgba(152,120,88,0.3) 60%, transparent 100%)",
            borderRadius: "60% 90% 0 0",
            filter: "blur(2px)",
          }}
        />

        {/* Dune — right, slightly in front */}
        <div
          className="absolute bottom-0"
          style={{
            right: "-6%",
            width: "48%",
            height: "38%",
            background: "radial-gradient(ellipse 80% 80% at 40% 100%, rgba(156,124,92,0.65) 0%, rgba(140,108,76,0.25) 60%, transparent 100%)",
            borderRadius: "90% 60% 0 0",
            filter: "blur(1.5px)",
          }}
        />

        {/* Ground plane */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: "28%",
            background: "linear-gradient(180deg, transparent 0%, rgba(100,72,48,0.45) 100%)",
          }}
        />

        {/* Tent silhouette — very subtle, off-centre */}
        <div
          className="absolute"
          style={{
            bottom: "27%",
            left: "54%",
            width: "0",
            height: "0",
            borderLeft: "6vw solid transparent",
            borderRight: "6vw solid transparent",
            borderBottom: "8vw solid rgba(72,52,34,0.14)",
            filter: "blur(1px)",
          }}
        />

        {/* Veil — gradient from dark earth to transparent, bottom half */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: "60%",
            background: "linear-gradient(180deg, transparent 0%, rgba(48,34,20,0.62) 100%)",
          }}
        />
      </div>

      {/* ── Content ── */}
      <div
        className="relative z-10 w-full max-w-[1180px] mx-auto"
        style={{
          paddingLeft: "var(--gutter)",
          paddingRight: "var(--gutter)",
          paddingBottom: "clamp(4rem, 8vw, 7rem)",
        }}
      >
        <div ref={contentRef} className="max-w-[26ch] md:max-w-[32ch]">

          {/* Eyebrow */}
          <p
            className="label-sm mb-10"
            style={{ color: "rgba(228,210,185,0.65)" }}
          >
            Desert Escape for Women &nbsp;·&nbsp; Israel
          </p>

          {/* Main headline */}
          <h1
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontWeight: 300,
              fontSize: "clamp(4rem, 10vw, 8.5rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.025em",
              color: "#FAF7F2",
              marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
            }}
          >
            Exhale.
            <br />
            <em
              style={{
                fontStyle: "italic",
                fontWeight: 300,
                color: "rgba(250,247,242,0.82)",
              }}
            >
              Finally.
            </em>
          </h1>

          {/* Subtext */}
          <p
            style={{
              fontFamily: "Jost, system-ui, sans-serif",
              fontWeight: 300,
              fontSize: "clamp(0.875rem, 1.4vw, 1rem)",
              color: "rgba(240,224,200,0.72)",
              lineHeight: 1.85,
              maxWidth: "36ch",
              marginBottom: "clamp(2rem, 4vw, 3rem)",
            }}
          >
            A women-only retreat in the Israeli desert.
            Three days of genuine rest, nourishing meals,
            open sky, and the kind of quiet you forgot existed.
          </p>

          {/* CTA pair */}
          <div className="flex flex-wrap items-baseline gap-x-8 gap-y-4">
            <Link
              href="/retreats"
              style={{
                fontFamily: "Jost, system-ui, sans-serif",
                fontWeight: 400,
                fontSize: "0.75rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#FAF7F2",
                borderBottom: "1px solid rgba(250,247,242,0.35)",
                paddingBottom: "3px",
                transition: "border-color 0.3s ease",
              }}
            >
              Upcoming retreats
            </Link>
            <Link
              href="/about"
              style={{
                fontFamily: "Jost, system-ui, sans-serif",
                fontWeight: 300,
                fontSize: "0.8125rem",
                color: "rgba(240,224,200,0.5)",
                letterSpacing: "0.05em",
                transition: "color 0.3s ease",
              }}
            >
              About EXHALE
            </Link>
          </div>
        </div>
      </div>

      {/* ── Vertical scroll breath ── */}
      <div
        className="absolute bottom-10 left-1/2 z-10"
        style={{ transform: "translateX(-50%)" }}
        aria-hidden
      >
        <div
          style={{
            width: "1px",
            height: "3.5rem",
            background: "linear-gradient(180deg, transparent 0%, rgba(250,247,242,0.3) 100%)",
            animation: "softDrift 3s ease-in-out infinite",
          }}
        />
      </div>
    </section>
  );
}
