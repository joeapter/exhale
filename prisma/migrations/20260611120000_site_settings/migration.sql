-- CreateTable
CREATE TABLE "site_settings" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("key")
);

-- Seed default theme
INSERT INTO "site_settings" ("key", "value", "updatedAt")
VALUES ('theme', 'desert', NOW())
ON CONFLICT ("key") DO NOTHING;
