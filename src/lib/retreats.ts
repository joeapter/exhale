import { prisma } from "./prisma";
import type { Retreat, RetreatPackage, RetreatImage } from "@prisma/client";

export type RetreatWithDetails = Retreat & {
  packages: RetreatPackage[];
  images: RetreatImage[];
};

export async function getPublishedRetreats() {
  return prisma.retreat.findMany({
    where: { status: { in: ["PUBLISHED", "SOLD_OUT"] } },
    include: { packages: { where: { isActive: true }, orderBy: { sortOrder: "asc" } }, images: { orderBy: { sortOrder: "asc" } } },
    orderBy: { startDate: "asc" },
  });
}

export async function getRetreatBySlug(slug: string): Promise<RetreatWithDetails | null> {
  return prisma.retreat.findUnique({
    where: { slug },
    include: {
      packages: { where: { isActive: true }, orderBy: { sortOrder: "asc" } },
      images: { orderBy: { sortOrder: "asc" } },
      faqs: { orderBy: { sortOrder: "asc" } },
    },
  });
}
