/*
  Warnings:

  - You are about to drop the `about_me` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `blog_links` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "countryCode" TEXT,
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "region" TEXT;

-- AlterTable
ALTER TABLE "contact_forms" ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "countryCode" TEXT,
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "region" TEXT;

-- AlterTable
ALTER TABLE "guestbook_entries" ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "countryCode" TEXT,
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "region" TEXT;

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "projectDate" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "tags" TEXT[];

-- DropTable
DROP TABLE "about_me";

-- DropTable
DROP TABLE "blog_links";

-- CreateTable
CREATE TABLE "BlogLink" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "source" TEXT NOT NULL,
    "category" TEXT,
    "tags" TEXT[],
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutMe" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "roles" TEXT[],
    "bio" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "location" TEXT,
    "avatarUrl" TEXT,
    "resumeUrl" TEXT,
    "availabilityStatus" TEXT,
    "skills" TEXT[],
    "experience" JSONB,
    "socialLinks" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutMe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievements" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "monthYear" TEXT NOT NULL,
    "photos" TEXT[],
    "description" TEXT NOT NULL,
    "externalUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "achievements_order_idx" ON "achievements"("order");

-- CreateIndex
CREATE INDEX "achievements_visible_idx" ON "achievements"("visible");

-- CreateIndex
CREATE INDEX "bookings_countryCode_idx" ON "bookings"("countryCode");

-- CreateIndex
CREATE INDEX "contact_forms_countryCode_idx" ON "contact_forms"("countryCode");

-- CreateIndex
CREATE INDEX "guestbook_entries_countryCode_idx" ON "guestbook_entries"("countryCode");
