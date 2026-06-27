-- BUILD #007 AI Employee Operations
-- Adds lifecycle fields for human handoff, task completion and lead operations.

ALTER TABLE "ReceptionConversation"
  ADD COLUMN IF NOT EXISTS "escalationReason" TEXT,
  ADD COLUMN IF NOT EXISTS "internalNote" TEXT,
  ADD COLUMN IF NOT EXISTS "closedAt" TIMESTAMP(3);

ALTER TABLE "Lead"
  ADD COLUMN IF NOT EXISTS "ownerNote" TEXT,
  ADD COLUMN IF NOT EXISTS "lastContactedAt" TIMESTAMP(3);

ALTER TABLE "Task"
  ADD COLUMN IF NOT EXISTS "ownerNote" TEXT,
  ADD COLUMN IF NOT EXISTS "completedAt" TIMESTAMP(3);
