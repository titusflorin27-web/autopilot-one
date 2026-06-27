-- BUILD #012 Widget Settings / Install Manager

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'WidgetPosition') THEN
    CREATE TYPE "WidgetPosition" AS ENUM ('LEFT', 'RIGHT');
  END IF;
END $$;

ALTER TABLE "Organization"
  ADD COLUMN IF NOT EXISTS "widgetEnabled" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "widgetTitle" TEXT NOT NULL DEFAULT 'Reception AI',
  ADD COLUMN IF NOT EXISTS "widgetPrimaryColor" TEXT NOT NULL DEFAULT '#8ee6c9',
  ADD COLUMN IF NOT EXISTS "widgetPosition" "WidgetPosition" NOT NULL DEFAULT 'RIGHT',
  ADD COLUMN IF NOT EXISTS "widgetToken" TEXT,
  ADD COLUMN IF NOT EXISTS "widgetAllowedOrigins" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
