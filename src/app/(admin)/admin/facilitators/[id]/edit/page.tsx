import { getAdminSession } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import FacilitatorForm from "../../FacilitatorForm";

export default async function EditFacilitatorPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const facilitator = await prisma.facilitator.findUnique({ where: { id } });
  if (!facilitator) notFound();

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-10">
      <div className="flex items-center gap-3 mb-2">
        <Link
          href="/admin/facilitators"
          style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.8125rem", color: "var(--color-taupe-light)", textDecoration: "none" }}
        >
          ← Facilitators
        </Link>
      </div>
      <h1
        className="mb-8"
        style={{
          fontFamily: "Cormorant Garamond, Georgia, serif",
          fontWeight: 300,
          fontSize: "2.25rem",
          color: "var(--color-espresso)",
        }}
      >
        Edit — {facilitator.name}
      </h1>
      <FacilitatorForm facilitator={facilitator} />
    </div>
  );
}
