import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import DeleteFacilitatorButton from "./DeleteFacilitatorButton";

export default async function AdminFacilitatorsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const facilitators = await prisma.facilitator.findMany({
    orderBy: { sortOrder: "asc" },
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
          Facilitators
        </h1>
        <Link
          href="/admin/facilitators/new"
          style={{
            fontFamily: "Jost",
            fontWeight: 400,
            fontSize: "0.8125rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            background: "var(--color-espresso)",
            color: "#FAF7F2",
            padding: "0.625rem 1.5rem",
            textDecoration: "none",
          }}
        >
          + Add Facilitator
        </Link>
      </div>

      {facilitators.length === 0 ? (
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
            }}
          >
            No facilitators yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {facilitators.map((f) => (
            <div
              key={f.id}
              className="flex items-start gap-5 p-5"
              style={{ background: "#FAF7F2", border: "1px solid rgba(228,216,201,0.8)" }}
            >
              {/* Photo */}
              <div
                className="shrink-0"
                style={{
                  width: 64,
                  height: 64,
                  background: "rgba(228,216,201,0.4)",
                  borderRadius: "0.375rem",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {f.image ? (
                  <Image src={f.image} alt={f.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span style={{ fontFamily: "Cormorant Garamond", fontStyle: "italic", fontSize: "1.5rem", color: "var(--color-taupe-light)" }}>
                      {f.name[0]}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span style={{ fontFamily: "Jost", fontWeight: 400, fontSize: "0.9375rem", color: "var(--color-espresso)" }}>
                    {f.name}
                  </span>
                  {f.title && (
                    <span style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.8125rem", color: "var(--color-taupe-light)" }}>
                      {f.title}
                    </span>
                  )}
                  <span
                    style={{
                      fontFamily: "Jost",
                      fontWeight: 300,
                      fontSize: "0.6875rem",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: f.isActive ? "rgba(90,122,90,1)" : "var(--color-taupe-light)",
                    }}
                  >
                    {f.isActive ? "Visible" : "Hidden"}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "Jost",
                    fontWeight: 300,
                    fontSize: "0.8125rem",
                    color: "var(--color-taupe)",
                    lineHeight: 1.6,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {f.bio}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href={`/admin/facilitators/${f.id}/edit`}
                  style={{
                    fontFamily: "Jost",
                    fontWeight: 300,
                    fontSize: "0.8125rem",
                    color: "var(--color-taupe)",
                    textDecoration: "underline",
                    textUnderlineOffset: "2px",
                  }}
                >
                  Edit
                </Link>
                <DeleteFacilitatorButton id={f.id} name={f.name} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
