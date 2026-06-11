import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export type SiteTheme = "desert" | "forest";

export const getSiteTheme = unstable_cache(
  async (): Promise<SiteTheme> => {
    try {
      const setting = await prisma.siteSettings.findUnique({
        where: { key: "theme" },
      });
      const val = setting?.value;
      return val === "forest" ? "forest" : "desert";
    } catch {
      return "desert";
    }
  },
  ["site-theme"],
  { revalidate: 60 }
);
