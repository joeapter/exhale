import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

// ─── Slot definitions ─────────────────────────────────────────────────────────
// Single source of truth for every CMS-managed image on the public site.

export type ImageSlot = {
  key: string;
  label: string;
  location: string;       // where on the site
  aspectLabel: string;    // human-readable ratio label
  aspectCss: string;      // CSS aspect-ratio value for the preview box
  minWidth: number;
  minHeight: number;
  format: string;
  maxMB: number;
  notes: string;
  defaultSrc: string;
};

export const IMAGE_SLOTS: ImageSlot[] = [
  {
    key: "hero_home",
    label: "Home Hero",
    location: "Homepage — full-screen opening",
    aspectLabel: "3 : 2  landscape",
    aspectCss: "3 / 2",
    minWidth: 2400,
    minHeight: 1600,
    format: "JPG or WebP",
    maxMB: 4,
    notes:
      "Fills the entire viewport. Keep the main subject centered or lower-center — the top 60% shows clear sky/space and the bottom third has a dark overlay for text.",
    defaultSrc: "/assets/desert-glamping-at-sunset.png",
  },
  {
    key: "atmosphere_home",
    label: "Home Atmosphere",
    location: "Homepage — moodscape section",
    aspectLabel: "16 : 9  landscape",
    aspectCss: "16 / 9",
    minWidth: 2400,
    minHeight: 1350,
    format: "JPG or WebP",
    maxMB: 3,
    notes:
      "Full-bleed strip, roughly 70% of viewport height. Centered text is overlaid at the bottom. Dark atmospheric images work best.",
    defaultSrc: "/assets/noor/fire.webp",
  },
  {
    key: "hero_retreat",
    label: "Retreat Page Hero",
    location: "/retreat — opening section",
    aspectLabel: "3 : 2  landscape",
    aspectCss: "3 / 2",
    minWidth: 2400,
    minHeight: 1500,
    format: "JPG or WebP",
    maxMB: 4,
    notes:
      "Full-bleed, 80% of viewport height. Bottom half has a dark gradient overlay. Shows retreat location and atmosphere.",
    defaultSrc: "/assets/noor/grounds.webp",
  },
  {
    key: "gallery_1",
    label: "Retreat Gallery — Left",
    location: "/retreat — 3-photo portrait grid",
    aspectLabel: "4 : 5  portrait",
    aspectCss: "4 / 5",
    minWidth: 900,
    minHeight: 1125,
    format: "JPG or WebP",
    maxMB: 2,
    notes: "Displayed as one of three portrait images side-by-side. Keep subject centered horizontally.",
    defaultSrc: "/assets/noor/interior.webp",
  },
  {
    key: "gallery_2",
    label: "Retreat Gallery — Centre",
    location: "/retreat — 3-photo portrait grid",
    aspectLabel: "4 : 5  portrait",
    aspectCss: "4 / 5",
    minWidth: 900,
    minHeight: 1125,
    format: "JPG or WebP",
    maxMB: 2,
    notes: "Displayed as one of three portrait images side-by-side. Keep subject centered horizontally.",
    defaultSrc: "/assets/noor/bed.webp",
  },
  {
    key: "gallery_3",
    label: "Retreat Gallery — Right",
    location: "/retreat — 3-photo portrait grid",
    aspectLabel: "4 : 5  portrait",
    aspectCss: "4 / 5",
    minWidth: 900,
    minHeight: 1125,
    format: "JPG or WebP",
    maxMB: 2,
    notes: "Displayed as one of three portrait images side-by-side. Keep subject centered horizontally.",
    defaultSrc: "/assets/noor/lounge.webp",
  },
  {
    key: "logo_footer",
    label: "Footer Partner Logo",
    location: "Footer — centered credit block",
    aspectLabel: "1 : 1  square",
    aspectCss: "1 / 1",
    minWidth: 300,
    minHeight: 300,
    format: "PNG with transparency",
    maxMB: 0.5,
    notes:
      "Displayed at 90 × 90 px with object-contain. Use a transparent background. SVG or hi-res PNG preferred.",
    defaultSrc: "/assets/Elevate Events Logo .png",
  },
];

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
