import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDateRange } from "@/lib/utils";

export default async function AdminRetreatsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const retreats = await prisma.retreat.findMany({
    orderBy: { startDate: "asc" },
    include: { _count: { select: { registrations: true } } },
  });

  const statusColor: Record<string, string> = {
    DRAFT: "rgba(155,143,132,1)",
    PUBLISHED: "rgba(90,122,90,1)",
    SOLD_OUT: "rgba(212,149,106,1)",
    COMPLETED: "rgba(155,143,132,1)",
    CANCELED: "rgba(180,100,100,1)",
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1
          style={{
            fontFamily: "Cormorant Garamond, Georgia, serif",
            fontWeight: 300,
            fontSize: "2.25rem",
            color: "var(--color-espresso)",
          }}
        >
          Retreats
        </h1>
        <Link
          href="/admin/retreats/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 transition-all uppercase"
          style={{
            fontFamily: "Jost",
            fontWeight: 400,
            fontSize: "0.75rem",
            letterSpacing: "0.16em",
            background: "var(--color-espresso)",
            color: "#FAF7F2",
          }}
        >
          + New Retreat
        </Link>
      </div>

      <div style={{ background: "#FAF7F2", border: "1px solid rgba(228,216,201,0.8)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(228,216,201,0.8)" }}>
              {["Title", "Dates", "Location", "Status", "Spots", "Actions"].map((col) => (
                <th key={col} className="text-left px-5 py-3.5 label-sm text-[#9B8F84]">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {retreats.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center" style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.875rem", color: "var(--color-taupe-light)" }}>
                  No retreats yet. Create your first one.
                </td>
              </tr>
            ) : retreats.map((r, i) => (
              <tr
                key={r.id}
                style={{ borderBottom: i < retreats.length - 1 ? "1px solid rgba(228,216,201,0.5)" : "none" }}
              >
                <td className="px-5 py-4">
                  <div style={{ fontFamily: "Jost", fontWeight: 400, fontSize: "0.9375rem", color: "var(--color-espresso)" }}>{r.title}</div>
                  <div style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.75rem", color: "var(--color-taupe-light)" }}>{r.slug}</div>
                </td>
                <td className="px-5 py-4" style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.875rem", color: "var(--color-taupe)" }}>
                  {formatDateRange(r.startDate, r.endDate)}
                </td>
                <td className="px-5 py-4" style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.875rem", color: "var(--color-taupe)" }}>{r.location}</td>
                <td className="px-5 py-4">
                  <span
                    className="label-sm px-2 py-0.5"
                    style={{
                      color: statusColor[r.status] ?? "var(--color-taupe)",
                      background: `${statusColor[r.status] ?? "var(--color-taupe)"}18`,
                    }}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-5 py-4" style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.875rem", color: "var(--color-taupe)" }}>
                  {r.spotsRemaining} / {r.capacity}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-4">
                    <Link href={`/admin/retreats/${r.id}/edit`} className="label-sm text-[#B89080] hover:text-[#7A6A5A] transition-colors">Edit</Link>
                    <Link href={`/retreat`} target="_blank" className="label-sm text-[#9B8F84] hover:text-[#7A6A5A] transition-colors">View</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
