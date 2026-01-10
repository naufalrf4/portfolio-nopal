# Overview

## Summary

The NaufalRF Portfolio Ecosystem is a multi-application web platform designed to demonstrate end-to-end solution engineering through real, production-grade systems. Rather than presenting a static list of projects, the ecosystem enables deep exploration of each project through structured narratives, interactive engagement channels, and a conversational AI interface.

The system consists of five interconnected applications unified under a single architectural vision:

| Application | Domain | Role |
|-------------|--------|------|
| Public Portfolio | `naufalrf.tech` | Primary visitor-facing interface for projects, blogs, guestbook, and chatbot |
| Admin Dashboard & API | `admin.naufalrf.tech` | Centralized control center and sole database authority |
| Links Hub | `links.naufalrf.tech` | Lightweight profile links page |
| Anonymous Feedback | `ngl.naufalrf.tech` | Anonymous message submission channel |
| RAG Chatbot Service | `rag.naufalrf.tech` | Conversational exploration and Q&A |

All applications operate under a strict API-first architecture where the Admin application is the single source of truth for all data operations. No other application has direct database access.

---

## Core Capabilities

### 1. Structured Project Narratives

Each project is represented not as a single description, but as a collection of structured context sections that tell a complete story:

**Required Sections:**
- **Context**: The situation, constraints, and environment in which the project existed.
- **Role**: The owner's specific responsibilities and contributions.
- **Decisions**: Key technical and strategic choices made during the project.
- **Trade-offs**: What was sacrificed and what was prioritized, with rationale.
- **Result**: Outcomes, metrics, and impact achieved.

**Optional Sections:**
- **Architecture**: System design diagrams and explanations.
- **Operations**: Deployment, monitoring, and maintenance aspects.
- **Metrics**: Quantified performance, usage, or business impact data.

The frontend renders these sections dynamically based on type, allowing new projects to be added without code changes.

### 2. Centralized Content Authority

The Admin application serves as the exclusive gateway to the database:

- **Data Ownership**: All content (projects, blogs, guestbook, messages, chat logs) lives in a single PostgreSQL database.
- **API Distribution**: Other applications consume data through typed API endpoints, ensuring consistency and enabling independent deployment.
- **Role-Based Access**: Admin endpoints require allowlisted Google OAuth; public endpoints are read-only or rate-limited for writes.

### 3. Interactive Engagement Channels

Multiple touchpoints for visitor interaction:

- **Guestbook**: Google-authenticated entries with reactions, moderated via Admin.
- **Anonymous Feedback**: Rate-limited public submissions visible only to Admin.
- **RAG Chatbot**: Conversational interface that retrieves portfolio content and suggests deep links.

### 4. AI-Powered Exploration

The RAG Chatbot Service provides:

- **Retrieval-Augmented Generation**: Answers grounded in indexed portfolio content.
- **Session Memory**: Context-aware conversations with pruning for long sessions.
- **Deep-Link Suggestions**: Directs visitors to relevant project pages.
- **Provider Routing**: Primary and fallback LLM configuration for resilience.

### 5. Unified Monorepo Architecture

The entire ecosystem lives in a single Turborepo with shared packages:

| Package | Purpose |
|---------|---------|
| `packages/ui` | Shared React components (shadcn/ui + custom) |
| `packages/types` | TypeScript DTOs and API contracts |
| `packages/sdk` | Typed API clients for cross-app communication |
| `packages/config` | Shared ESLint, TypeScript, and Tailwind configs |
| `packages/auth` | Shared NextAuth configuration |

### 6. Production-Grade Infrastructure

Self-hosted Docker deployment with:

- **Traefik**: Reverse proxy with TLS termination via Let's Encrypt.
- **Qdrant**: Vector store for RAG embeddings (internal-only exposure).
- **Neon PostgreSQL**: Managed database with connection pooling.
- **Environment Isolation**: Secrets managed via environment variables, never exposed to frontend bundles.

---

## Out of Scope

The following are explicitly excluded from the system design:

### Product Scope Exclusions
| Exclusion | Rationale |
|-----------|-----------|
| Public SaaS / Multi-tenancy | This is a personal portfolio, not a platform for other users |
| Generic CMS | Content models are domain-specific to portfolio projects |
| Social Networking | No user-to-user interactions, followers, or feeds |
| Autonomous Content Generation | Chatbot retrieves existing content; does not create new projects |

### Technical Scope Exclusions
| Exclusion | Rationale |
|-----------|-----------|
| Client-Side Database Access | All DB operations are server-side through Admin app |
| Multiple Database Engines | Single PostgreSQL instance; no polyglot persistence |
| Custom Auth Flows | Google OAuth only; no username/password |
| Real-Time Features | No WebSockets; polling or refresh-based updates |
| Multi-Region Deployment | Single-region self-hosted for simplicity |

### Operational Scope Exclusions
| Exclusion | Rationale |
|-----------|-----------|
| Formal SLA | Best-effort 99.5% target; no contractual commitment |
| 24/7 On-Call | Automated recovery; manual intervention as needed |
| Compliance Certifications | Best-practice security; no SOC2/HIPAA requirements |

---

## System Context Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              INTERNET                                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TRAEFIK (TLS + Routing)                              │
│  naufalrf.tech │ admin.naufalrf.tech │ links.naufalrf.tech │ ngl.naufalrf.tech │ rag.naufalrf.tech │
└─────────────────────────────────────────────────────────────────────────────┘
         │                    │                │              │              │
         ▼                    ▼                ▼              ▼              ▼
┌─────────────┐      ┌─────────────┐    ┌──────────┐   ┌──────────┐   ┌──────────────┐
│   PUBLIC    │      │    ADMIN    │    │  LINKS   │   │   NGL    │   │ RAG SERVICE  │
│  PORTFOLIO  │      │  DASHBOARD  │    │   HUB    │   │   APP    │   │              │
│             │      │   & API     │    │          │   │          │   │              │
│ (Next.js)   │      │ (Next.js)   │    │(Next.js) │   │(Next.js) │   │   (Node.js)  │
└─────────────┘      └─────────────┘    └──────────┘   └──────────┘   └──────────────┘
         │                    │                │              │              │
         │                    │                │              │              │
         └────────────────────┼────────────────┴──────────────┘              │
                              │                                              │
                    ┌─────────▼─────────┐                          ┌─────────▼─────────┐
                    │   PostgreSQL      │                          │      Qdrant       │
                    │   (Neon)          │                          │  (Vector Store)   │
                    │                   │                          │                   │
                    │ [ADMIN ONLY]      │                          │ [RAG ONLY]        │
                    └───────────────────┘                          └───────────────────┘
```

**Data Flow Rules:**
1. Only Admin app has `DATABASE_URL` credentials.
2. Public, Links, NGL apps call Admin API for all data.
3. RAG Service calls Admin API for content and logs; uses Qdrant for vectors.
4. All external traffic terminates TLS at Traefik.
