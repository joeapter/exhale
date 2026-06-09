// One-time backfill: set amountDue = package.fullPrice for registrations
// that still have amountDue = package.depositAmount (the old behavior).
import { prisma } from "../src/lib/prisma";

async function main() {
  const registrations = await prisma.registration.findMany({
    where: { packageId: { not: null } },
    select: {
      id: true,
      amountDue: true,
      package: { select: { fullPrice: true, depositAmount: true } },
    },
  });

  let updated = 0;
  for (const reg of registrations) {
    if (!reg.package) continue;
    if (reg.amountDue === reg.package.depositAmount && reg.amountDue !== reg.package.fullPrice) {
      await prisma.registration.update({
        where: { id: reg.id },
        data: { amountDue: reg.package.fullPrice },
      });
      console.log(`Updated ${reg.id}: ${reg.amountDue} → ${reg.package.fullPrice}`);
      updated++;
    }
  }

  console.log(`\nDone. ${updated} of ${registrations.length} registrations updated.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
