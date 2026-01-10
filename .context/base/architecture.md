# Architecture

## Components

### Application Layer

#### 1. Public Portfolio (`apps/public`)
| Attribute | Value |
|-----------|-------|
| Domain | `naufalrf.tech` |
| Type | Next.js App (App Router) |
| Rendering | SSR-first for content pages |
| Auth | Google OAuth (guestbook only) |
| Data Access | Read/write via Admin API only |

**Responsibilities:**
- Home page with positioning statement and featured projects
- Projects listing with category filters and depth indicators
- Project detail pages with dynamic context section rendering
- Curated external blog links display
- Guestbook with authenticated entries and reactions
- Floating chatbot UI (calls RAG Service directly)
- Contact entry point

**Key Integrations:**
```
Public Portfolio
    │
    ├──▶ Admin API (packages/sdk)
    │       ├── GET /api/public/projects
    │       ├── GET /api/public/blogs
    │       ├── GET /api/public/guestbook
    │       └── POST /api/public-write/guestbook
    │
    └──▶ RAG Service (direct HTTP)
            └── POST /chat
```

---

#### 2. Admin Dashboard & API (`apps/admin`)
| Attribute | Value |
|-----------|-------|
| Domain | `admin.naufalrf.tech` |
| Type | Next.js App (App Router) |
| Auth | Google OAuth with allowlist enforcement |
| Data Access | Direct PostgreSQL via Prisma |
| API Style | Next.js Route Handlers |

**Responsibilities:**
- Admin dashboard UI for content management
- API gateway serving all other applications
- Authentication and RBAC enforcement
- CRUD for: Projects, ProjectContext, BlogLinks, Guestbook, AnonymousMessages
- Content visibility and ordering controls
- Knowledge document upload and RAG ingestion triggers
- Chat log storage and viewing
- Moderation tools for public submissions

**API Namespaces:**
| Namespace | Auth Required | Purpose |
|-----------|---------------|---------|
| `/api/public` | None | Public read endpoints |
| `/api/public-write` | None (rate-limited) | Public write endpoints |
| `/api/user` | Google OAuth (user role) | User-authenticated operations |
| `/api/admin` | Google OAuth (admin role) | Admin-only operations |
| `/api/internal` | Service token | Internal service-to-service calls |

**Database Models:**
```
┌─────────────────┐     ┌─────────────────────┐
│     Project     │────▶│   ProjectContext    │
├─────────────────┤     ├─────────────────────┤
│ id              │     │ id                  │
│ title           │     │ projectId (FK)      │
│ slug            │     │ type (enum)         │
│ summary         │     │ content             │
│ category        │     │ order               │
│ featured        │     │ createdAt           │
│ visible         │     │ updatedAt           │
│ order           │     └─────────────────────┘
│ createdAt       │
│ updatedAt       │
└─────────────────┘

┌─────────────────┐     ┌─────────────────────┐
│    BlogLink     │     │   GuestbookEntry    │
├─────────────────┤     ├─────────────────────┤
│ id              │     │ id                  │
│ url             │     │ userId              │
│ title           │     │ userName            │
│ description     │     │ userImage           │
│ imageUrl        │     │ message             │
│ source          │     │ reactions           │
│ visible         │     │ visible             │
│ order           │     │ createdAt           │
│ createdAt       │     └─────────────────────┘
│ updatedAt       │
└─────────────────┘

┌─────────────────┐     ┌─────────────────────┐
│ AnonymousMessage│     │      ChatLog        │
├─────────────────┤     ├─────────────────────┤
│ id              │     │ id                  │
│ content         │     │ sessionId           │
│ ipHash          │     │ messages (JSON)     │
│ read            │     │ createdAt           │
│ createdAt       │     │ updatedAt           │
└─────────────────┘     └─────────────────────┘

┌─────────────────┐     ┌─────────────────────┐
│      User       │     │   KnowledgeDoc      │
├─────────────────┤     ├─────────────────────┤
│ id              │     │ id                  │
│ email           │     │ filename            │
│ name            │     │ content             │
│ image           │     │ indexed             │
│ role (enum)     │     │ createdAt           │
│ createdAt       │     │ updatedAt           │
│ updatedAt       │     └─────────────────────┘
└─────────────────┘

┌─────────────────┐
│   ProfileLink   │
├─────────────────┤
│ id              │
│ label           │
│ url             │
│ icon            │
│ visible         │
│ order           │
│ createdAt       │
│ updatedAt       │
└─────────────────┘
```

