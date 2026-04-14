import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌵 Seeding EXHALE database…");

  // ─── Clean up any placeholder retreats ───────────────────────
  await prisma.retreat.deleteMany({
    where: { slug: { in: ["summer-escape-2026", "autumn-stillness-2026"] } },
  });
  await prisma.testimonial.deleteMany({});
  console.log("✓ Cleared placeholder data");

  // ─── Admin user ───────────────────────────────────────────────
  const password = await bcrypt.hash("Hashem613!", 12);
  const admin = await prisma.adminUser.upsert({
    where: { email: "joeapter@gmail.com" },
    update: { password },
    create: {
      email: "joeapter@gmail.com",
      name: "EXHALE Admin",
      password,
      role: "SUPER_ADMIN",
    },
  });
  console.log("✓ Admin user:", admin.email);

  // ─── Retreat: EXHALE Desert Escape — June 7–9 2026 ───────────
  const desertEscape = await prisma.retreat.upsert({
    where: { slug: "exhale-desert-escape" },
    update: {
      title: "EXHALE Desert Escape",
      tagline: "Two nights in the desert of southern Israel",
      overview: "Two nights at Noor Glamping in the desert of southern Israel. Full board (three gourmet meals and 24-hour tea room). Luxurious furnished tents, morning movement, and evenings by the fire.",
      location: "Noor Glamping, Israel",
      locationDetail: "חוות אל היען, אורים, ישראל",
      startDate: new Date("2026-06-07"),
      endDate: new Date("2026-06-09"),
      capacity: 32,
      status: "PUBLISHED",
      inclusions: [
        "2 nights in a furnished glamping tent",
        "All meals from arrival dinner to departure breakfast",
        "Morning movement sessions",
        "Evening workshops and activities",
        "Welcome amenity kit",
        "And much more",
      ],
      exclusions: ["Transportation to and from the site"],
      accommodations: "Luxury furnished tents with air conditioning, plunge pools, hammocks, and breathtaking desert views.",
      dining: "Freshly made on site, with the highest kashrus standards. We eat together slowly — under the sky.",
    },
    create: {
      slug: "exhale-desert-escape",
      status: "PUBLISHED",
      title: "EXHALE Desert Escape",
      tagline: "Two nights in the desert of southern Israel",
      overview: "Two nights at Noor Glamping in the desert of southern Israel. Full board (three gourmet meals and 24-hour tea room). Luxurious furnished tents, morning movement, and evenings by the fire.",
      location: "Noor Glamping, Israel",
      locationDetail: "חוות אל היען, אורים, ישראל",
      inclusions: [
        "2 nights in a furnished glamping tent",
        "All meals from arrival dinner to departure breakfast",
        "Morning movement sessions",
        "Evening workshops and activities",
        "Welcome amenity kit",
        "And much more",
      ],
      exclusions: ["Transportation to and from the site"],
      accommodations: "Luxury furnished tents with air conditioning, plunge pools, hammocks, and breathtaking desert views.",
      dining: "Freshly made on site, with the highest kashrus standards. We eat together slowly — under the sky.",
      startDate: new Date("2026-06-07"),
      endDate: new Date("2026-06-09"),
      capacity: 32,
      spotsRemaining: 32,
      itinerary: [
        { day: 1, title: "Arrive & Settle", activities: ["Afternoon arrival from 14:00", "Welcome tea", "Free time", "Arrival dinner"] },
        { day: 2, title: "The Full Day", activities: ["Morning movement", "Full breakfast", "Free time", "Long lunch", "Workshops & activities", "Dinner", "Bonfire Kumzits"] },
        { day: 3, title: "Settle & Depart", activities: ["Morning movement", "Closing breakfast", "Departure by 12:00"] },
      ],
      packages: {
        create: [
          {
            name: "Luxury Suite",
            description: "8 suites, 2 people per suite. Beautifully furnished with everything you need.",
            fullPrice: 390000,
            depositAmount: 100000,
            capacity: 16,
            available: 16,
            sortOrder: 0,
          },
          {
            name: "Deluxe Unit",
            description: "4 units, up to 4 people per unit. Spacious, comfortable, and great value.",
            fullPrice: 290000,
            depositAmount: 80000,
            capacity: 16,
            available: 16,
            sortOrder: 1,
          },
        ],
      },
      faqs: {
        create: [
          { question: "Who is this for?", answer: "Women who are ready to rest. No retreat experience needed. Just a willingness to stop for a few days.", sortOrder: 0 },
          { question: "Can I come alone?", answer: "Yes — and many women do. The atmosphere is warm and there's a natural ease among guests.", sortOrder: 1 },
          { question: "What about dietary needs?", answer: "Our kitchen accommodates vegetarian, vegan, gluten-free, and most other requirements with the highest kashrus standards. Share yours when you register.", sortOrder: 2 },
          { question: "How do I get there?", answer: "We recommend driving. Noor Glamping is about 1 hour from Be'er Sheva and 2.5 hours from Tel Aviv. Full directions are sent after registration.", sortOrder: 3 },
        ],
      },
    },
  });
  console.log("✓ Retreat:", desertEscape.title);

  // ─── Site FAQs ────────────────────────────────────────────────
  const faqs = [
    {
      category: "The Retreat", sortOrder: 0,
      question: "Who is EXHALE for?",
      answer: "EXHALE is for women who are ready to rest. You don't need to be spiritual, experienced with retreats, or have any particular background. If you are a woman who is tired, or simply ready for three days of genuine space — this is for you.",
    },
    {
      category: "The Retreat", sortOrder: 1,
      question: "Is this a spiritual retreat?",
      answer: "Not in a religious sense. EXHALE draws from a philosophy of intentional rest, beauty, and presence. There are elements of reflection and connection built into the experience, but there is no doctrine or prescribed spiritual practice required.",
    },
    {
      category: "The Retreat", sortOrder: 2,
      question: "How many women attend?",
      answer: "We keep the group small — intentionally. Small enough to prepare food with care, to know each guest by name, and to hold the space well.",
    },
    {
      category: "The Retreat", sortOrder: 3,
      question: "Do I have to participate in everything?",
      answer: "Nothing is required. The morning movement session, the evening gathering, the guided walk — all are invitations, not obligations. You are welcome to sleep, to sit alone, to read, to simply be.",
    },
    {
      category: "Practical", sortOrder: 0,
      question: "Where exactly is the retreat held?",
      answer: "The June retreat is held at Noor Glamping — חוות אל היען, אורים, ישראל. Full directions are sent after registration.",
    },
    {
      category: "Practical", sortOrder: 1,
      question: "How do I get there?",
      answer: "We recommend driving. Noor Glamping is approximately 1 hour from Be'er Sheva and 2.5 hours from Tel Aviv. Carpooling coordination is available via our guest group after registration.",
    },
    {
      category: "Practical", sortOrder: 2,
      question: "What should I bring?",
      answer: "A full packing list is sent after registration. In brief: layers (desert nights are cool even in summer), comfortable walking shoes, sunscreen, a good book, and whatever helps you rest. We provide linens, towels, and basic toiletries.",
    },
    {
      category: "Practical", sortOrder: 3,
      question: "Is the desert too hot in summer?",
      answer: "Desert heat is different from coastal heat. It is dry, which makes it far more manageable. Our programming is scheduled around the cooler parts of the day — early mornings and evenings. The midday hours are for shade, rest, and swimming.",
    },
    {
      category: "Health & Dietary", sortOrder: 0,
      question: "Can you accommodate my dietary needs?",
      answer: "Yes. Our kitchen accommodates vegetarian, vegan, gluten-free, and most other dietary needs with genuine care and the highest kashrus standards. Please share your requirements clearly in your registration form.",
    },
    {
      category: "Health & Dietary", sortOrder: 1,
      question: "Are there any health requirements?",
      answer: "EXHALE is appropriate for most women in general good health. We ask that you share any health conditions relevant to your stay in your registration — not to gatekeep, but to care for you well. If you have specific concerns, please reach out and we'll discuss.",
    },
    {
      category: "Booking & Payment", sortOrder: 0,
      question: "Can I pay a deposit to secure my place?",
      answer: "Yes. You may secure your place with a deposit at the time of registration. The remaining balance is due 30 days before the retreat start date. Full payment is also accepted at registration.",
    },
    {
      category: "Booking & Payment", sortOrder: 1,
      question: "What is your cancellation policy?",
      answer: "Cancellations made more than 60 days before the retreat receive a full refund less a small administrative fee. Cancellations between 30–60 days are eligible for a 50% refund or a credit toward a future retreat. Cancellations within 30 days are non-refundable, but we will do our best to fill your place and offer a partial credit.",
    },
    {
      category: "Booking & Payment", sortOrder: 2,
      question: "What if a retreat is sold out?",
      answer: "Contact us to be added to our waitlist. We frequently have cancellations, and waitlisted guests are notified immediately when a place becomes available.",
    },
  ];

  for (let i = 0; i < faqs.length; i++) {
    await prisma.faq.upsert({
      where: { id: `seed-faq-${i}` },
      update: { question: faqs[i].question, answer: faqs[i].answer, category: faqs[i].category, sortOrder: faqs[i].sortOrder },
      create: { id: `seed-faq-${i}`, ...faqs[i], isActive: true },
    });
  }
  console.log("✓ FAQs seeded");

  // ─── Site Content ─────────────────────────────────────────────
  const contentBlocks = [
    { key: "home_hero_title", label: "Homepage Hero — Title", value: "Exhale.", type: "TEXT" as const },
    { key: "home_hero_subtitle", label: "Homepage Hero — Subtitle", value: "A women-only retreat in the Israeli desert.", type: "TEXT" as const },
    { key: "contact_email", label: "Contact Email", value: "booking@exhale.co.il", type: "TEXT" as const },
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
