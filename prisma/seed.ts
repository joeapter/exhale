import { PrismaClient } from "@prisma/client";
// @ts-ignore — Prisma v5 client
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌵 Seeding EXHALE database…");

  // ─── Admin user ───────────────────────────────────────────────
  const password = await bcrypt.hash("exhale-admin-2026", 12);
  const admin = await prisma.adminUser.upsert({
    where: { email: "admin@exhale.co.il" },
    update: {},
    create: {
      email: "admin@exhale.co.il",
      name: "EXHALE Admin",
      password,
      role: "SUPER_ADMIN",
    },
  });
  console.log("✓ Admin user:", admin.email);

  // ─── Retreat: Summer Escape 2026 ──────────────────────────────
  const summerRetreat = await prisma.retreat.upsert({
    where: { slug: "summer-escape-2026" },
    update: {},
    create: {
      slug: "summer-escape-2026",
      status: "PUBLISHED",
      title: "Summer Escape",
      tagline: "Stillness in the crater",
      overview: `Three days in the heart of Makhtesh Ramon — the world's largest erosion crater — during the soft heat of early August. The days are warm and alive. The nights are cool and scattered with stars. The rhythm is entirely your own.

This retreat is for women who are ready to stop. To eat well. To sleep. To move their bodies in the morning air. To sit around a fire in the evening with women they'll remember for years.

We provide everything. You bring yourself.`,
      philosophy: `Makhtesh Ramon is not gentle. It is vast and elemental and profoundly humbling. We chose it deliberately — because some kinds of rest require scale.`,
      location: "Makhtesh Ramon, Negev Desert",
      locationDetail: "Our site sits at the edge of the crater, with unobstructed views across the Ramon crater floor.",
      inclusions: [
        "2 nights' accommodation in furnished canvas tent",
        "All meals from arrival dinner to departure breakfast",
        "Morning movement sessions (optional)",
        "Evening fire gathering",
        "Sound and breathwork sessions",
        "Nature walk with a desert guide",
        "Welcome amenity kit",
        "Access to all communal areas",
      ],
      exclusions: [
        "Transportation to and from the site",
        "Private massage (available on request)",
        "Alcoholic beverages",
      ],
      accommodations: "Spacious canvas bell tents furnished with a real raised bed, quality cotton linens, lanterns, and desert views.",
      dining: "Three full meals each day using seasonal, local ingredients. We eat together slowly, around a long table under the open sky.",
      startDate: new Date("2026-08-07"),
      endDate: new Date("2026-08-09"),
      capacity: 16,
      spotsRemaining: 12,
      itinerary: [
        { day: 1, title: "Arrive & Settle", activities: ["Afternoon arrival from 14:00", "Welcome tea and orientation", "Free time", "Welcome dinner at sunset", "Optional evening fire gathering"] },
        { day: 2, title: "The Full Day", activities: ["Sunrise walk 06:00", "Morning movement 07:30", "Full breakfast 09:00", "Free morning", "Long lunch 13:00", "Afternoon rest or guided walk", "Sound and breathwork 17:30", "Sunset dinner", "Fire gathering 20:30"] },
        { day: 3, title: "Settle & Depart", activities: ["Final morning movement 07:30", "Closing breakfast 09:00", "Closing circle", "Departure by 12:00"] },
      ],
      packages: {
        create: [
          { name: "Shared Tent", description: "Share a beautifully furnished bell tent with one other woman.", fullPrice: 290000, depositAmount: 80000, capacity: 12, available: 10, sortOrder: 0 },
          { name: "Private Tent", description: "Your own tent, entirely to yourself.", fullPrice: 390000, depositAmount: 100000, capacity: 4, available: 2, sortOrder: 1 },
        ],
      },
      faqs: {
        create: [
          { question: "What should I bring?", answer: "A packing list is sent after registration. Layers, comfortable shoes, sunscreen, a good book.", sortOrder: 0 },
          { question: "Is this right for me if I've never done a retreat before?", answer: "Absolutely. EXHALE is not a spiritual intensive. If you are ready for rest, you are ready for EXHALE.", sortOrder: 1 },
        ],
      },
    },
  });
  console.log("✓ Retreat:", summerRetreat.title);

  // ─── Retreat: Autumn Stillness 2026 ───────────────────────────
  const autumnRetreat = await prisma.retreat.upsert({
    where: { slug: "autumn-stillness-2026" },
    update: {},
    create: {
      slug: "autumn-stillness-2026",
      status: "PUBLISHED",
      title: "Autumn Stillness",
      tagline: "Desert colors at golden hour",
      overview: `October in the Negev is extraordinary. The heat has softened. The light is golden. The desert reveals its warmth slowly, generously. It is the perfect time to arrive with nothing to do and nowhere to be.

Autumn Stillness is a retreat at Ein Avdat — one of the most beautiful canyons in Israel — for women who are ready to let the season do its work.`,
      location: "Ein Avdat, Negev Desert",
      inclusions: [
        "2 nights' accommodation",
        "All meals",
        "Morning movement sessions",
        "Canyon walk with a guide",
        "Evening fire gatherings",
        "Welcome amenity kit",
      ],
      exclusions: ["Transportation", "Private massage"],
      accommodations: "Intimate glamping in furnished tents overlooking the Ein Avdat canyon.",
      dining: "Seasonal, locally sourced meals prepared with care.",
      startDate: new Date("2026-10-16"),
      endDate: new Date("2026-10-18"),
      capacity: 14,
      spotsRemaining: 14,
      itinerary: [
        { day: 1, title: "Arrive", activities: ["Arrival from 14:00", "Welcome dinner"] },
        { day: 2, title: "Full Day", activities: ["Morning movement", "Canyon walk", "Long lunch", "Evening fire"] },
        { day: 3, title: "Depart", activities: ["Closing breakfast", "Departure by 12:00"] },
      ],
      packages: {
        create: [
          { name: "Shared Tent", description: "Shared tent accommodation.", fullPrice: 290000, depositAmount: 80000, capacity: 10, available: 10, sortOrder: 0 },
          { name: "Private Tent", description: "Private tent accommodation.", fullPrice: 390000, depositAmount: 100000, capacity: 4, available: 4, sortOrder: 1 },
        ],
      },
    },
  });
  console.log("✓ Retreat:", autumnRetreat.title);

  // ─── Testimonials ─────────────────────────────────────────────
  const testimonials = [
    { name: "Ronit A.", location: "Tel Aviv", quote: "I arrived exhausted and left feeling like myself again. Not a new version. The original one. The one who knows how to breathe.", sortOrder: 0 },
    { name: "Yael M.", location: "Jerusalem", quote: "I didn't expect to cry so much. Or laugh so much. The desert does something to you — it makes everything else feel very far away, in the best possible sense.", sortOrder: 1 },
    { name: "Shira K.", location: "Haifa", quote: "The food alone would have been worth the trip. But the silence, the women, the mornings — that's what I'll carry with me for a long time.", sortOrder: 2 },
    { name: "Daniella R.", location: "Rehovot", quote: "I came not knowing what to expect. I left knowing exactly what I'd been missing. I'm already saving the date for next year.", sortOrder: 3 },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.upsert({
      where: { id: `seed-${t.name}` },
      update: {},
      create: { id: `seed-${t.name}`, ...t, isActive: true },
    });
  }
  console.log("✓ Testimonials seeded");

  // ─── Site FAQs ────────────────────────────────────────────────
  const faqs = [
    { question: "Who is EXHALE for?", answer: "EXHALE is for women who are ready to rest.", category: "The Retreat", sortOrder: 0 },
    { question: "Is this a spiritual retreat?", answer: "Not in a religious sense. EXHALE draws from a philosophy of intentional rest, beauty, and presence.", category: "The Retreat", sortOrder: 1 },
    { question: "How many women attend each retreat?", answer: "A maximum of 16 women per retreat.", category: "The Retreat", sortOrder: 2 },
    { question: "Can I pay a deposit?", answer: "Yes. Your place is secured with a deposit. The balance is due 30 days before the retreat.", category: "Booking & Payment", sortOrder: 0 },
    { question: "What if a retreat is sold out?", answer: "Contact us to be added to the waitlist.", category: "Booking & Payment", sortOrder: 1 },
  ];

  for (let i = 0; i < faqs.length; i++) {
    await prisma.faq.upsert({
      where: { id: `seed-faq-${i}` },
      update: {},
      create: { id: `seed-faq-${i}`, ...faqs[i], isActive: true },
    });
  }
  console.log("✓ FAQs seeded");

  // ─── Site Content ─────────────────────────────────────────────
  const contentBlocks = [
    { key: "home_hero_title", label: "Homepage Hero — Title", value: "Exhale.", type: "TEXT" as const },
    { key: "home_hero_subtitle", label: "Homepage Hero — Subtitle", value: "A women-only retreat in the Israeli desert.", type: "TEXT" as const },
    { key: "contact_email", label: "Contact Email", value: "hello@exhale.co.il", type: "TEXT" as const },
    { key: "instagram_url", label: "Instagram URL", value: "https://instagram.com/exhale.desert", type: "TEXT" as const },
  ];

  for (const block of contentBlocks) {
    await prisma.siteContent.upsert({
      where: { key: block.key },
      update: { value: block.value },
      create: block,
    });
  }
  console.log("✓ Site content seeded");

  console.log("\n🌿 Seeding complete!");
  console.log("\nAdmin credentials:");
  console.log("  Email:    admin@exhale.co.il");
  console.log("  Password: exhale-admin-2026");
  console.log("\n⚠️  Change the admin password immediately after first login.\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
