# NaufalRF Portfolio Ecosystem

A production-grade, multi-application portfolio platform built as a pnpm native workspaces monorepo, demonstrating end-to-end solution engineering through real, interconnected systems.

## Overview

The NaufalRF Portfolio Ecosystem contains five interconnected applications that work together to create a comprehensive portfolio experience. Rather than presenting a static list of projects, this ecosystem enables deep exploration through structured narratives, interactive engagement channels, and a conversational AI interface.

### Applications

| Application            | Domain                | Framework       | Purpose                                                  |
| ---------------------- | --------------------- | --------------- | -------------------------------------------------------- |
| **Public Portfolio**   | `naufalrf.tech`       | Astro SSR       | Main portfolio showcasing projects, blogs, and guestbook |
| **Admin Dashboard**    | `admin.naufalrf.tech` | Next.js 14+     | Content management system and API gateway                |
| **Links Hub**          | `links.naufalrf.tech` | Astro SSR       | Linktree-style profile links page                        |
| **Anonymous Feedback** | `ngl.naufalrf.tech`   | SvelteKit       | Anonymous message submission channel                     |
| **RAG Chatbot**        | `rag.naufalrf.tech`   | Python FastAPI  | AI-powered conversational exploration                    |

### Key Features

- **Structured Project Narratives**: Projects presented through context sections (Context, Role, Decisions, Trade-offs, Result, Architecture)
- **Centralized Content Authority**: Single PostgreSQL database accessed exclusively through Admin API
- **Interactive Engagement**: Guestbook with Google OAuth, anonymous feedback, and AI chatbot
- **AI-Powered Exploration**: RAG chatbot with retrieval-augmented generation and session memory
- **Production-Grade Infrastructure**: Docker deployment with Traefik reverse proxy and TLS

## Architecture

### System Design

```
┌─────────────────────────────────────────────────────────────┐
│                     PUBLIC INTERNET                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  TRAEFIK (TLS + Routing)                     │
└─────────────────────────────────────────────────────────────┘
         │              │              │              │
         ▼              ▼              ▼              ▼
    ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
    │ Public  │   │  Admin  │   │   NGL   │   │  Links  │
    │  :3000  │   │  :3001  │   │  :3003  │   │  :3002  │
    │  Astro  │   │ Next.js │   │Svelte   │   │  Astro  │
    └─────────┘   └─────────┘   └─────────┘   └─────────┘
         │              │              │              │
         └──────────────┼──────────────┴──────────────┘
                        │ (Admin API)
                        ▼
                 ┌─────────────┐
                 │  PostgreSQL │
                 │   (Neon)    │
                 │  + pgvector │
                 └─────────────┘
```

### Data Flow Rules

1. Only Admin app has direct database access (Drizzle ORM)
2. Public, Links, and NGL apps consume data through Admin API
3. RAG Service calls Admin API for content and uses pgvector (PostgreSQL extension) for vector similarity search
4. All external traffic terminates TLS at Traefik

### Technology Stack

| Layer | Technology |
|-------|------------|
| Public frontend | Astro SSR (apps/public, apps/links) |
| Admin frontend | Next.js 14+ App Router |
| Anonymous feedback | SvelteKit (apps/ngl) |
| RAG service | Python FastAPI + uvicorn |
| Database | PostgreSQL (Neon) + pgvector extension |
| ORM | Drizzle ORM (postgres.js driver) |
| Auth (admin) | NextAuth v5 + Google OAuth |
| Auth (public) | Lucia Auth v3 + Google OAuth |
| Monorepo | pnpm native workspaces |
| Design system | Neumorphism (light mode) |
| Fonts | Plus Jakarta Sans + DM Sans + JetBrains Mono |

## Quick Start

### Prerequisites

- Node.js >= 22.0.0
- pnpm >= 9.0.0
- Python >= 3.12 (for RAG service)
- Docker and Docker Compose (for local development)
- PostgreSQL database (Neon recommended)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/naufalrf4/portfolio-nopal.git
cd portfolio-nopal
```

2. **Install JS dependencies**

```bash
pnpm install
```

3. **Install Python dependencies (RAG service)**

```bash
cd apps/rag-service
uv sync
cd ../..
```

4. **Set up environment variables**

```bash
# Admin app
cp apps/admin/.env.example apps/admin/.env.local

