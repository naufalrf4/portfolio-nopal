# Architecture

This document describes the system architecture, component relationships, and design decisions for the NaufalRF Portfolio Ecosystem.

## System Overview

The NaufalRF Portfolio Ecosystem is a multi-application platform built as a monorepo using pnpm native workspaces. It consists of five interconnected applications that work together to provide a comprehensive portfolio experience.

### Applications

| Application        | Domain                | Port | Purpose                                                  |
| ------------------ | --------------------- | ---- | -------------------------------------------------------- |
| Public Portfolio   | `naufalrf.tech`       | 3000 | Main portfolio showcasing projects, blogs, and guestbook |
| Admin Dashboard    | `admin.naufalrf.tech` | 3001 | Content management system and API gateway                |
| Links Hub          | `links.naufalrf.tech` | 3002 | Linktree-style profile links page                        |
| Anonymous Feedback | `ngl.naufalrf.tech`   | 3003 | Anonymous message submission channel                     |
| RAG Chatbot        | `rag.naufalrf.tech`   | 3004 | AI-powered conversational exploration                    |

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     PUBLIC INTERNET                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  TRAEFIK (TLS + Routing)                     │
│  naufalrf.tech │ admin.naufalrf.tech │ links.naufalrf.tech  │
│  ngl.naufalrf.tech │ rag.naufalrf.tech                      │
└─────────────────────────────────────────────────────────────┘
         │              │              │              │
         ▼              ▼              ▼              ▼
    ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
    │ Public  │   │  Admin  │   │  Links  │   │   NGL   │
    │  :3000  │   │  :3001  │   │  :3002  │   │  :3003  │
    └─────────┘   └─────────┘   └─────────┘   └─────────┘
         │              │              │              │
         └──────────────┼──────────────┴──────────────┘
                        │
                        ▼
                 ┌─────────────┐              ┌──────────────┐
                 │  PostgreSQL │              │ RAG Service  │
                 │   (Neon)    │              │    :3004     │
                 └─────────────┘              └──────────────┘
                                                     │
                                                     ▼
                                              ┌──────────────┐
                                              │    pgvector    │
                                              │ (Vector DB)  │
                                              └──────────────┘
```

## Core Principles

### 1. API-First Architecture

All applications communicate through well-defined APIs. The Admin application serves as the single source of truth and API gateway for all data operations.

**Key Rules:**

- Only the Admin app has direct database access
- Public, Links, and NGL apps consume data through Admin API
- RAG Service calls Admin API for content and uses pgvector for vectors
- All cross-app communication uses typed contracts from `packages/types`

### 2. Centralized Data Authority

The Admin application is the exclusive gateway to the PostgreSQL database. This ensures:

- Consistent data access patterns
- Centralized authentication and authorization
- Single point for rate limiting and validation
- Independent deployment of consumer applications

### 3. Feature-Based Modular Architecture

Each Next.js application follows a feature-based architecture pattern where features are self-contained modules:

```
src/features/[feature-name]/
├── components/        # Feature-specific UI components
├── hooks/            # Feature-specific custom hooks
├── services/         # API calls and business logic
├── types/            # Feature-specific TypeScript types
├── utils/            # Feature-specific utility functions
└── index.ts          # Feature public API
```

### 4. Separation of Concerns

- **Components**: Render UI only, no business logic
- **Hooks**: Manage state, effects, and event handlers
- **Services**: Handle API calls, data transformation, and business rules
- **Utils**: Pure functions with no side effects

## Component Details

### Public Portfolio (`apps/public`)

**Technology Stack:**

- Next.js 14+ (App Router)
- React Server Components
- TypeScript
- Tailwind CSS
- NextAuth.js (Google OAuth)

**Responsibilities:**

- Display projects with structured context sections
- Show curated external blog links
- Guestbook with authenticated entries
- Contact form
- AI chatbot interface

**Data Flow:**

```
User Request → Server Component → Admin API → PostgreSQL
                                ↓
                         Render with Data
