import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

async function getOrCreatePrice({
  currentPriceId,
  productId,
  amount,
  nickname,
  metadata,
}: {
  currentPriceId: string | null;
  productId: string;
  amount: number;
  nickname: string;
  metadata: Record<string, string>;
}) {
  const stripe = getStripe();

  if (currentPriceId) {
    try {
      const current = await stripe.prices.retrieve(currentPriceId);
      const currentProduct =
        typeof current.product === "string" ? current.product : current.product.id;

      if (
        current.active &&
        current.currency === "ils" &&
        current.unit_amount === amount &&
        currentProduct === productId
      ) {
        return current.id;
      }

      if (current.active) {
        await stripe.prices.update(current.id, { active: false });
      }
    } catch {
      // The saved ID may belong to another Stripe mode/account. Create a fresh price.
    }
  }

  const price = await stripe.prices.create({
    currency: "ils",
    unit_amount: amount,
    product: productId,
    nickname,
    metadata,
  });

  return price.id;
}

export async function syncRetreatPackageToStripe(packageId: string) {
  const pkg = await prisma.retreatPackage.findUnique({
    where: { id: packageId },
    include: { retreat: true },
  });

  if (!pkg) throw new Error("Retreat package not found.");

  const stripe = getStripe();
  const metadata = {
    retreatId: pkg.retreatId,
    packageId: pkg.id,
  };

  try {
    let productId = pkg.stripeProductId;

    if (productId) {
      try {
        await stripe.products.update(productId, {
          name: `${pkg.retreat.title} — ${pkg.name}`,
          description: pkg.description ?? undefined,
          active: pkg.isActive,
          metadata,
        });
      } catch {
        productId = null;
      }
    }

    if (!productId) {
      const product = await stripe.products.create(
        {
          name: `${pkg.retreat.title} — ${pkg.name}`,
          description: pkg.description ?? undefined,
          active: pkg.isActive,
          metadata,
        },
        { idempotencyKey: `exhale-package-product-${pkg.id}` }
      );
      productId = product.id;
    }

    const [depositPriceId, fullPriceId] = await Promise.all([
      getOrCreatePrice({
        currentPriceId: pkg.stripeDepositPriceId,
        productId,
        amount: pkg.depositAmount,
        nickname: `${pkg.retreat.title} — ${pkg.name} deposit`,
        metadata: { ...metadata, kind: "DEPOSIT" },
      }),
      getOrCreatePrice({
        currentPriceId: pkg.stripeFullPriceId,
        productId,
        amount: pkg.fullPrice,
        nickname: `${pkg.retreat.title} — ${pkg.name} full payment`,
        metadata: { ...metadata, kind: "FULL" },
      }),
    ]);

    await prisma.retreatPackage.update({
      where: { id: pkg.id },
      data: {
        stripeProductId: productId,
        stripeDepositPriceId: depositPriceId,
        stripeFullPriceId: fullPriceId,
        stripeSyncedAt: new Date(),
        stripeSyncError: null,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Stripe sync failed.";
    await prisma.retreatPackage.update({
      where: { id: pkg.id },
      data: { stripeSyncError: message },
    });
    throw error;
  }
}

export async function syncRetreatToStripe(retreatId: string) {
  const retreat = await prisma.retreat.findUnique({
    where: { id: retreatId },
    select: {
      status: true,
      packages: { where: { isActive: true }, select: { id: true } },
    },
  });

  if (!retreat || retreat.status !== "PUBLISHED") return;

  for (const pkg of retreat.packages) {
    await syncRetreatPackageToStripe(pkg.id);
  }
}