# Public app
cp apps/public/.env.example apps/public/.env

# Links app
cp apps/links/.env.example apps/links/.env

# NGL app
cp apps/ngl/.env.example apps/ngl/.env

# RAG service
cp apps/rag-service/.env.example apps/rag-service/.env
```

5. **Set up the database**

```bash
# Generate and run Drizzle migrations
pnpm --filter admin db:generate
pnpm --filter admin db:migrate

# Seed initial data (optional)
pnpm --filter admin db:seed
```

6. **Start development servers**

```bash
# Start all JS apps in parallel
pnpm dev

# Or start specific apps
pnpm dev:admin    # port 3001
pnpm dev:public   # port 3000
pnpm dev:links    # port 3002
pnpm dev:ngl      # port 3003

# Start RAG service separately (Python)
cd apps/rag-service && uv run fastapi dev src/main.py
```

7. **Access the applications**

- Public Portfolio: http://localhost:3000
- Admin Dashboard: http://localhost:3001
- Links Hub: http://localhost:3002
- NGL App: http://localhost:3003
- RAG Service: http://localhost:3004

## Development

### Project Structure

```
naufalrf-portfolio/
├── apps/
│   ├── admin/                     # Next.js 14+ — CMS + API gateway
│   │   └── db/                    # Drizzle ORM schema + migrations
│   ├── public/                    # Astro SSR — public portfolio
│   ├── links/                     # Astro SSR — links hub
│   ├── ngl/                       # SvelteKit — anonymous feedback
│   └── rag-service/               # Python FastAPI — RAG chatbot
├── packages/
│   ├── ui/                        # Shared React components (neumorphism)
│   ├── types/                     # TypeScript DTOs, enums, API contracts
│   ├── sdk/                       # Typed API clients
│   ├── config/                    # Shared ESLint, TypeScript, Tailwind configs
│   └── auth/                      # Shared NextAuth v5 config
├── .context/                      # AI agent context files (source of truth)
├── docs/                          # Documentation
└── docker-compose.yml             # Dev environment
```

### Available Commands

```bash
# Development
pnpm dev              # Start all JS apps in parallel
pnpm build            # Build all JS apps
pnpm typecheck        # TypeScript type checking
pnpm lint             # Lint all apps and packages
pnpm test             # Run all tests
pnpm clean            # Remove build artifacts

# App-specific
pnpm --filter <app-name> dev          # Run specific app
pnpm --filter <app-name> build        # Build specific app
pnpm --filter <app-name> lint         # Lint specific app
pnpm --filter <app-name> test         # Test specific app

# Database commands (Admin app — Drizzle ORM)
pnpm --filter admin db:generate  # Generate migration files
pnpm --filter admin db:migrate   # Apply migrations
pnpm --filter admin db:push      # Push schema directly (dev only)
pnpm --filter admin db:studio    # Open Drizzle Studio
pnpm --filter admin db:seed      # Seed database

# RAG service (Python — uv)
cd apps/rag-service
uv sync                          # Install Python deps
uv run fastapi dev src/main.py   # Start dev server
uv run pytest                    # Run Python tests
```

### Feature-Based Architecture

Apps follow a feature-first structure:

```
features/
├── shared/
│   ├── services/
│   ├── hooks/
│   ├── components/
│   └── types/
└── <feature-name>/
    ├── services/        # Business logic, IO, mutations
    ├── hooks/           # Orchestration & state composition
    ├── components/      # Presentational UI only
    ├── types/           # Feature-scoped contracts
    └── schemas/         # Zod validation (if needed)
```

Dependency direction: `types → services → hooks → components`

### Coding Conventions

- **Naming**: `camelCase` variables/functions, `PascalCase` components/types, `SCREAMING_SNAKE_CASE` constants
- **TypeScript**: strict mode, no `any`, no `@ts-ignore`
- **Imports**: React/framework → third-party → absolute → relative → types → CSS
- **Comments**: none — write self-documenting code
- **Business Logic**: in services, not components
- **One service per file** per entity/domain

See [AGENTS.md](./AGENTS.md) for complete coding guidelines.

## Deployment

Supports multiple deployment targets:

- **VPS (Docker Compose)**: Self-hosted with Traefik
- **Heroku**: Platform-as-a-Service
- **Google Cloud App Engine**: Managed app platform
- **AWS ECS (Fargate)**: Containerized deployment

For detailed instructions, see [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md).

### Quick Deploy (VPS with Docker Compose)

```bash
# 1. Configure environment
cp .env.production.example .env.production
# Edit .env.production with your values

