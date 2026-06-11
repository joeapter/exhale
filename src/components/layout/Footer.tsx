import Link from "next/link";
import Image from "next/image";
import MailingListForm from "@/components/layout/MailingListForm";
import { getSiteImage } from "@/lib/site-images";

export default async function Footer() {
  const year = new Date().getFullYear();
  const footerLogo = await getSiteImage("logo_footer");

  return (
    <footer
      style={{
        background: "var(--footer-bg)",
        color: "var(--footer-text)",
        paddingTop: "var(--section)",
        paddingBottom: "3rem",
      }}
    >
      <div
        className="max-w-[1180px] mx-auto"
        style={{ paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }}
      >
        {/* Mailing list */}
        <div
          className="pb-14 mb-14"
          style={{ borderBottom: "1px solid var(--footer-border)" }}
        >
          <p
            className="mb-1"
            style={{
              fontFamily: "Jost, system-ui, sans-serif",
              fontWeight: 300,
              fontSize: "0.6875rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--footer-text-dim)",
            }}
          >
            Stay in the loop
          </p>
          <p
            className="mb-5"
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontWeight: 300,
              fontSize: "1.5rem",
              color: "var(--footer-text)",
              lineHeight: 1.4,
            }}
          >
            Be the first to know about our next retreat.
          </p>
          <div className="max-w-xl">
            <MailingListForm />
          </div>
        </div>

        {/* Top row */}
        <div
          className="flex flex-col md:flex-row md:items-end justify-between gap-12 pb-16"
          style={{ borderBottom: "1px solid var(--footer-border)" }}
        >
          {/* Brand */}
          <div className="max-w-xs">
            <p
              className="tracking-[0.22em] text-sm mb-1"
              style={{
                fontFamily: "Jost, system-ui, sans-serif",
                fontWeight: 400,
                color: "var(--footer-text-bright)",
              }}
            >
              EXHALE
            </p>
            <p
              className="tracking-[0.12em] text-[0.6rem] mb-6"
              style={{
                fontFamily: "Jost, system-ui, sans-serif",
                fontWeight: 300,
                color: "var(--footer-text-muted)",
              }}
            >
              RETREAT FOR WOMEN
            </p>
            <p
              style={{
                fontFamily: "Jost, system-ui, sans-serif",
                fontWeight: 300,
                fontSize: "0.875rem",
                color: "var(--footer-text-muted)",
                lineHeight: "1.75",
              }}
            >
              An intentional pause.
              <br />
              Rest, nourishment, beauty, and stillness —
              <br />
              crafted for women who are ready to return to themselves.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row gap-10 md:gap-16">
            <div>
              <p
                className="label-sm mb-4"
                style={{ color: "var(--footer-text-dim)" }}
              >
                Explore
              </p>
              <ul className="flex flex-col gap-2.5">
                {[
                  { href: "/", label: "Home" },
                  { href: "/about", label: "About" },
                  { href: "/retreat", label: "Retreat" },
                  { href: "/facilitators", label: "Facilitators" },
                  { href: "/kashrus", label: "Kashrus" },
                  { href: "/faq", label: "FAQ" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors duration-300 footer-link"
                      style={{
                        fontFamily: "Jost, system-ui, sans-serif",
                        fontWeight: 300,
                        color: "var(--footer-text-muted)",
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p
                className="label-sm mb-4"
                style={{ color: "var(--footer-text-dim)" }}
              >
                Connect
              </p>
              <ul className="flex flex-col gap-2.5">
                {[
                  { href: "/contact", label: "Contact Us" },
                  { href: "mailto:booking@exhale.co.il", label: "booking@exhale.co.il" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors duration-300 footer-link"
                      style={{
                        fontFamily: "Jost, system-ui, sans-serif",
                        fontWeight: 300,
                        color: "var(--footer-text-muted)",
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Partner credit */}
        <div
          className="pt-8 pb-6 flex justify-center"
          style={{ borderBottom: "1px solid var(--footer-border)" }}
        >
          <div className="flex flex-col items-center gap-2.5">
            <p
              style={{
                fontFamily: "Jost, system-ui, sans-serif",
                fontWeight: 300,
                fontSize: "0.6875rem",
                letterSpacing: "0.14em",
                color: "var(--footer-text-faint)",
                textTransform: "uppercase",
              }}
            >
              An Elevate Events Production
            </p>
            <a
              href="https://www.elevateeventsil.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Elevate Events"
              className="opacity-75 hover:opacity-100 transition-opacity duration-200"
            >
              <Image
                src={footerLogo}
                alt="Elevate Events"
                width={90}
                height={90}
                className="object-contain"
              />
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="label-sm" style={{ color: "var(--footer-text-faint)" }}>
            © {year} Exhale. All rights reserved. · exhale.co.il
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="label-sm footer-link-faint transition-colors duration-300"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="label-sm footer-link-faint transition-colors duration-300"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