---

#### 3. Links Hub (`apps/links`)
| Attribute | Value |
|-----------|-------|
| Domain | `links.naufalrf.tech` |
| Type | Next.js App (App Router) |
| Auth | None required |
| Data Access | Read-only via Admin API |

**Responsibilities:**
- Display curated profile links (Linktree-like)
- Fetch data from Admin public API

**Constraints:**
- No authentication
- No write operations
- No database access

---

#### 4. Anonymous Feedback App (`apps/ngl`)
| Attribute | Value |
|-----------|-------|
| Domain | `ngl.naufalrf.tech` |
| Type | Next.js App (App Router) |
| Auth | None required |
| Data Access | Write-only via Admin API |

**Responsibilities:**
- Anonymous message submission form
- Rate limiting enforcement (client-side + server-side)
- Success confirmation UI
- Optional CAPTCHA integration

**Constraints:**
- No public message listing (admin-only inbox)
- No user authentication
- Writes only via Admin API with rate limiting

---

#### 5. RAG Chatbot Service (`apps/rag-service`)
| Attribute | Value |
|-----------|-------|
| Domain | `rag.naufalrf.tech` |
| Type | Node.js service (Express/Fastify) |
| Auth | Public endpoint (rate-limited) |
| Data Access | Via Admin API + Qdrant |

**Responsibilities:**
- Public chat endpoint
- Session-aware memory with context pruning
- Retrieval-augmented generation
- Deep-link suggestion to portfolio pages
- Knowledge ingestion pipeline (triggered by Admin)
- Raw chat log forwarding to Admin API

**Technical Architecture:**
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
│         │            │    Qdrant    │    │  LLM APIs    │  │
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

**LLM Provider Routing:**
| Provider | API | Model | Role |
|----------|-----|-------|------|
| Gemini | Gemini API | gemini-2.0-flash | Primary/Fallback |
| Groq | Groq API | llama-3.3-70b-versatile | Primary/Fallback |
| OpenAI | OpenAI API | gpt-4o-mini | Primary/Fallback |
| DeepSeek | DeepSeek API | deepseek-chat | Primary/Fallback |

Selection via `PRIMARY_LLM` and `FALLBACK_LLM` environment variables.

---

### Shared Packages Layer

| Package | Path | Purpose |
|---------|------|---------|
| UI Components | `packages/ui` | Shared React components (shadcn/ui + custom) |
| Types | `packages/types` | TypeScript DTOs, API contracts, enums |
| SDK | `packages/sdk` | Typed API clients for cross-app communication |
| Config | `packages/config` | Shared ESLint, TypeScript, Tailwind configs |
| Auth | `packages/auth` | Shared NextAuth configuration and utilities |

**Package Dependency Graph:**
```
apps/public ──────┬──▶ packages/ui
apps/admin  ──────┼──▶ packages/types
apps/links  ──────┼──▶ packages/sdk
apps/ngl    ──────┼──▶ packages/config
                  └──▶ packages/auth

apps/rag-service ─┬──▶ packages/types
                  └──▶ packages/sdk
```

---

### Infrastructure Layer

#### Traefik (Reverse Proxy)
| Function | Configuration |
|----------|---------------|
| TLS Termination | Let's Encrypt ACME |
| Host-Based Routing | Per-domain service routing |
| Health Checks | Container health endpoints |

