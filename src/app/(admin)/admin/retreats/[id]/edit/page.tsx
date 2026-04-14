import { getAdminSession } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditRetreatForm from "./EditRetreatForm";

export default async function EditRetreatPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;

  const retreat = await prisma.retreat.findUnique({
    where: { id },
    include: { packages: { orderBy: { sortOrder: "asc" } } },
  });

  if (!retreat) notFound();

  return (
    <div className="max-w-[760px] mx-auto px-6 py-10">
      <div className="mb-8">
        <h1
          style={{
            fontFamily: "Cormorant Garamond, Georgia, serif",
            fontWeight: 300,
            fontSize: "2.25rem",
            color: "var(--color-espresso)",
          }}
        >
          Edit Retreat
        </h1>
        <p style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.875rem", color: "var(--color-taupe-light)", marginTop: "0.25rem" }}>
          {retreat.title}
        </p>
      </div>
      <EditRetreatForm retreat={JSON.parse(JSON.stringify(retreat))} />
    </div>
  );
}