```

**Key Features:**

- Server-side rendering for SEO
- Incremental Static Regeneration (ISR) for performance
- Google OAuth for guestbook authentication
- Rate-limited public write endpoints

### Admin Dashboard (`apps/admin`)

**Technology Stack:**

- Next.js 14+ (App Router)
- Drizzle ORM
- PostgreSQL (Neon)
- NextAuth.js (Google OAuth with allowlist)
- Cloudflare R2 (file storage)

**Responsibilities:**

- Content management dashboard
- API gateway for all applications
- Authentication and authorization
- CRUD operations for all entities
- File upload and management
- Analytics and monitoring

**API Namespaces:**

| Namespace    | Prefix                 | Auth             | Purpose                       |
| ------------ | ---------------------- | ---------------- | ----------------------------- |
| Public       | `/api/v1/public`       | None             | Public read endpoints         |
| Public Write | `/api/v1/public-write` | Optional         | Rate-limited write endpoints  |
| User         | `/api/v1/user`         | Required (user)  | User-authenticated operations |
| Admin        | `/api/v1/admin`        | Required (admin) | Admin-only operations         |
| Internal     | `/api/v1/internal`     | Service token    | Service-to-service calls      |

**Database Models:**

- User, Account, Session, VerificationToken
- Project, ProjectContext, ProjectImage
- BlogLink, GuestbookEntry
- AnonymousMessage, ChatLog
- ProfileLink, KnowledgeDoc
- ContactForm, ContactSettings
- BookingSlot, Booking, BookingSettings, BookingAvailability
- AboutMe, AnalyticsEvent

### Links Hub (`apps/links`)

**Technology Stack:**

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS

**Responsibilities:**

- Display curated profile links
- Fetch data from Admin public API
- Lightweight, fast-loading page

**Constraints:**

- No authentication required
- No write operations
- No direct database access

### Anonymous Feedback App (`apps/ngl`)

**Technology Stack:**

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS

**Responsibilities:**

- Anonymous message submission form
- Rate limiting enforcement
- Success confirmation UI

**Constraints:**

- No public message listing (admin-only inbox)
- No user authentication
- Writes only via Admin API with rate limiting

### RAG Chatbot Service (`apps/rag-service`)

**Technology Stack:**

- Node.js
- FastAPI
- pgvector (PostgreSQL extension)
- OpenAI/Gemini/Groq/DeepSeek APIs

**Responsibilities:**

- Public chat endpoint
- Session-aware memory with context pruning
- Retrieval-augmented generation
- Deep-link suggestion to portfolio pages
- Knowledge ingestion pipeline
- Chat log forwarding to Admin API

**Architecture:**

```
┌─────────────────────────────────────────────────────────────┐
│                     RAG SERVICE                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Chat API   │───▶│  Retriever   │───▶│   LLM Router │  │
│  │   Endpoint   │    │   Module     │    │              │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                   │                    │          │
│         │                   ▼                    ▼          │
│         │            ┌──────────────┐    ┌──────────────┐  │
│         │            │    pgvector    │    │  LLM APIs    │  │
│         │            │ (Embeddings) │    │  (Primary/   │  │
│         │            └──────────────┘    │   Fallback)  │  │
│         │                                └──────────────┘  │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────┐    ┌──────────────┐                      │
│  │   Session    │    │   Ingestion  │◀── Admin Trigger     │
│  │   Memory     │    │   Pipeline   │                      │
│  └──────────────┘    └──────────────┘                      │
│                             │                               │
│                             ▼                               │
│                      ┌──────────────┐                      │
│                      │  Admin API   │                      │
│                      │  (Log Sink)  │                      │
│                      └──────────────┘                      │
└─────────────────────────────────────────────────────────────┘
```

## Shared Packages

### `packages/ui`

Shared React components built on shadcn/ui with neuromorphic design modifications.

**Components:**

- Button, Card, Input, Badge, Skeleton
- Dialog, DropdownMenu, Toast
- DataTable, Form components

### `packages/types`

TypeScript DTOs, API contracts, and enums shared across all applications.

**Key Types:**

- API response wrappers
- Entity DTOs (Project, BlogLink, etc.)
- Enum definitions
- Pagination types

### `packages/sdk`

Typed API clients for cross-app communication.

**Features:**

- Type-safe API calls
- Automatic error handling
- Request/response transformation
- Rate limiting awareness

### `packages/config`

Shared ESLint, TypeScript, and Tailwind configurations.

### `packages/auth`

Shared NextAuth.js configuration and utilities.

## Data Flow Patterns

### 1. Public Content Read Flow

```
Visitor → Public Portfolio → Admin API → PostgreSQL
                                │
                                ▼
                          Response (JSON)
                                │
                                ▼
                       SSR Rendered Page
```

### 2. Guestbook Write Flow

```
Visitor → Google OAuth → Public Portfolio
                              │
                              ▼
                 POST /api/v1/public-write/guestbook
                              │
                              ▼
                        Admin API
                              │
                              ├──▶ Rate Limit Check
                              ├──▶ Validation (Zod)
                              └──▶ PostgreSQL Insert
```

### 3. Anonymous Message Flow

```
Visitor → NGL App → Admin API (/api/v1/public-write/messages)
                          │
                          ├──▶ Rate Limit Check (IP-based)
                          ├──▶ Validation (Zod)
                          ├──▶ IP Hash (privacy)
                          └──▶ PostgreSQL Insert
```

### 4. Chatbot Interaction Flow

```
Visitor → Public Portfolio → RAG Service
                                  │
                                  ├──▶ Session Memory Load
                                  ├──▶ pgvector Similarity Search
                                  ├──▶ LLM Generation (Primary)
                                  │         │
                                  │         ├──▶ Success → Response
                                  │         └──▶ Failure → Fallback LLM
                                  │
                                  └──▶ Log to Admin API (/api/v1/internal/chat-logs)
