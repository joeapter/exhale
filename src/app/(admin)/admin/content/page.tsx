import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ContentForm from "./ContentForm";

export default async function AdminContentPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const items = await prisma.siteContent.findMany({ orderBy: { key: "asc" } });

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
      <ContentForm items={items.map((i) => ({ key: i.key, label: i.label, value: i.value, type: i.type }))} />
    </div>
  );
}
