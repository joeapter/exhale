import type { Metadata } from "next";
import HomeHero from "@/components/sections/HomeHero";
import HomeIntro from "@/components/sections/HomeIntro";
import HomeExperience from "@/components/sections/HomeExperience";
import HomeAtmosphere from "@/components/sections/HomeAtmosphere";
import HomeTestimonials from "@/components/sections/HomeTestimonials";
import HomeRetreatCTA from "@/components/sections/HomeRetreatCTA";
import { prisma } from "@/lib/prisma";
import { formatDateRange } from "@/lib/utils";
import { getSiteImage } from "@/lib/site-images";

export const metadata: Metadata = {
  title: "EXHALE — Desert Escape for Women",
  description:
    "A women-only luxury desert retreat in Israel. Rest, nourishment, open sky, and stillness. A few days to return to yourself.",
};

export default async function HomePage() {
  const [nextRetreat, heroImage] = await Promise.all([
    prisma.retreat.findFirst({
      where: {
        status: { in: ["PUBLISHED", "SOLD_OUT"] },
        startDate: { gt: new Date() },
      },
      orderBy: { startDate: "asc" },
      select: { startDate: true, endDate: true, location: true },
    }),
    getSiteImage("hero_home"),
  ]);

  const retreatEyebrow = nextRetreat
    ? `${formatDateRange(nextRetreat.startDate, nextRetreat.endDate)} · ${nextRetreat.location}`
    : "New retreat dates coming soon";

  return (
    <>
      <HomeHero
        retreatEyebrow={retreatEyebrow}
        hasUpcomingRetreat={Boolean(nextRetreat)}
        heroImage={heroImage}
      />
      <HomeIntro />
      <HomeExperience />
      <HomeAtmosphere />
      <HomeTestimonials />
      <HomeRetreatCTA />
    </>
  );
}