```

### 5. RAG Ingestion Flow

```
Admin → Admin Dashboard → Upload Knowledge Doc
                                  │
                                  ▼
                          Trigger Ingestion
                                  │
                                  ▼
                RAG Service (/api/internal/ingest)
                                  │
                                  ├──▶ Fetch Content from Admin API
                                  ├──▶ Chunk Documents
                                  ├──▶ Generate Embeddings (OpenAI)
                                  └──▶ Index to pgvector
```

## Security Boundaries

### Database Access

- Only `apps/admin` has `DATABASE_URL` credentials
- All other applications must use Admin API
- No direct database connections from public-facing apps

### Authentication & Authorization

| Boundary      | Enforcement                               |
| ------------- | ----------------------------------------- |
| Admin Routes  | Google OAuth + allowlist (`ADMIN_EMAILS`) |
| User Routes   | Google OAuth (any authenticated user)     |
| Public Writes | Rate limiting (IP-based, sliding window)  |
| Internal APIs | Service token header validation           |

### Network Boundaries

```
┌─────────────────────────────────────────────────────────────┐
│                     PUBLIC INTERNET                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     TRAEFIK (DMZ)                            │
│                   TLS Termination                            │
└─────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  PUBLIC APPS    │  │   ADMIN APP     │  │  RAG SERVICE    │
│  (public,links, │  │                 │  │                 │
│   ngl)          │  │                 │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘
                              │                    │
                              │                    │
                              ▼                    ▼
                     ┌─────────────────┐  ┌─────────────────┐
                     │   PostgreSQL    │  │     pgvector      │
                     │   (Neon)        │  │   (Internal)    │
                     │                 │  │                 │
                     │ [ADMIN ONLY]    │  │ [RAG ONLY]      │
                     └─────────────────┘  └─────────────────┘
```

### Secrets Management

- Environment variables only
- Never exposed to frontend bundles
- Different secrets per environment
- Service tokens for internal communication

## Deployment Architecture

### Docker Compose (Development & VPS)

```yaml
services:
  traefik:
    - TLS termination
    - Host-based routing
    - Health checks

  admin:
    - Next.js app
    - Direct database access
    - API gateway

  public:
    - Next.js app
    - Calls admin API

  links:
    - Next.js app
    - Calls admin API

  ngl:
    - Next.js app
    - Calls admin API

  rag-service:
    - Node.js app
    - Calls admin API
    - Uses pgvector

  pgvector:
    - Vector database
    - Internal only
```

### Routing Table

| Host                  | Service          | Port | TLS |
| --------------------- | ---------------- | ---- | --- |
| `naufalrf.tech`       | apps/public      | 3000 | Yes |
| `admin.naufalrf.tech` | apps/admin       | 3001 | Yes |
| `links.naufalrf.tech` | apps/links       | 3002 | Yes |
| `ngl.naufalrf.tech`   | apps/ngl         | 3003 | Yes |
| `rag.naufalrf.tech`   | apps/rag-service | 3004 | Yes |

## Performance Considerations

### Caching Strategy

- **Public API**: 60s TTL with stale-while-revalidate
- **ISR**: Revalidate on-demand for content updates
- **CDN**: Static assets served from CDN
- **Database**: Connection pooling via Neon

### Rate Limiting

| Endpoint Type | Limit    | Window | By            |
| ------------- | -------- | ------ | ------------- |
| Public Read   | 100 req  | 60s    | IP            |
| Public Write  | 10 req   | 60s    | IP            |
| User          | 60 req   | 60s    | User ID       |
| Admin         | 120 req  | 60s    | User ID       |
| Internal      | 1000 req | 60s    | Service Token |

### Optimization Techniques

- Server-side rendering for SEO
- Incremental Static Regeneration for performance
- Image optimization with Next.js Image
- Code splitting and lazy loading
- Database query optimization with indexes

## Monitoring & Observability

### Logging

- Structured logging with Winston/Pino
- Log levels: error, warn, info, debug
- Request ID tracking across services
- Error tracking with Sentry (optional)

### Metrics

- API response times
- Database query performance
- Rate limit hits
- Error rates
- User engagement metrics

### Health Checks

Each service exposes a health check endpoint:

- `/api/health` - Basic health check
- `/api/health/ready` - Readiness check (DB connection, etc.)

## Scalability Considerations

### Horizontal Scaling

- Stateless applications (session in JWT)
- Load balancing via Traefik
- Database connection pooling
- CDN for static assets

### Vertical Scaling

- Optimize database queries
- Implement caching layers
- Use database read replicas
- Optimize bundle sizes

## Future Enhancements

- Multi-region deployment
- Real-time features with WebSockets
- Advanced analytics dashboard
- A/B testing framework
- Progressive Web App (PWA) support
