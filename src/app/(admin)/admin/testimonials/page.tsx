import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminTestimonialsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const testimonials = [
    { id: "t1", name: "Ronit A.", location: "Tel Aviv", quote: "I arrived exhausted and left feeling like myself again.", isActive: true, sortOrder: 0 },
    { id: "t2", name: "Yael M.", location: "Jerusalem", quote: "I didn't expect to cry so much. Or laugh so much.", isActive: true, sortOrder: 1 },
    { id: "t3", name: "Shira K.", location: "Haifa", quote: "The food alone would have been worth the trip.", isActive: true, sortOrder: 2 },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1
          style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontWeight: 300, fontSize: "2.25rem", color: "var(--color-espresso)" }}
        >
          Testimonials
        </h1>
        <button
          className="inline-flex items-center gap-2 px-5 py-2.5 uppercase"
          style={{
            fontFamily: "Jost", fontWeight: 400, fontSize: "0.75rem", letterSpacing: "0.16em",
            background: "var(--color-espresso)", color: "#FAF7F2", border: "none", cursor: "pointer",
          }}
        >
          + Add Testimonial
        </button>
      </div>

      <div className="space-y-3">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="flex items-start justify-between gap-6 p-5"
            style={{ background: "#FAF7F2", border: "1px solid rgba(228,216,201,0.8)" }}
          >
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <span style={{ fontFamily: "Jost", fontWeight: 400, fontSize: "0.875rem", color: "var(--color-espresso)" }}>{t.name}</span>
                <span style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.75rem", color: "var(--color-taupe-light)" }}>{t.location}</span>
                <span className="label-sm" style={{ color: t.isActive ? "rgba(90,122,90,1)" : "var(--color-taupe-light)" }}>
                  {t.isActive ? "Active" : "Hidden"}
                </span>
              </div>
              <p
                style={{
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                  fontStyle: "italic",
                  fontWeight: 300,
                  fontSize: "1.0625rem",
                  color: "var(--color-taupe)",
                  lineHeight: 1.6,
                }}
              >
                "{t.quote}"
              </p>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <button className="label-sm text-[#B89080] hover:text-[#7A6A5A] transition-colors" style={{ background: "none", border: "none", cursor: "pointer" }}>Edit</button>
              <button className="label-sm text-[#9B8F84] hover:text-red-400 transition-colors" style={{ background: "none", border: "none", cursor: "pointer" }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
