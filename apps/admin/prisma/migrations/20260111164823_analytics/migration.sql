-- AlterTable
ALTER TABLE "anonymous_messages" ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "countryCode" TEXT,
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "region" TEXT;

-- CreateTable
CREATE TABLE "analytics_events" (
    "id" TEXT NOT NULL,
    "page" VARCHAR(100) NOT NULL,
    "entityType" VARCHAR(50) NOT NULL,
    "entityId" TEXT,
    "eventType" VARCHAR(20) NOT NULL,
    "data" JSONB,
    "userSession" TEXT,
    "ipAddress" VARCHAR(45),
    "countryCode" VARCHAR(2),
    "city" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "analytics_events_page_idx" ON "analytics_events"("page");

-- CreateIndex
CREATE INDEX "analytics_events_eventType_idx" ON "analytics_events"("eventType");

-- CreateIndex
CREATE INDEX "analytics_events_entityType_entityId_idx" ON "analytics_events"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "analytics_events_createdAt_idx" ON "analytics_events"("createdAt");

-- CreateIndex
CREATE INDEX "anonymous_messages_countryCode_idx" ON "anonymous_messages"("countryCode");

-- CreateIndex
CREATE INDEX "anonymous_messages_city_idx" ON "anonymous_messages"("city");
