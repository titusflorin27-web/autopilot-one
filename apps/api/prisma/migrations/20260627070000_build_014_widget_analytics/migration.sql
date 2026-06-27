-- BUILD #014 Widget Analytics / Install Health

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'WidgetEventType') THEN
    CREATE TYPE "WidgetEventType" AS ENUM (
      'CONFIG_LOADED',
      'LOADED',
      'OPENED',
      'MESSAGE_SENT',
      'MESSAGE_RECEIVED',
      'ERROR'
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "WidgetEvent" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "type" "WidgetEventType" NOT NULL,
  "visitorId" TEXT,
  "conversationId" TEXT,
  "websiteUrl" TEXT,
  "origin" TEXT,
  "userAgent" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "WidgetEvent_pkey" PRIMARY KEY ("id")
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'WidgetEvent_organizationId_fkey'
  ) THEN
    ALTER TABLE "WidgetEvent"
      ADD CONSTRAINT "WidgetEvent_organizationId_fkey"
      FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "WidgetEvent_organizationId_idx" ON "WidgetEvent"("organizationId");
CREATE INDEX IF NOT EXISTS "WidgetEvent_type_idx" ON "WidgetEvent"("type");
CREATE INDEX IF NOT EXISTS "WidgetEvent_visitorId_idx" ON "WidgetEvent"("visitorId");
CREATE INDEX IF NOT EXISTS "WidgetEvent_createdAt_idx" ON "WidgetEvent"("createdAt");
