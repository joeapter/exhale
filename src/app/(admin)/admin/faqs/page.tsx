import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminFaqsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const faqs = [
    { id: "f1", question: "Who is EXHALE for?", category: "The Retreat", isActive: true, sortOrder: 0 },
    { id: "f2", question: "Is this a spiritual retreat?", category: "The Retreat", isActive: true, sortOrder: 1 },
    { id: "f3", question: "Can you accommodate my dietary needs?", category: "Health & Dietary", isActive: true, sortOrder: 0 },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1
          style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontWeight: 300, fontSize: "2.25rem", color: "var(--color-espresso)" }}
        >
          FAQs
        </h1>
        <button
          className="inline-flex items-center gap-2 px-5 py-2.5 uppercase"
          style={{
            fontFamily: "Jost", fontWeight: 400, fontSize: "0.75rem", letterSpacing: "0.16em",
            background: "var(--color-espresso)", color: "#FAF7F2", border: "none", cursor: "pointer",
          }}
        >
          + Add FAQ
        </button>
      </div>

      <div style={{ background: "#FAF7F2", border: "1px solid rgba(228,216,201,0.8)" }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(228,216,201,0.8)" }}>
              {["Question", "Category", "Active", "Actions"].map((col) => (
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
                  {faq.category}
                </td>
                <td className="px-5 py-4">
                  <span className="label-sm" style={{ color: faq.isActive ? "rgba(90,122,90,1)" : "var(--color-taupe-light)" }}>
                    {faq.isActive ? "Active" : "Hidden"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-4">
                    <button className="label-sm text-[#B89080] hover:text-[#7A6A5A] transition-colors" style={{ background: "none", border: "none", cursor: "pointer" }}>Edit</button>
                    <button className="label-sm text-[#9B8F84] hover:text-red-400 transition-colors" style={{ background: "none", border: "none", cursor: "pointer" }}>Delete</button>
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
