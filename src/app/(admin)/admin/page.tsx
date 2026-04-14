import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function AdminDashboard() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const [totalRegistrations, confirmedRegistrations, upcomingRetreats, revenueResult, recentRegistrations] =
    await Promise.all([
      prisma.registration.count(),
      prisma.registration.count({ where: { status: "CONFIRMED" } }),
      prisma.retreat.count({ where: { status: { in: ["PUBLISHED", "DRAFT"] }, startDate: { gte: new Date() } } }),
      prisma.registration.aggregate({ _sum: { amountPaid: true }, where: { status: "CONFIRMED" } }),
      prisma.registration.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { retreat: { select: { title: true } }, package: { select: { name: true } } },
      }),
    ]);

  const totalRevenue = revenueResult._sum.amountPaid ?? 0;

  function formatILS(agorot: number) {
    return new Intl.NumberFormat("he-IL", { style: "currency", currency: "ILS", minimumFractionDigits: 0 }).format(agorot / 100);
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1
          style={{
            fontFamily: "Cormorant Garamond, Georgia, serif",
            fontWeight: 300,
            fontSize: "2.25rem",
            color: "var(--color-espresso)",
            marginBottom: "0.25rem",
          }}
        >
          Dashboard
        </h1>
        <p style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.875rem", color: "var(--color-taupe-light)" }}>
          Welcome back, {session.email}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Upcoming Retreats", value: upcomingRetreats, link: "/admin/retreats" },
          { label: "Total Registrations", value: totalRegistrations, link: "/admin/registrations" },
          { label: "Confirmed", value: confirmedRegistrations, link: "/admin/registrations" },
          { label: "Revenue", value: formatILS(totalRevenue), link: "/admin/registrations" },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.link}
            className="block p-5 transition-all duration-200 hover:shadow-sm"
            style={{
              background: "#FAF7F2",
              border: "1px solid rgba(228,216,201,0.8)",
            }}
          >
            <div className="label-sm text-[#9B8F84] mb-2">{stat.label}</div>
            <div
              style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontWeight: 300,
                fontSize: "2rem",
                color: "var(--color-espresso)",
                lineHeight: 1,
              }}
            >
              {stat.value}
            </div>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Recent registrations */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2
              style={{
                fontFamily: "Jost",
                fontWeight: 400,
                fontSize: "0.875rem",
                letterSpacing: "0.08em",
                color: "var(--color-espresso)",
                textTransform: "uppercase",
              }}
            >
              Recent Registrations
            </h2>
            <Link
              href="/admin/registrations"
              className="label-sm text-[#B89080] hover:text-[#7A6A5A] transition-colors"
            >
              View all
            </Link>
          </div>

          <div style={{ background: "#FAF7F2", border: "1px solid rgba(228,216,201,0.8)" }}>
            {recentRegistrations.length === 0 ? (
              <p className="px-4 py-8 text-center" style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.875rem", color: "var(--color-taupe-light)" }}>
                No registrations yet.
              </p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(228,216,201,0.8)" }}>
                    {["Name", "Retreat", "Package", "Status", "Date"].map((col) => (
                      <th key={col} className="text-left px-4 py-3 label-sm text-[#9B8F84]">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentRegistrations.map((r, i) => (
                    <tr
                      key={r.id}
                      style={{ borderBottom: i < recentRegistrations.length - 1 ? "1px solid rgba(228,216,201,0.6)" : "none" }}
                    >
                      <td className="px-4 py-3" style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.875rem", color: "var(--color-espresso)" }}>
                        {r.firstName} {r.lastName}
                      </td>
                      <td className="px-4 py-3" style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.8125rem", color: "var(--color-taupe)" }}>
                        {r.retreat.title}
                      </td>
                      <td className="px-4 py-3" style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.8125rem", color: "var(--color-taupe)" }}>
                        {r.package?.name ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="label-sm"
                          style={{
                            color: r.status === "CONFIRMED" ? "#5A7A5A" : "var(--color-candle)",
                            background: r.status === "CONFIRMED" ? "rgba(90,122,90,0.1)" : "rgba(212,149,106,0.1)",
                            padding: "2px 8px",
                          }}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3" style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.8125rem", color: "var(--color-taupe-light)" }}>
                        {formatDate(r.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <h2
            style={{
              fontFamily: "Jost",
              fontWeight: 400,
              fontSize: "0.875rem",
              letterSpacing: "0.08em",
              color: "var(--color-espresso)",
              textTransform: "uppercase",
              marginBottom: "1.25rem",
            }}
          >
            Quick Actions
          </h2>
          <div className="space-y-2">
            {[
              { href: "/admin/retreats/new", label: "Create new retreat" },
              { href: "/admin/registrations", label: "Review registrations" },
              { href: "/admin/faqs", label: "Edit FAQ content" },
              { href: "/admin/testimonials", label: "Manage testimonials" },
              { href: "/admin/content", label: "Update site content" },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center justify-between w-full px-4 py-3 transition-all duration-200 hover:bg-[#F5EFE7] group"
                style={{
                  background: "#FAF7F2",
                  border: "1px solid rgba(228,216,201,0.8)",
                  fontFamily: "Jost",
                  fontWeight: 300,
                  fontSize: "0.875rem",
                  color: "var(--color-taupe)",
                }}
              >
                {action.label}
                <span className="text-[#C9BAA8] group-hover:text-[#B89080] transition-colors">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
