-- BUILD #006 Reception AI
-- Adds the first AI Employee data model: conversations, messages, leads and tasks.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ConversationStatus') THEN
    CREATE TYPE "ConversationStatus" AS ENUM ('OPEN', 'WAITING_FOR_HUMAN', 'CLOSED');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'MessageSender') THEN
    CREATE TYPE "MessageSender" AS ENUM ('CUSTOMER', 'AI', 'HUMAN', 'SYSTEM');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'LeadStatus') THEN
    CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'QUALIFIED', 'DISQUALIFIED', 'CONVERTED');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'TaskStatus') THEN
    CREATE TYPE "TaskStatus" AS ENUM ('OPEN', 'DONE', 'CANCELLED');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'TaskPriority') THEN
    CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "Lead" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "name" TEXT,
  "email" TEXT,
  "summary" TEXT NOT NULL,
  "score" INTEGER NOT NULL DEFAULT 0,
  "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ReceptionConversation" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "customerName" TEXT,
  "customerEmail" TEXT,
  "channel" TEXT NOT NULL DEFAULT 'web',
  "status" "ConversationStatus" NOT NULL DEFAULT 'OPEN',
  "leadId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ReceptionConversation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ReceptionMessage" (
  "id" TEXT NOT NULL,
  "conversationId" TEXT NOT NULL,
  "sender" "MessageSender" NOT NULL,
  "content" TEXT NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ReceptionMessage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Task" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "status" "TaskStatus" NOT NULL DEFAULT 'OPEN',
  "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
  "dueAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Lead_organizationId_idx" ON "Lead"("organizationId");
CREATE INDEX IF NOT EXISTS "Lead_status_idx" ON "Lead"("status");
CREATE INDEX IF NOT EXISTS "ReceptionConversation_organizationId_idx" ON "ReceptionConversation"("organizationId");
CREATE INDEX IF NOT EXISTS "ReceptionConversation_status_idx" ON "ReceptionConversation"("status");
CREATE INDEX IF NOT EXISTS "ReceptionMessage_conversationId_idx" ON "ReceptionMessage"("conversationId");
CREATE INDEX IF NOT EXISTS "ReceptionMessage_sender_idx" ON "ReceptionMessage"("sender");
CREATE INDEX IF NOT EXISTS "Task_organizationId_idx" ON "Task"("organizationId");
CREATE INDEX IF NOT EXISTS "Task_status_idx" ON "Task"("status");
CREATE INDEX IF NOT EXISTS "Task_priority_idx" ON "Task"("priority");

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Lead_organizationId_fkey') THEN
    ALTER TABLE "Lead" ADD CONSTRAINT "Lead_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ReceptionConversation_organizationId_fkey') THEN
    ALTER TABLE "ReceptionConversation" ADD CONSTRAINT "ReceptionConversation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ReceptionConversation_leadId_fkey') THEN
    ALTER TABLE "ReceptionConversation" ADD CONSTRAINT "ReceptionConversation_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ReceptionMessage_conversationId_fkey') THEN
    ALTER TABLE "ReceptionMessage" ADD CONSTRAINT "ReceptionMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "ReceptionConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Task_organizationId_fkey') THEN
    ALTER TABLE "Task" ADD CONSTRAINT "Task_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
