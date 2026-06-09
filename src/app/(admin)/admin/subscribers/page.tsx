import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function AdminSubscribersPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const subscribers = await prisma.mailingListSubscriber.findMany({
    orderBy: { createdAt: "desc" },
  });

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
          Mailing List
        </h1>
        <Link
          href="/api/admin/subscribers?export=csv"
          className="inline-flex items-center gap-2 px-5 py-2.5 transition-all uppercase"
          style={{
            fontFamily: "Jost",
            fontWeight: 400,
            fontSize: "0.75rem",
            letterSpacing: "0.16em",
            border: "1px solid rgba(184,144,128,0.5)",
            color: "var(--color-espresso)",
          }}
        >
          Export CSV
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div
          className="p-4"
          style={{ background: "#FAF7F2", border: "1px solid rgba(228,216,201,0.8)" }}
        >
          <div className="label-sm text-[#9B8F84] mb-1">Total Subscribers</div>
          <div
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontWeight: 300,
              fontSize: "1.75rem",
              color: "var(--color-espresso)",
              lineHeight: 1,
            }}
          >
            {subscribers.length}
          </div>
        </div>
      </div>

      {subscribers.length === 0 ? (
        <div
          className="p-10 text-center"
          style={{ background: "#FAF7F2", border: "1px solid rgba(228,216,201,0.8)" }}
        >
          <p style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.875rem", color: "var(--color-taupe-light)" }}>
            No subscribers yet. The signup form is live in the footer of the public site.
          </p>
        </div>
      ) : (
        <div style={{ background: "#FAF7F2", border: "1px solid rgba(228,216,201,0.8)", overflowX: "auto" }}>
          <table className="w-full min-w-[500px]">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(228,216,201,0.8)" }}>
                {["First Name", "Email", "Source", "Date"].map((col) => (
                  <th key={col} className="text-left px-4 py-3.5 label-sm text-[#9B8F84]">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s, index) => (
                <tr
                  key={s.id}
                  style={{ borderBottom: index < subscribers.length - 1 ? "1px solid rgba(228,216,201,0.5)" : "none" }}
                >
                  <td
                    className="px-4 py-3.5"
                    style={{ fontFamily: "Jost", fontWeight: 400, fontSize: "0.875rem", color: "var(--color-espresso)" }}
                  >
                    {s.firstName ?? "—"}
                  </td>
                  <td
                    className="px-4 py-3.5"
                    style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.875rem", color: "var(--color-taupe)" }}
                  >
                    {s.email}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className="label-sm px-2 py-0.5"
                      style={{ color: "var(--color-taupe)", background: "rgba(155,143,132,0.12)" }}
                    >
                      {s.source ?? "website"}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3.5"
                    style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.8125rem", color: "var(--color-taupe-light)" }}
                  >
                    {formatDate(s.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
