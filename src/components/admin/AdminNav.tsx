"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/retreats", label: "Retreats" },
  { href: "/admin/registrations", label: "Registrations" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/faqs", label: "FAQs" },
  { href: "/admin/testimonials", label: "Testimonials" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 border-b"
      style={{
        background: "rgba(253,250,246,0.97)",
        backdropFilter: "blur(8px)",
        borderColor: "rgba(228,216,201,0.7)",
      }}
    >
      <div className="flex items-center justify-between h-16 px-6 max-w-[1400px] mx-auto">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link href="/admin" className="flex flex-col leading-none">
            <span
              className="tracking-[0.18em] text-[#3D2E22] text-xs"
              style={{ fontFamily: "Jost", fontWeight: 400 }}
            >
              EXHALE
            </span>
            <span
              className="tracking-[0.12em] text-[0.5rem] text-[#9B8F84]"
              style={{ fontFamily: "Jost", fontWeight: 300 }}
            >
              ADMIN
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-5">
            {navItems.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition-colors duration-200"
                  style={{
                    fontFamily: "Jost",
                    fontWeight: isActive ? 400 : 300,
                    fontSize: "0.8125rem",
                    color: isActive ? "var(--color-espresso)" : "var(--color-taupe-light)",
                    borderBottom: isActive ? "1px solid var(--color-clay)" : "none",
                    paddingBottom: isActive ? "1px" : "2px",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            target="_blank"
            className="label-sm text-[#9B8F84] hover:text-[#7A6A5A] transition-colors"
          >
            View Site
          </Link>
          <button
            onClick={handleLogout}
            className="label-sm text-[#9B8F84] hover:text-[#3D2E22] transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
