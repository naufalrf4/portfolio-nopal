# Applications Documentation

This document provides detailed documentation for each application in the NaufalRF Portfolio Ecosystem.

## Table of Contents

- [Public Portfolio](#public-portfolio)
- [Admin Dashboard](#admin-dashboard)
- [Links Hub](#links-hub)
- [Anonymous Feedback (NGL)](#anonymous-feedback-ngl)
- [RAG Chatbot Service](#rag-chatbot-service)

---

## Public Portfolio

**Domain:** `naufalrf.tech`  
**Port:** 3000  
**Technology:** Next.js 14+ (App Router), React, TypeScript, Tailwind CSS

### Purpose

The main portfolio website showcasing projects, blog links, guestbook, and contact information. This is the primary public-facing application.

### Key Features

- **Home Page**: Hero section with positioning statement and featured projects
- **Projects**: Listing and detail pages with structured context sections
- **Blog Links**: Curated external blog posts and articles
- **Guestbook**: Authenticated entries with Google OAuth and reactions
- **Contact**: Contact form with Cloudflare Turnstile protection
- **AI Chatbot**: Floating chat widget powered by RAG service

### Directory Structure

```
apps/public/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Home page
│   ├── about/                    # About page
│   ├── projects/                 # Projects pages
│   │   ├── page.tsx              # Projects list
│   │   └── [slug]/               # Project detail
│   ├── blogs/                    # Blog links page
│   ├── contact/                  # Contact page
│   ├── guestbook/                # Guestbook page
│   ├── api/                      # API routes
│   ├── layout.tsx                # Root layout
│   ├── error.tsx                 # Error boundary
│   ├── not-found.tsx             # 404 page
│   └── globals.css               # Global styles
├── src/
│   ├── features/                 # Feature modules
│   │   ├── home/                 # Home page features
│   │   ├── projects/             # Projects features
│   │   ├── blogs/                # Blog features
│   │   ├── guestbook/            # Guestbook features
│   │   ├── contact/              # Contact features
│   │   ├── about/                # About features
│   │   └── chat/                 # Chat widget features
│   ├── components/               # Shared components
│   │   ├── ui/                   # Base UI components
│   │   ├── layout/               # Layout components
│   │   └── common/               # Common components
│   ├── lib/                      # Utilities and config
│   │   ├── api/                  # API client
│   │   ├── utils/                # Utility functions
│   │   └── constants/            # Constants
│   └── types/                    # TypeScript types
└── public/                       # Static assets
```

### Environment Variables

```bash
# Admin API
NEXT_PUBLIC_ADMIN_API_URL="https://admin.naufalrf.tech/api"

# NextAuth
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="https://naufalrf.tech"
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"

# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY="your-site-key"
TURNSTILE_SECRET_KEY="your-secret-key"

# RAG Service (optional)
NEXT_PUBLIC_RAG_API_URL="https://rag.naufalrf.tech"
```

### Key Pages

#### Home Page (`/`)

- Hero section with name and tagline
- Featured projects grid
- Latest blog posts
- Technical expertise section
- Call-to-action buttons

#### Projects (`/projects`)

- Grid layout of all visible projects
- Category filtering
- Featured projects highlighted
- Search functionality

#### Project Detail (`/projects/[slug]`)

- Project header with title and summary
- Tech stack badges
- Project images carousel
- Structured context sections (Context, Role, Decisions, etc.)
- Live demo and repository links

#### Guestbook (`/guestbook`)

- List of authenticated entries
- Google OAuth sign-in
- Message submission form
- Reaction buttons (Like, Heart, Fire, etc.)
- Animated card layout

#### Contact (`/contact`)

- Contact form with validation
- Cloudflare Turnstile protection
- Contact information display
- Social links
- FAQ accordion

### Development

```bash
# Start development server
pnpm --filter public dev

# Build for production
pnpm --filter public build

# Run tests
pnpm --filter public test

# Type check
pnpm --filter public typecheck
```

---

## Admin Dashboard

**Domain:** `admin.naufalrf.tech`  
**Port:** 3001  
**Technology:** Next.js 14+ (App Router), Prisma, PostgreSQL, NextAuth.js

### Purpose

Content management system and API gateway for all applications. Provides admin interface for managing projects, blog links, guestbook, messages, and more.

### Key Features

- **Dashboard**: Overview with stats and recent activity
- **Projects Management**: CRUD operations for projects and contexts
- **Blog Links**: Manage external blog post links
- **Guestbook**: Moderate guestbook entries
- **Messages**: View anonymous messages
- **Analytics**: View site analytics and metrics
- **File Upload**: Cloudflare R2 integration
- **API Gateway**: Serves all public and admin APIs

### Directory Structure

```
apps/admin/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth routes (public)
│   │   └── login/
│   ├── (dashboard)/              # Dashboard routes (protected)
│   │   ├── page.tsx              # Dashboard home
│   │   ├── projects/             # Projects management
│   │   ├── blogs/                # Blog links management
│   │   ├── guestbook/            # Guestbook moderation
│   │   ├── messages/             # Anonymous messages
│   │   ├── analytics/            # Analytics dashboard
│   │   └── settings/             # Settings
│   ├── api/                      # API routes
│   │   ├── auth/                 # NextAuth routes
│   │   └── v1/                   # Versioned API
│   │       ├── public/           # Public read endpoints
│   │       ├── public-write/     # Public write endpoints
│   │       ├── user/             # User endpoints
│   │       ├── admin/            # Admin endpoints
│   │       └── internal/         # Internal endpoints
│   ├── layout.tsx
│   └── globals.css
├── src/
│   ├── features/                 # Feature modules
│   │   ├── dashboard/
│   │   ├── projects/
│   │   ├── blogs/
│   │   ├── guestbook/
│   │   ├── messages/
│   │   ├── analytics/
│   │   └── settings/
│   ├── components/
│   ├── lib/
│   │   ├── db/                   # Prisma client
│   │   ├── services/             # Business logic services
│   │   ├── validations/          # Zod schemas
│   │   └── utils/
│   └── types/
├── prisma/
│   ├── schema.prisma             # Database schema
│   ├── migrations/               # Database migrations
│   └── seed.ts                   # Seed script
└── public/
```

### Environment Variables

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/db"
DIRECT_URL="postgresql://user:password@host:5432/db"

# NextAuth
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="https://admin.naufalrf.tech"
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"

# Admin Configuration
ADMIN_EMAILS="admin@example.com,another@example.com"
ADMIN_SERVICE_TOKEN="your-service-token"

# Cloudflare R2
R2_ENDPOINT="https://[account-id].r2.cloudflarestorage.com"
R2_ACCESS_KEY_ID="your-access-key"
R2_SECRET_ACCESS_KEY="your-secret-key"
R2_BUCKET_NAME="your-bucket"
R2_PUBLIC_URL="https://pub-[hash].r2.dev/your-bucket"
```

### API Namespaces

| Namespace    | Prefix                 | Auth             | Purpose                       |
| ------------ | ---------------------- | ---------------- | ----------------------------- |
| Public       | `/api/v1/public`       | None             | Public read endpoints         |
| Public Write | `/api/v1/public-write` | Optional         | Rate-limited write endpoints  |
| User         | `/api/v1/user`         | Required (user)  | User-authenticated operations |
| Admin        | `/api/v1/admin`        | Required (admin) | Admin-only operations         |
| Internal     | `/api/v1/internal`     | Service token    | Service-to-service calls      |

### Database Models

- User, Account, Session, VerificationToken
- Project, ProjectContext, ProjectImage
- BlogLink, GuestbookEntry
- AnonymousMessage, ChatLog
- ProfileLink, KnowledgeDoc
- ContactForm, ContactSettings
- BookingSlot, Booking, BookingSettings, BookingAvailability
- AboutMe, AnalyticsEvent

### Development

```bash
# Start development server
pnpm --filter admin dev

# Database commands
pnpm --filter admin db:migrate
pnpm --filter admin db:push
pnpm --filter admin db:studio
pnpm --filter admin db:seed

# Build for production
pnpm --filter admin build
```

---

## Links Hub

**Domain:** `links.naufalrf.tech`  
**Port:** 3002  
**Technology:** Next.js 14+ (App Router), TypeScript, Tailwind CSS

### Purpose

Linktree-style profile links page displaying curated social and professional links.

### Key Features

- **Profile Header**: Avatar, name, and bio
- **Link Buttons**: Styled buttons for each link
- **Social Icons**: Social media icons
- **Responsive Design**: Mobile-first design
- **Fast Loading**: Minimal dependencies

### Directory Structure

```
apps/links/
├── app/
│   ├── page.tsx                  # Main links page
│   ├── layout.tsx
│   └── globals.css
├── src/
│   ├── components/
│   │   ├── ProfileHeader.tsx
│   │   ├── LinkButtons.tsx
│   │   ├── SocialIcons.tsx
│   │   ├── LoadingSkeleton.tsx
│   │   └── ErrorState.tsx
│   └── lib/
│       └── api/
└── public/
```

### Environment Variables

```bash
NEXT_PUBLIC_ADMIN_API_URL="https://admin.naufalrf.tech/api"
```

### Development

```bash
# Start development server
pnpm --filter links dev

# Build for production
pnpm --filter links build
```

---

## Anonymous Feedback (NGL)

**Domain:** `ngl.naufalrf.tech`  
**Port:** 3003  
**Technology:** Next.js 14+ (App Router), TypeScript, Tailwind CSS

### Purpose

Anonymous message submission channel allowing visitors to send private feedback.

### Key Features

- **Message Form**: Simple textarea for message input
- **Rate Limiting**: IP-based rate limiting (5 per hour)
- **Success Confirmation**: Confirmation message after submission
- **Privacy**: Messages are anonymous (IP hashed)
- **Admin Inbox**: Messages viewable only in admin dashboard

### Directory Structure

```
apps/ngl/
├── app/
│   ├── page.tsx                  # Main NGL page
│   ├── layout.tsx
│   └── globals.css
├── src/
│   ├── components/
│   │   ├── MessageForm.tsx
│   │   └── index.ts
│   └── lib/
│       └── api/
└── public/
```

### Environment Variables

```bash
NEXT_PUBLIC_ADMIN_API_URL="https://admin.naufalrf.tech/api"
```

### Development

```bash
# Start development server
pnpm --filter ngl dev

# Build for production
pnpm --filter ngl build
```

---

## RAG Chatbot Service

**Domain:** `rag.naufalrf.tech`  
**Port:** 3004  
**Technology:** Node.js, Fastify, Qdrant, OpenAI/Gemini/Groq/DeepSeek

### Purpose

AI-powered conversational interface for exploring portfolio content using retrieval-augmented generation.

### Key Features

- **Chat Endpoint**: Public chat API with session management
- **RAG Pipeline**: Retrieval-augmented generation with Qdrant
- **Session Memory**: Context-aware conversations with pruning
- **LLM Routing**: Primary and fallback LLM configuration
- **Deep Links**: Suggests relevant portfolio pages
- **Knowledge Ingestion**: Pipeline for indexing documents
- **Chat Logging**: Forwards logs to Admin API

### Directory Structure

```
apps/rag-service/
├── src/
│   ├── routes/
│   │   ├── chat.ts               # Chat endpoint
│   │   ├── ingest.ts             # Ingestion endpoint
│   │   └── health.ts             # Health check
│   ├── services/
│   │   ├── llm.service.ts        # LLM provider routing
│   │   ├── retriever.service.ts  # Qdrant retrieval
│   │   ├── session.service.ts    # Session management
│   │   └── ingestion.service.ts  # Document ingestion
│   ├── lib/
│   │   ├── qdrant.ts             # Qdrant client
│   │   ├── embeddings.ts         # Embedding generation
│   │   └── chunking.ts           # Document chunking
│   ├── types/
│   └── index.ts                  # Server entry point
├── package.json
└── tsconfig.json
```

### Environment Variables

```bash
# Admin API
ADMIN_API_URL="https://admin.naufalrf.tech/api"
ADMIN_SERVICE_TOKEN="your-service-token"

# LLM Configuration
PRIMARY_LLM="gemini"
FALLBACK_LLM="groq"

# API Keys (at least one required)
OPENAI_API_KEY="sk-..."
GEMINI_API_KEY="..."
GROQ_API_KEY="gsk_..."
DEEPSEEK_API_KEY="..."

# Qdrant
QDRANT_URL="http://localhost:6333"
QDRANT_API_KEY=""  # Optional

# Server
PORT="3004"
NODE_ENV="development"
```

### LLM Providers

| Provider | Model                   | Use Case             |
| -------- | ----------------------- | -------------------- |
| Gemini   | gemini-2.0-flash        | Fast, cost-effective |
| Groq     | llama-3.3-70b-versatile | High quality, fast   |
| OpenAI   | gpt-4o-mini             | Reliable, balanced   |
| DeepSeek | deepseek-chat           | Alternative option   |

### API Endpoints

#### Chat

```http
POST /chat
Content-Type: application/json

{
  "message": "Tell me about your projects",
  "sessionId": "session_123"
}
```

#### Ingest (Internal)

```http
POST /api/internal/ingest
X-Service-Token: your-token
Content-Type: application/json

{
  "documentId": "doc_123"
}
```

### Development

```bash
# Start development server
pnpm --filter rag-service dev

# Build for production
pnpm --filter rag-service build

# Start production server
pnpm --filter rag-service start
```

### Qdrant Setup

```bash
# Start Qdrant with Docker
docker run -d \
  --name qdrant \
  -p 6333:6333 \
  -v $(pwd)/qdrant_storage:/qdrant/storage \
  qdrant/qdrant

# Or use Docker Compose
docker-compose up -d qdrant
```

---

## Shared Packages

### `packages/ui`

Shared React components built on shadcn/ui.

**Components:**

- Button, Card, Input, Badge, Skeleton
- Dialog, DropdownMenu, Toast
- DataTable, Form components

### `packages/types`

TypeScript DTOs and API contracts.

**Key Types:**

- API response wrappers
- Entity DTOs (Project, BlogLink, etc.)
- Enum definitions
- Pagination types

### `packages/sdk`

Typed API clients for cross-app communication.

**Usage:**

```typescript
import { createApiClient } from '@repo/sdk';

const client = createApiClient({
  baseUrl: 'https://admin.naufalrf.tech/api',
});

const projects = await client.projects.list();
```

### `packages/config`

Shared ESLint, TypeScript, and Tailwind configurations.

### `packages/auth`

Shared NextAuth.js configuration.

---

## Cross-App Communication

All applications communicate through the Admin API:

```
Public App ──┐
Links App ───┼──▶ Admin API ──▶ PostgreSQL
NGL App ─────┘

RAG Service ──▶ Admin API ──▶ PostgreSQL
             └──▶ Qdrant
```

**Rules:**

- Only Admin app has database access
- All other apps use Admin API
- Use typed SDK for API calls
- Handle errors gracefully
- Implement proper rate limiting

---

## Deployment

Each application can be deployed independently:

```bash
# Build all apps
pnpm build

# Build specific app
pnpm --filter admin build
pnpm --filter public build

# Deploy with Docker Compose
docker-compose up -d

# Or deploy individually to platforms
# - Vercel (Next.js apps)
# - Heroku (RAG service)
# - AWS/GCP (all apps)
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

---

## Monitoring

### Health Checks

Each application exposes health check endpoints:

```http
GET /api/health          # Basic health check
GET /api/health/ready    # Readiness check
```

### Logging

- Structured logging with Winston/Pino
- Request ID tracking
- Error tracking with Sentry (optional)

### Metrics

- API response times
- Database query performance
- Rate limit hits
- Error rates

---

## Support

For application-specific issues:

- Check application logs
- Review environment variables
- Test API endpoints
- Check database connections
- Verify authentication setup

For general support, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md).
