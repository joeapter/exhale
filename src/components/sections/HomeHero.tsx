"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

const HERO_IMAGE = "/assets/desert-glamping-at-sunset.png";

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
      className="relative min-h-screen flex flex-col justify-end overflow-hidden"
      aria-label="EXHALE — Desert escape for women"
    >
      {/* ── Hero image background ── */}
      <div className="absolute inset-0" aria-hidden>
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Readability veil */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(20,15,10,0.08) 0%, rgba(20,15,10,0.2) 52%, rgba(20,15,10,0.58) 100%)",
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
            June 7–9 &nbsp;·&nbsp; Noor Glamping &nbsp;·&nbsp; Israel
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
            A women-only desert escape.
            Two nights of real rest, beautiful food,
            and open sky.
          </p>

          {/* CTA pair */}
          <div className="flex flex-wrap items-baseline gap-x-8 gap-y-4">
            <Link
              href="/retreat"
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
              Reserve a place
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
