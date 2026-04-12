import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function AdminRegistrationsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  // Sample data — replace with: await prisma.registration.findMany({ ... })
  const registrations = [
    {
      id: "r1", firstName: "Noa", lastName: "Cohen", email: "noa@example.com",
      retreat: "Summer Escape", package: "Private Tent",
      status: "CONFIRMED", paymentType: "FULL",
      amountDue: 390000, amountPaid: 390000,
      createdAt: new Date("2026-04-11"),
      confirmationRef: "EX-M5KQAJ-7X2F",
    },
    {
      id: "r2", firstName: "Tamar", lastName: "Levi", email: "tamar@example.com",
      retreat: "Summer Escape", package: "Shared Tent",
      status: "CONFIRMED", paymentType: "DEPOSIT",
      amountDue: 290000, amountPaid: 80000,
      createdAt: new Date("2026-04-10"),
      confirmationRef: "EX-M5KPBR-9Y3G",
    },
    {
      id: "r3", firstName: "Michal", lastName: "Ben-David", email: "michal@example.com",
      retreat: "Autumn Stillness", package: "Shared Tent",
      status: "PENDING", paymentType: "DEPOSIT",
      amountDue: 290000, amountPaid: 0,
      createdAt: new Date("2026-04-09"),
      confirmationRef: null,
    },
  ];

  const statusColor: Record<string, { color: string; bg: string }> = {
    PENDING: { color: "rgba(212,149,106,1)", bg: "rgba(212,149,106,0.1)" },
    CONFIRMED: { color: "rgba(90,122,90,1)", bg: "rgba(90,122,90,0.1)" },
    WAITLISTED: { color: "rgba(100,100,180,1)", bg: "rgba(100,100,180,0.1)" },
    CANCELED: { color: "rgba(180,100,100,1)", bg: "rgba(180,100,100,0.1)" },
    REFUNDED: { color: "rgba(155,143,132,1)", bg: "rgba(155,143,132,0.1)" },
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
          Registrations
        </h1>
        <button
          className="inline-flex items-center gap-2 px-5 py-2.5 transition-all uppercase"
          style={{
            fontFamily: "Jost",
            fontWeight: 400,
            fontSize: "0.75rem",
            letterSpacing: "0.16em",
            border: "1px solid rgba(184,144,128,0.5)",
            color: "var(--color-espresso)",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          Export CSV
        </button>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total", value: registrations.length },
          { label: "Confirmed", value: registrations.filter((r) => r.status === "CONFIRMED").length },
          { label: "Pending", value: registrations.filter((r) => r.status === "PENDING").length },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-4"
            style={{ background: "#FAF7F2", border: "1px solid rgba(228,216,201,0.8)" }}
          >
            <div className="label-sm text-[#9B8F84] mb-1">{stat.label}</div>
            <div
              style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontWeight: 300,
                fontSize: "1.75rem",
                color: "var(--color-espresso)",
                lineHeight: 1,
              }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "#FAF7F2", border: "1px solid rgba(228,216,201,0.8)", overflowX: "auto" }}>
        <table className="w-full min-w-[900px]">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(228,216,201,0.8)" }}>
              {["Guest", "Retreat", "Package", "Payment", "Amount", "Status", "Date", "Actions"].map((col) => (
                <th key={col} className="text-left px-4 py-3.5 label-sm text-[#9B8F84]">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {registrations.map((r, i) => (
              <tr
                key={r.id}
                style={{ borderBottom: i < registrations.length - 1 ? "1px solid rgba(228,216,201,0.5)" : "none" }}
              >
                <td className="px-4 py-4">
                  <div style={{ fontFamily: "Jost", fontWeight: 400, fontSize: "0.875rem", color: "var(--color-espresso)" }}>
                    {r.firstName} {r.lastName}
                  </div>
                  <div style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.75rem", color: "var(--color-taupe-light)" }}>
                    {r.email}
                  </div>
                </td>
                <td className="px-4 py-4" style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.8125rem", color: "var(--color-taupe)" }}>{r.retreat}</td>
                <td className="px-4 py-4" style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.8125rem", color: "var(--color-taupe)" }}>{r.package}</td>
                <td className="px-4 py-4">
                  <span
                    className="label-sm"
                    style={{ color: r.paymentType === "FULL" ? "var(--color-taupe)" : "rgba(212,149,106,0.9)" }}
                  >
                    {r.paymentType === "DEPOSIT" ? "Deposit" : "Full"}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.8125rem", color: "var(--color-espresso)" }}>
                    {formatCurrency(r.amountPaid)}
                  </div>
                  {r.paymentType === "DEPOSIT" && r.amountPaid < r.amountDue && (
                    <div style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.75rem", color: "var(--color-taupe-light)" }}>
                      of {formatCurrency(r.amountDue)}
                    </div>
                  )}
                </td>
                <td className="px-4 py-4">
                  <span
                    className="label-sm px-2 py-0.5"
                    style={{
                      color: statusColor[r.status]?.color ?? "var(--color-taupe)",
                      background: statusColor[r.status]?.bg ?? "transparent",
                    }}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-4" style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.8125rem", color: "var(--color-taupe-light)" }}>
                  {formatDate(r.createdAt)}
                </td>
                <td className="px-4 py-4">
                  <Link
                    href={`/admin/registrations/${r.id}`}
                    className="label-sm text-[#B89080] hover:text-[#7A6A5A] transition-colors"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
