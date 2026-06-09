import { prisma } from "../src/lib/prisma";

const bio = `Malka will be joining us to facilitate a meditation and offer her signature hands on treatments. Malka comes with decades of professional training and experience in restorative mind body healing, and is uniquely heart and soul centered. After receiving her degree in clinical nutrition, Malka studied in accredited institutions and with one on one mentors to create the three unique spa treatments she will be offering: restorative reflexology, healing facials, and a spinal essential oil treatment. Malka is dedicating to using top quality natural products, matching her philosophy that the most healing gift of all is to bring women back to their essential pure, beautiful selves. Malka is also a graduate of Elevation Academy's Teachers Training, in which she fine tuned her lifelong love for delivering Chassidic Wisdom with relevance, sweetness and joy. Malka continues to learn, currently studying with top mentors in the mind body psychology field.`;

async function main() {
  await prisma.facilitator.upsert({
    where: { id: "facilitator-malka" },
    update: { name: "Malka", title: "The Natural Touch 🌾", bio, isActive: true, sortOrder: 0 },
    create: { id: "facilitator-malka", name: "Malka", title: "The Natural Touch 🌾", bio, isActive: true, sortOrder: 0 },
  });
  console.log("Malka seeded.");
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
