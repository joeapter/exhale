import Link from "next/link";
import Image from "next/image";
import MailingListForm from "@/components/layout/MailingListForm";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#3D2E22] text-[#E4D8C9]" style={{ paddingTop: "var(--section)", paddingBottom: "3rem" }}>
      <div
        className="max-w-[1180px] mx-auto"
        style={{ paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }}
      >
        {/* Mailing list */}
        <div className="pb-14 mb-14 border-b border-[#5C4A38]">
          <p
            className="mb-1"
            style={{
              fontFamily: "Jost, system-ui, sans-serif",
              fontWeight: 300,
              fontSize: "0.6875rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#7A6A5A",
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
              color: "#E4D8C9",
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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 pb-16 border-b border-[#5C4A38]">

          {/* Brand */}
          <div className="max-w-xs">
            <p
              className="tracking-[0.22em] text-[#FAF7F2] text-sm mb-1"
              style={{ fontFamily: "Jost, system-ui, sans-serif", fontWeight: 400 }}
            >
              EXHALE
            </p>
            <p
              className="tracking-[0.12em] text-[0.6rem] text-[#9B8F84] mb-6"
              style={{ fontFamily: "Jost, system-ui, sans-serif", fontWeight: 300 }}
            >
              DESERT ESCAPE FOR WOMEN
            </p>
            <p style={{ fontFamily: "Jost, system-ui, sans-serif", fontWeight: 300, fontSize: "0.875rem", color: "#9B8F84", lineHeight: "1.75" }}>
              An intentional pause in the desert.
              <br />
              Rest, nourishment, beauty, and stillness —
              <br />
              crafted for women who are ready to return to themselves.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row gap-10 md:gap-16">
            <div>
              <p className="label-sm text-[#7A6A5A] mb-4">Explore</p>
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
                      className="text-sm text-[#9B8F84] hover:text-[#E4D8C9] transition-colors duration-300"
                      style={{ fontFamily: "Jost, system-ui, sans-serif", fontWeight: 300 }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="label-sm text-[#7A6A5A] mb-4">Connect</p>
              <ul className="flex flex-col gap-2.5">
                {[
                  { href: "/contact", label: "Contact Us" },
                  { href: "mailto:booking@exhale.co.il", label: "booking@exhale.co.il" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#9B8F84] hover:text-[#E4D8C9] transition-colors duration-300"
                      style={{ fontFamily: "Jost, system-ui, sans-serif", fontWeight: 300 }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Elevate Events credit */}
        <div className="pt-8 pb-6 flex justify-center" style={{ borderBottom: "1px solid #5C4A38" }}>
          <div className="flex flex-col items-center gap-2.5">
            <p
              style={{
                fontFamily: "Jost, system-ui, sans-serif",
                fontWeight: 300,
                fontSize: "0.6875rem",
                letterSpacing: "0.14em",
                color: "#5C4A38",
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
                src="/assets/Elevate Events Logo .png"
                alt="Elevate Events"
                width={90}
                height={90}
                className="object-contain"
              />
            </a>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="label-sm text-[#5C4A38]">
            © {year} Exhale. All rights reserved. · exhale.co.il
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="label-sm text-[#5C4A38] hover:text-[#9B8F84] transition-colors duration-300"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="label-sm text-[#5C4A38] hover:text-[#9B8F84] transition-colors duration-300"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