**Routing Table:**
| Host | Service | Port |
|------|---------|------|
| `naufalrf.tech` | apps/public | 3000 |
| `admin.naufalrf.tech` | apps/admin | 3001 |
| `links.naufalrf.tech` | apps/links | 3002 |
| `ngl.naufalrf.tech` | apps/ngl | 3003 |
| `rag.naufalrf.tech` | apps/rag-service | 3004 |

#### Qdrant (Vector Store)
| Attribute | Value |
|-----------|-------|
| Exposure | Internal only (no public access) |
| Persistence | Docker volume |
| Port | 6333 (internal) |
| Purpose | RAG embeddings storage and similarity search |

#### PostgreSQL (Neon)
| Attribute | Value |
|-----------|-------|
| Provider | Neon (managed) |
| Access | Admin app only |
| Connection | Pooled via Neon proxy |
| ORM | Prisma |

---

## Data Flow

### 1. Public Content Read Flow
```
Visitor ──▶ Public Portfolio ──▶ Admin API ──▶ PostgreSQL
                                    │
                                    ▼
                              Response (JSON)
                                    │
                                    ▼
                         SSR Rendered Page
```

### 2. Guestbook Write Flow
```
Visitor ──▶ Google OAuth ──▶ Public Portfolio
                                    │
                                    ▼
                           POST /api/public-write/guestbook
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
Visitor ──▶ NGL App ──▶ Admin API (/api/public-write/messages)
                              │
                              ├──▶ Rate Limit Check (IP-based)
                              ├──▶ Validation (Zod)
                              ├──▶ IP Hash (privacy)
                              └──▶ PostgreSQL Insert
```

### 4. Chatbot Interaction Flow
```
Visitor ──▶ Public Portfolio ──▶ RAG Service
                                      │
                                      ├──▶ Session Memory Load
                                      ├──▶ Qdrant Similarity Search
                                      ├──▶ LLM Generation (Primary)
                                      │         │
                                      │         ├──▶ Success ──▶ Response
                                      │         └──▶ Failure ──▶ Fallback LLM
                                      │
                                      └──▶ Log to Admin API (/api/internal/chat-logs)
```

### 5. RAG Ingestion Flow
```
Admin ──▶ Admin Dashboard ──▶ Upload Knowledge Doc
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
                                      └──▶ Index to Qdrant
```

---

## Boundaries

### Security Boundaries

| Boundary | Enforcement |
|----------|-------------|
| Database Access | Only `apps/admin` has `DATABASE_URL` |
| Admin Routes | Google OAuth + allowlist (`naufalrf32@gmail.com`, `naufalrf4@gmail.com`) |
| Internal APIs | Service token header validation |
| Public Writes | Rate limiting (IP-based, sliding window) |
| Secrets | Environment variables only; never in frontend bundles |

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
                     │   PostgreSQL    │  │     Qdrant      │
                     │   (Neon)        │  │   (Internal)    │
                     │                 │  │                 │
                     │ [ADMIN ONLY]    │  │ [RAG ONLY]      │
                     └─────────────────┘  └─────────────────┘
```

### Application Boundaries

| Application | Can Read | Can Write | Direct DB |
|-------------|----------|-----------|-----------|
| Public Portfolio | Projects, Blogs, Guestbook | Guestbook (auth) | No |
| Admin Dashboard | All | All | Yes |
| Links Hub | ProfileLinks | None | No |
| NGL App | None | AnonymousMessages | No |
| RAG Service | Content (internal API) | ChatLogs (internal API), Qdrant | No |

### API Contract Boundaries

All cross-application communication uses typed contracts from `packages/types`:

```typescript
// packages/types/src/api.ts
export interface ProjectDTO {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: ProjectCategory;
  featured: boolean;
  contexts: ProjectContextDTO[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  pagination?: PaginationMeta;
}
```

SDK clients in `packages/sdk` enforce these contracts at compile time.
