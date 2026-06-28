-- AlterTable
ALTER TABLE "DemoRequest" ADD COLUMN "internalNote" TEXT;
ALTER TABLE "DemoRequest" ADD COLUMN "nextStep" TEXT;
ALTER TABLE "DemoRequest" ADD COLUMN "followUpAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "DemoRequest_followUpAt_idx" ON "DemoRequest"("followUpAt");
