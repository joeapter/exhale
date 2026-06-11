-- Payment lifecycle, inventory holds, Stripe catalog references, and one-time guest payment links.
CREATE TYPE "InventoryStatus" AS ENUM ('HELD', 'CONFIRMED', 'RELEASED');
CREATE TYPE "PaymentKind" AS ENUM ('DEPOSIT', 'FULL', 'BALANCE', 'ADJUSTMENT');
CREATE TYPE "PaymentLinkStatus" AS ENUM ('OPEN', 'PAID', 'EXPIRED', 'CANCELED');
ALTER TYPE "PaymentMethod" ADD VALUE IF NOT EXISTS 'BIT';

ALTER TABLE "payments"
ADD COLUMN "kind" "PaymentKind" NOT NULL DEFAULT 'BALANCE',
ADD COLUMN "chargedAmount" INTEGER,
ADD COLUMN "chargedCurrency" TEXT,
ADD COLUMN "exchangeRate" DECIMAL(18,9),
ADD COLUMN "exchangeRateQuotedAt" TIMESTAMP(3),
ADD COLUMN "exchangeRateSource" TEXT,
ADD COLUMN "stripeFxQuoteId" TEXT;

ALTER TABLE "registrations"
ADD COLUMN "holdExpiresAt" TIMESTAMP(3),
ADD COLUMN "inventoryStatus" "InventoryStatus" NOT NULL DEFAULT 'HELD',
ADD COLUMN "stripeCustomerId" TEXT,
ADD COLUMN "termsAcceptedAt" TIMESTAMP(3),
ADD COLUMN "termsVersion" TEXT;

UPDATE "registrations"
SET "inventoryStatus" = CASE
  WHEN "status" = 'CONFIRMED' THEN 'CONFIRMED'::"InventoryStatus"
  WHEN "status" IN ('CANCELED', 'REFUNDED') THEN 'RELEASED'::"InventoryStatus"
  ELSE 'HELD'::"InventoryStatus"
END;

ALTER TABLE "retreat_packages"
ADD COLUMN "stripeDepositPriceId" TEXT,
ADD COLUMN "stripeFullPriceId" TEXT,
ADD COLUMN "stripeProductId" TEXT,
ADD COLUMN "stripeSyncError" TEXT,
ADD COLUMN "stripeSyncedAt" TIMESTAMP(3);

CREATE TABLE "payment_links" (
  "id" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "registrationId" TEXT NOT NULL,
  "createdById" TEXT,
  "kind" "PaymentKind" NOT NULL,
  "status" "PaymentLinkStatus" NOT NULL DEFAULT 'OPEN',
  "amount" INTEGER NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'ILS',
  "chargedAmount" INTEGER,
  "chargedCurrency" TEXT,
  "exchangeRate" DECIMAL(18,9),
  "exchangeRateQuotedAt" TIMESTAMP(3),
  "exchangeRateSource" TEXT,
  "stripeFxQuoteId" TEXT,
  "stripeSessionId" TEXT,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "paidAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "payment_links_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "payment_links_token_key" ON "payment_links"("token");
CREATE UNIQUE INDEX "payment_links_stripeSessionId_key" ON "payment_links"("stripeSessionId");
CREATE UNIQUE INDEX "payments_stripePaymentId_key" ON "payments"("stripePaymentId");
CREATE UNIQUE INDEX "payments_stripeSessionId_key" ON "payments"("stripeSessionId");
CREATE UNIQUE INDEX "retreat_packages_stripeProductId_key" ON "retreat_packages"("stripeProductId");
CREATE UNIQUE INDEX "retreat_packages_stripeDepositPriceId_key" ON "retreat_packages"("stripeDepositPriceId");
CREATE UNIQUE INDEX "retreat_packages_stripeFullPriceId_key" ON "retreat_packages"("stripeFullPriceId");

ALTER TABLE "payment_links"
ADD CONSTRAINT "payment_links_registrationId_fkey"
FOREIGN KEY ("registrationId") REFERENCES "registrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "payment_links"
ADD CONSTRAINT "payment_links_createdById_fkey"
FOREIGN KEY ("createdById") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
