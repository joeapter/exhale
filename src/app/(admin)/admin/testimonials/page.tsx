import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function AdminTestimonialsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const testimonials = await prisma.testimonial.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1
          style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontWeight: 300, fontSize: "2.25rem", color: "var(--color-espresso)" }}
        >
          Testimonials
        </h1>
      </div>

      {testimonials.length === 0 ? (
        <div
          className="p-10 text-center"
          style={{ background: "#FAF7F2", border: "1px solid rgba(228,216,201,0.8)" }}
        >
          <p
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontStyle: "italic",
              fontSize: "1.25rem",
              color: "var(--color-taupe)",
              marginBottom: "0.5rem",
            }}
          >
            No testimonials yet.
          </p>
          <p style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.875rem", color: "var(--color-taupe-light)" }}>
            After your first retreat, add real guest quotes here.
          </p>
        </div>
      ) : (
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
                  {t.location && (
                    <span style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.75rem", color: "var(--color-taupe-light)" }}>{t.location}</span>
                  )}
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
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-6" style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.8125rem", color: "var(--color-taupe-light)" }}>
        Add testimonials directly via the database after collecting real guest feedback.
      </p>
    </div>
  );
}
