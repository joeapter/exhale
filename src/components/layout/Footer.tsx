import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#3D2E22] text-[#E4D8C9]" style={{ paddingTop: "var(--section)", paddingBottom: "3rem" }}>
      <div
        className="max-w-[1180px] mx-auto"
        style={{ paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }}
      >
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
                  { href: "/retreats", label: "Retreats" },
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
                  { href: "mailto:hello@exhale.co.il", label: "hello@exhale.co.il" },
                  { href: "https://instagram.com", label: "Instagram" },
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
