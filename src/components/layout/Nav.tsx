"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/retreats", label: "Retreats" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-[#FAF7F2]/95 backdrop-blur-sm border-b border-[#E4D8C9]/60 py-3"
            : "bg-transparent py-5"
        )}
      >
        <div className="max-w-[1180px] mx-auto px-gutter flex items-center justify-between" style={{ paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }}>
          {/* Logo */}
          <Link href="/" className="flex flex-col items-start leading-none">
            <span
              className="text-[#3D2E22] tracking-[0.22em] text-sm font-light"
              style={{ fontFamily: "Jost, system-ui, sans-serif", fontWeight: 400 }}
            >
              EXHALE
            </span>
            <span
              className="text-[#9B8F84] tracking-[0.12em] text-[0.6rem]"
              style={{ fontFamily: "Jost, system-ui, sans-serif", fontWeight: 300 }}
            >
              DESERT ESCAPE
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="label-sm text-[#7A6A5A] hover:text-[#3D2E22] transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-5">
            <Link
              href="/retreats"
              className="hidden md:inline-flex items-center label-sm text-[#3D2E22] border border-[#B89080]/60 hover:border-[#B89080] hover:bg-[#B89080]/8 px-5 py-2.5 transition-all duration-300"
            >
              Reserve a Place
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col gap-1.5 p-1"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <span
                className={cn(
                  "block h-px w-6 bg-[#3D2E22] transition-all duration-300",
                  menuOpen && "rotate-45 translate-y-2.5"
                )}
              />
              <span
                className={cn(
                  "block h-px w-6 bg-[#3D2E22] transition-all duration-300",
                  menuOpen && "opacity-0"
                )}
              />
              <span
                className={cn(
                  "block h-px w-4 bg-[#3D2E22] transition-all duration-300",
                  menuOpen && "w-6 -rotate-45 -translate-y-2.5"
                )}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-[#FAF7F2] flex flex-col justify-center items-center transition-all duration-500",
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <nav className="flex flex-col items-center gap-8">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-[#3D2E22] transition-colors duration-300"
              style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontSize: "clamp(2rem, 6vw, 3rem)",
                fontWeight: 300,
                transitionDelay: `${i * 60}ms`,
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/retreats"
            onClick={() => setMenuOpen(false)}
            className="mt-4 label-md text-[#B89080] border-b border-[#B89080]/50 pb-px hover:border-[#B89080]"
          >
            Reserve a Place
          </Link>
        </nav>

        <p
          className="absolute bottom-10 label-sm text-[#9B8F84]"
        >
          exhale.co.il
        </p>
      </div>
    </>
  );
}
