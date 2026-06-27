-- BUILD #017 Billing / Plans / Usage Limits

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'BillingPlan') THEN
    CREATE TYPE "BillingPlan" AS ENUM ('FREE', 'STARTER', 'PRO', 'BUSINESS');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'BillingStatus') THEN
    CREATE TYPE "BillingStatus" AS ENUM ('TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELLED');
  END IF;
END $$;

ALTER TABLE "Organization"
  ADD COLUMN IF NOT EXISTS "billingPlan" "BillingPlan" NOT NULL DEFAULT 'FREE',
  ADD COLUMN IF NOT EXISTS "billingStatus" "BillingStatus" NOT NULL DEFAULT 'TRIALING',
  ADD COLUMN IF NOT EXISTS "billingCurrentPeriodStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
