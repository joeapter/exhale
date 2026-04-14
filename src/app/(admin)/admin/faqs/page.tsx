import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function AdminFaqsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const faqs = await prisma.faq.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1
          style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontWeight: 300, fontSize: "2.25rem", color: "var(--color-espresso)" }}
        >
          FAQs
        </h1>
      </div>

      <div style={{ background: "#FAF7F2", border: "1px solid rgba(228,216,201,0.8)" }}>
        {faqs.length === 0 ? (
          <p className="px-5 py-10 text-center" style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.875rem", color: "var(--color-taupe-light)" }}>
            No FAQs yet.
          </p>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(228,216,201,0.8)" }}>
                {["Question", "Category", "Active"].map((col) => (
                  <th key={col} className="text-left px-5 py-3.5 label-sm text-[#9B8F84]">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {faqs.map((faq, i) => (
                <tr key={faq.id} style={{ borderBottom: i < faqs.length - 1 ? "1px solid rgba(228,216,201,0.5)" : "none" }}>
                  <td className="px-5 py-4" style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.875rem", color: "var(--color-espresso)" }}>
                    {faq.question}
                  </td>
                  <td className="px-5 py-4" style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.8125rem", color: "var(--color-taupe)" }}>
                    {faq.category ?? "—"}
                  </td>
                  <td className="px-5 py-4">
                    <span className="label-sm" style={{ color: faq.isActive ? "rgba(90,122,90,1)" : "var(--color-taupe-light)" }}>
                      {faq.isActive ? "Active" : "Hidden"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="mt-6" style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.8125rem", color: "var(--color-taupe-light)" }}>
        To edit FAQ content, update the entries directly in the database or via the seed file.
      </p>
    </div>
  );
}