# 2. Build and start services
docker compose --env-file .env.production up -d

# 3. Run database migrations
docker compose exec admin pnpm --filter admin db:migrate
```

### Required Environment Variables

**Admin app** (`apps/admin/.env.local`):
```bash
DATABASE_URL=postgresql://user:password@host:5432/database
NEXTAUTH_SECRET=<openssl rand -base64 32>
NEXTAUTH_URL=https://admin.yourdomain.com
ADMIN_EMAILS=admin@example.com
INTERNAL_SERVICE_TOKEN=<openssl rand -hex 32>
```

**Public app** (`apps/public/.env`):
```bash
NEXT_PUBLIC_ADMIN_API_URL=https://admin.yourdomain.com/api
PUBLIC_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
PUBLIC_GOOGLE_CLIENT_SECRET=your_client_secret
LUCIA_SECRET=<openssl rand -base64 32>
```

See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for the complete environment variable reference.

## API Documentation

### Admin API Namespaces

| Namespace | Auth | Purpose |
|-----------|------|---------|
| `/api/public` | None | Public read endpoints |
| `/api/public-write` | None, rate-limited | Public write (guestbook, NGL, contact) |
| `/api/user` | Google OAuth (user role) | Authenticated user actions |
| `/api/admin` | Google OAuth (admin role) | Admin CRUD operations |
| `/api/internal` | `X-Service-Token` header | Service-to-service calls |

### Public Endpoints (sample)

```bash
GET /api/public/about
GET /api/public/projects
GET /api/public/projects/:slug
GET /api/public/blogs
GET /api/public/guestbook
GET /api/public/profile-links

POST /api/public-write/guestbook    # requires Google OAuth
POST /api/public-write/messages     # rate-limited by IP
POST /api/public-write/contact      # rate-limited by IP
```

See [docs/API.md](./docs/API.md) for the complete API reference.

## Contributing

### Git Workflow

```bash
# 1. Start from main
git checkout main && git pull origin main
git checkout -b feature/XX-short-description

# 2. Commit with conventional format
git commit -m "feat(scope): description"
# Types:  feat, fix, docs, style, refactor, perf, test, build, ci, chore
# Scopes: public, admin, links, ngl, rag, ui, types, sdk, auth, infra, deps

# 3. Push and open PR
git push -u origin feature/XX-description
```

**CI checks required before merge**: `pnpm lint` + `pnpm typecheck` + `pnpm test` + `pnpm build`

Merge strategy: Squash and merge → delete branch.

## Testing

```bash
pnpm test                              # All tests
pnpm test:unit                         # Unit and component tests
pnpm test:e2e                          # End-to-end tests
pnpm test:coverage                     # With coverage report
pnpm vitest run path/to/file.test.ts   # Single file

# Python (RAG service)
cd apps/rag-service && uv run pytest
```

## Troubleshooting

**Build failures**:
```bash
pnpm clean
rm -rf node_modules
pnpm install
```

**Database connection issues**:
```bash
psql "postgresql://user:password@host:5432/database?sslmode=require"
pnpm --filter admin db:studio  # Inspect via Drizzle Studio
```

For comprehensive troubleshooting, see [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md).

## Documentation

| Document | Purpose |
|----------|---------|
| [AGENTS.md](./AGENTS.md) | Canonical AI agent control contract + coding guidelines |
| [docs/SETUP.md](./docs/SETUP.md) | Development environment setup |
| [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md) | Git workflow and coding standards |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System design and data flows |
| [docs/DATABASE.md](./docs/DATABASE.md) | Database models and migrations |
| [docs/APPS.md](./docs/APPS.md) | Per-application documentation |
| [docs/API.md](./docs/API.md) | Complete API reference |
| [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) | Multi-platform deployment guide |
| [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) | Common issues and solutions |

## License

This project is proprietary and confidential. All rights reserved.

## Contact

For questions or inquiries, visit [naufalrf.tech](https://naufalrf.tech) or reach out through the contact form.
