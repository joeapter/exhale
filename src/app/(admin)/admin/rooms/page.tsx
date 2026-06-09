import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import RoomOrganizerClient from "./RoomOrganizerClient";

export default async function AdminRoomsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const retreats = await prisma.retreat.findMany({
    where: { status: { notIn: ["DRAFT", "CANCELED"] } },
    orderBy: { startDate: "desc" },
    select: { id: true, title: true, startDate: true, endDate: true },
  });

  return (
    <div className="rooms-admin-page max-w-[1400px] mx-auto px-6 py-10">
      <RoomOrganizerClient
        retreats={retreats.map((r) => ({
          id: r.id,
          title: r.title,
          startDate: r.startDate.toISOString(),
          endDate: r.endDate.toISOString(),
        }))}
      />
    </div>
  );
}
