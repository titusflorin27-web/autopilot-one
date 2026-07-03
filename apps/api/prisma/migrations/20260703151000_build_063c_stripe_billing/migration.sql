ALTER TABLE "Organization"
  ADD COLUMN IF NOT EXISTS "billingCurrentPeriodEnd" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "stripeCustomerId" TEXT,
  ADD COLUMN IF NOT EXISTS "stripeSubscriptionId" TEXT,
  ADD COLUMN IF NOT EXISTS "stripePriceId" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "Organization_stripeCustomerId_key"
  ON "Organization"("stripeCustomerId");

CREATE UNIQUE INDEX IF NOT EXISTS "Organization_stripeSubscriptionId_key"
  ON "Organization"("stripeSubscriptionId");
