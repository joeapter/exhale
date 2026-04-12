import type { Metadata } from "next";
import HomeHero from "@/components/sections/HomeHero";
import HomeIntro from "@/components/sections/HomeIntro";
import HomeExperience from "@/components/sections/HomeExperience";
import HomeAtmosphere from "@/components/sections/HomeAtmosphere";
import HomeTestimonials from "@/components/sections/HomeTestimonials";
import HomeRetreatCTA from "@/components/sections/HomeRetreatCTA";

export const metadata: Metadata = {
  title: "EXHALE — Desert Escape for Women",
  description:
    "A women-only luxury desert retreat in Israel. Rest, nourishment, open sky, and stillness. A few days to return to yourself.",
};

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeIntro />
      <HomeExperience />
      <HomeAtmosphere />
      <HomeTestimonials />
      <HomeRetreatCTA />
    </>
  );
}
