import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";

const contentItems = [
  { key: "home_hero_title", label: "Homepage Hero — Title", value: "Exhale.", type: "TEXT" },
  { key: "home_hero_subtitle", label: "Homepage Hero — Subtitle", value: "A women-only retreat in the Israeli desert.", type: "TEXT" },
  { key: "home_intro_quote", label: "Homepage — Pull Quote", value: "There is a version of you that knows exactly what she needs.", type: "TEXT" },
  { key: "about_philosophy", label: "About — Philosophy text", value: "EXHALE was born from a simple observation…", type: "RICHTEXT" },
  { key: "contact_email", label: "Contact Email", value: "hello@exhale.co.il", type: "TEXT" },
];

export default async function AdminContentPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="max-w-[900px] mx-auto px-6 py-10">
      <div className="mb-8">
        <h1
          style={{ fontFamily: "Cormorant Garamond, Georgia, serif", fontWeight: 300, fontSize: "2.25rem", color: "var(--color-espresso)", marginBottom: "0.5rem" }}
        >
          Site Content
        </h1>
        <p style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.875rem", color: "var(--color-taupe-light)" }}>
          Edit core text content that appears across the public site.
        </p>
      </div>

      <div className="space-y-4">
        {contentItems.map((item) => (
          <div
            key={item.key}
            className="p-5"
            style={{ background: "#FAF7F2", border: "1px solid rgba(228,216,201,0.8)" }}
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <div style={{ fontFamily: "Jost", fontWeight: 400, fontSize: "0.875rem", color: "var(--color-espresso)" }}>{item.label}</div>
                <div className="label-sm text-[#9B8F84] mt-0.5">{item.key}</div>
              </div>
              <span className="label-sm text-[#9B8F84]">{item.type}</span>
            </div>

            {item.type === "RICHTEXT" ? (
              <textarea
                defaultValue={item.value}
                rows={4}
                style={{
                  fontFamily: "Jost",
                  fontWeight: 300,
                  fontSize: "0.875rem",
                  background: "var(--color-linen)",
                  border: "1px solid rgba(184,144,128,0.25)",
                  color: "var(--color-espresso)",
                  padding: "0.75rem",
                  width: "100%",
                  outline: "none",
                  resize: "vertical" as const,
                  lineHeight: 1.7,
                }}
              />
            ) : (
              <input
                defaultValue={item.value}
                style={{
                  fontFamily: "Jost",
                  fontWeight: 300,
                  fontSize: "0.875rem",
                  background: "var(--color-linen)",
                  border: "1px solid rgba(184,144,128,0.25)",
                  color: "var(--color-espresso)",
                  padding: "0.625rem 0.75rem",
                  width: "100%",
                  outline: "none",
                }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-8">
        <button
          className="px-7 py-3 uppercase transition-all"
          style={{
            fontFamily: "Jost", fontWeight: 400, fontSize: "0.75rem", letterSpacing: "0.16em",
            background: "var(--color-espresso)", color: "#FAF7F2", border: "none", cursor: "pointer",
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
