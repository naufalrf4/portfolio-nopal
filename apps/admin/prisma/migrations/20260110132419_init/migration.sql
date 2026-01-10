-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "ProjectContextType" AS ENUM ('CONTEXT', 'ROLE', 'DECISIONS', 'TRADEOFFS', 'RESULT', 'ARCHITECTURE', 'OPERATIONS', 'METRICS');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "techStack" TEXT[],
    "liveUrl" TEXT,
    "repoUrl" TEXT,
    "imageUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_contexts" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" "ProjectContextType" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_contexts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_links" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "source" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guestbook_entries" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "reactions" JSONB NOT NULL DEFAULT '[]',
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guestbook_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anonymous_messages" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anonymous_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_logs" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "messages" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_links" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "icon" TEXT,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profile_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "knowledge_docs" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "indexed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "knowledge_docs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");

-- CreateIndex
CREATE INDEX "projects_slug_idx" ON "projects"("slug");

-- CreateIndex
CREATE INDEX "projects_category_idx" ON "projects"("category");

-- CreateIndex
CREATE INDEX "projects_featured_idx" ON "projects"("featured");

-- CreateIndex
CREATE INDEX "projects_visible_idx" ON "projects"("visible");

-- CreateIndex
CREATE INDEX "projects_order_idx" ON "projects"("order");

-- CreateIndex
CREATE INDEX "project_contexts_projectId_idx" ON "project_contexts"("projectId");

-- CreateIndex
CREATE INDEX "project_contexts_type_idx" ON "project_contexts"("type");

-- CreateIndex
CREATE INDEX "project_contexts_order_idx" ON "project_contexts"("order");

-- CreateIndex
CREATE UNIQUE INDEX "blog_links_url_key" ON "blog_links"("url");

-- CreateIndex
CREATE INDEX "blog_links_source_idx" ON "blog_links"("source");

-- CreateIndex
CREATE INDEX "blog_links_visible_idx" ON "blog_links"("visible");

-- CreateIndex
CREATE INDEX "blog_links_order_idx" ON "blog_links"("order");

-- CreateIndex
CREATE INDEX "blog_links_publishedAt_idx" ON "blog_links"("publishedAt");

-- CreateIndex
CREATE INDEX "guestbook_entries_userId_idx" ON "guestbook_entries"("userId");

-- CreateIndex
CREATE INDEX "guestbook_entries_visible_idx" ON "guestbook_entries"("visible");

-- CreateIndex
CREATE INDEX "guestbook_entries_createdAt_idx" ON "guestbook_entries"("createdAt");

-- CreateIndex
CREATE INDEX "anonymous_messages_read_idx" ON "anonymous_messages"("read");

-- CreateIndex
CREATE INDEX "anonymous_messages_createdAt_idx" ON "anonymous_messages"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "chat_logs_sessionId_key" ON "chat_logs"("sessionId");

-- CreateIndex
CREATE INDEX "chat_logs_sessionId_idx" ON "chat_logs"("sessionId");

-- CreateIndex
CREATE INDEX "chat_logs_createdAt_idx" ON "chat_logs"("createdAt");

-- CreateIndex
CREATE INDEX "profile_links_visible_idx" ON "profile_links"("visible");

-- CreateIndex
CREATE INDEX "profile_links_order_idx" ON "profile_links"("order");

-- CreateIndex
CREATE UNIQUE INDEX "knowledge_docs_filename_key" ON "knowledge_docs"("filename");

-- CreateIndex
CREATE INDEX "knowledge_docs_filename_idx" ON "knowledge_docs"("filename");

-- CreateIndex
CREATE INDEX "knowledge_docs_indexed_idx" ON "knowledge_docs"("indexed");

-- AddForeignKey
ALTER TABLE "project_contexts" ADD CONSTRAINT "project_contexts_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guestbook_entries" ADD CONSTRAINT "guestbook_entries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
