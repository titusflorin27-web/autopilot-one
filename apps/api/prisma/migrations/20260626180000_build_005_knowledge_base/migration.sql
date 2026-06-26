-- BUILD #005 Knowledge Base
-- Adds source ingestion and searchable chunks for organization-level knowledge.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'KnowledgeSourceType') THEN
    CREATE TYPE "KnowledgeSourceType" AS ENUM ('TXT', 'PDF', 'DOCX', 'WEBSITE');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'KnowledgeSourceStatus') THEN
    CREATE TYPE "KnowledgeSourceStatus" AS ENUM ('UPLOADED', 'INDEXED', 'FAILED');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "KnowledgeSource" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "type" "KnowledgeSourceType" NOT NULL,
  "status" "KnowledgeSourceStatus" NOT NULL DEFAULT 'UPLOADED',
  "title" TEXT NOT NULL,
  "url" TEXT,
  "fileName" TEXT,
  "mimeType" TEXT,
  "contentHash" TEXT,
  "error" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "KnowledgeSource_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "KnowledgeChunk" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "sourceId" TEXT NOT NULL,
  "chunkIndex" INTEGER NOT NULL,
  "content" TEXT NOT NULL,
  "tokenCount" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "KnowledgeChunk_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "KnowledgeSource_organizationId_idx" ON "KnowledgeSource"("organizationId");
CREATE INDEX IF NOT EXISTS "KnowledgeSource_type_idx" ON "KnowledgeSource"("type");
CREATE INDEX IF NOT EXISTS "KnowledgeSource_status_idx" ON "KnowledgeSource"("status");
CREATE UNIQUE INDEX IF NOT EXISTS "KnowledgeChunk_sourceId_chunkIndex_key" ON "KnowledgeChunk"("sourceId", "chunkIndex");
CREATE INDEX IF NOT EXISTS "KnowledgeChunk_organizationId_idx" ON "KnowledgeChunk"("organizationId");
CREATE INDEX IF NOT EXISTS "KnowledgeChunk_sourceId_idx" ON "KnowledgeChunk"("sourceId");

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'KnowledgeSource_organizationId_fkey') THEN
    ALTER TABLE "KnowledgeSource" ADD CONSTRAINT "KnowledgeSource_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'KnowledgeChunk_organizationId_fkey') THEN
    ALTER TABLE "KnowledgeChunk" ADD CONSTRAINT "KnowledgeChunk_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'KnowledgeChunk_sourceId_fkey') THEN
    ALTER TABLE "KnowledgeChunk" ADD CONSTRAINT "KnowledgeChunk_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "KnowledgeSource"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
