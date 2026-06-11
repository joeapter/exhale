// Server-only: imports Prisma. Never import this in "use client" files.
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { IMAGE_SLOTS } from "@/lib/site-image-slots";

export { IMAGE_SLOTS } from "@/lib/site-image-slots";
export type { ImageSlot } from "@/lib/site-image-slots";

// ─── DB fetch ─────────────────────────────────────────────────────────────────

const fetchAllImages = unstable_cache(
  async (): Promise<Record<string, string>> => {
    try {
      const rows = await prisma.siteContent.findMany({
        where: { type: "IMAGE_URL" },
        select: { key: true, value: true },
      });
      return Object.fromEntries(rows.map((r) => [r.key, r.value]));
    } catch {
      return {};
    }
  },
  ["site-images"],
  { revalidate: 60 }
);

// Per-request dedup so multiple components don't each hit unstable_cache
export const getSiteImages = cache(fetchAllImages);

export async function getSiteImage(key: string): Promise<string> {
  const map = await getSiteImages();
  return (
    map[key] ??
    IMAGE_SLOTS.find((s) => s.key === key)?.defaultSrc ??
    ""
  );
}
