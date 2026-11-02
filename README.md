<div align="center">

# naufalrf-portfolio

**A multi-app portfolio platform with one content authority and focused public surfaces.**

Six standalone apps, four shared source packages, and cross-app E2E tooling—coordinated by a lightweight integration repository.

[![Runtime](https://img.shields.io/badge/runtime-per--app-f9f1e7?style=flat-square&logo=bun&logoColor=000000)](https://bun.sh)
[![Admin](https://img.shields.io/badge/admin-Next.js%2016-111111?style=flat-square&logo=nextdotjs)](https://nextjs.org)
[![Public](https://img.shields.io/badge/public-Astro%205-ff5d01?style=flat-square&logo=astro)](https://astro.build)
[![Messaging](https://img.shields.io/badge/messaging-SvelteKit%202-ff3e00?style=flat-square&logo=svelte)](https://svelte.dev)
[![Database](https://img.shields.io/badge/database-PostgreSQL%20%2B%20pgvector-4169e1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org)

[**Quick start**](#quick-start) · [**Architecture**](#architecture) · [**Apps**](#apps) · [**Commands**](#commands) · [**Operations**](#operations)

</div>

---

## Why

The platform keeps content, validation, and public API contracts in one place: `apps/admin`. Public-facing apps consume those APIs instead of opening their own database connections. The RAG service is the deliberate exception: it reads approved RAG data directly from PostgreSQL and coordinates with Admin through internal APIs.

- **One authority** — Admin owns portfolio content, public contracts, moderation, and operations.
- **Independent experiences** — portfolio, links, anonymous messages, live presence, and AI retrieval can evolve without sharing a frontend runtime.
- **Independent builds** — each app is a Git submodule with its own repository, lockfile, dependencies, and build.
- **Shared foundations** — TypeScript configuration, design tokens, HTTP helpers, and API contracts are copied into app repos; root copies support cross-app tooling.
- **Clear boundaries** — browser apps never access the database directly; realtime presence stays ephemeral; RAG has an explicitly limited data role.

## Architecture

```text
public-astro ─┐
links-astro ──┼──▶ admin APIs ───▶ PostgreSQL + pgvector
ngl-svelte ───┘         ▲                  ▲
                         │                  │
                 rag-service ───────────────┘

public-astro ──▶ Admin RAG proxy ──▶ rag-service

public-astro ─┐
links-astro ──┼──▶ live-presence (ephemeral WebSocket state)
ngl-svelte ───┘
```

## Quick start

```sh
# Clone the integration repo and all six pinned app repos.
git clone --recurse-submodules https://github.com/naufalrf4/portfolio-nopal.git
cd portfolio-nopal

# Install root-only E2E/shared tooling, then each app from its own lockfile.
bun install
bun run install:apps

# Copy the local configuration needed for the apps you will run.
cp apps/admin/.env.example apps/admin/.env.local
cp apps/public-astro/.env.example apps/public-astro/.env
cp apps/links-astro/.env.example apps/links-astro/.env
cp apps/ngl-svelte/.env.example apps/ngl-svelte/.env
cp apps/live-presence/.env.example apps/live-presence/.env
cp apps/rag-service/.env.example apps/rag-service/.env

# Run the local multi-app stack.
bun run dev:all
```

To work on one surface, run its local command instead:

```sh
cd apps/public-astro && bun run dev
```

Never commit real credentials.

## Apps

| Surface | Path | Stack | Port | Responsibility |
|---|---|---|:---:|---|
| Public portfolio | `apps/public-astro` | Astro + React | 3000 | Portfolio, SEO, booking, guestbook, AI chat entrypoint |
| Admin | `apps/admin` | Next.js | 3001 | Content authority, CMS, dashboard, public and internal APIs; owns seed data |
| Links | `apps/links-astro` | Astro + React | 3002 | Link-in-bio profile |
| Anonymous messages | `apps/ngl-svelte` | SvelteKit | 3003 | Turnstile-protected anonymous messaging |
| RAG service | `apps/rag-service` | Bun + Hono | 3005 | Retrieval, embeddings, grounding, AI workflows |
| Live presence | `apps/live-presence` | Bun WebSocket | 3006 | Ephemeral presence and cursor state |

## Standalone service repositories

Every app under `apps/*` is an independent Git submodule. Admin, RAG, and Live Presence source repos publish immutable GHCR images; the Astro/Svelte apps deploy independently to Cloudflare Pages. [`portfolio-deploy`](https://github.com/naufalrf4/portfolio-deploy) owns the image-only VPS Compose stack. Runtime connections remain Admin↔RAG on private APIs, RAG↔Postgres for approved retrieval work, and browser↔Presence over WebSocket. Root owns only cross-app tooling, shared integration packages, and pinned app references.

## Commands

```sh
# Development and builds
bun run dev:all
cd apps/admin && bun run build

# Install app dependencies once, independently per repository
bun run install:apps
bun run install:apps admin

# Build only the app you changed
bun run build:admin
bun run build:public
bun run build:links
bun run build:ngl
bun run build:rag
bun run build:all       # explicit sequential build of all buildable apps

# Quality gates
bun run lint:admin
bun run lint:ngl
bun run typecheck:admin
bun run typecheck:ngl
bun run typecheck:rag
bun run test:e2e
bun run test:e2e:specs       # services must already be running

# Local database lifecycle
bun run docker:dev
bun run docker:dev:down
bun run docker:dev:migrate
bun run docker:dev:seed
bun run reset:seed
```

App-specific verification remains available where applicable:

```sh
cd apps/admin && bun run lint && bun run typecheck && bun run build
cd apps/public-astro && bun run build
cd apps/links-astro && bun run build
cd apps/ngl-svelte && bun run lint && bun run check && bun run build
cd apps/rag-service && bun run typecheck && bun test && bun run build
```

## Workspace layout

```text
apps/                 pinned standalone application repositories
packages/             root copies for E2E and integration tooling
apps/admin/data/      Admin-owned seed and RAG-ingest content
e2e/                  API-only cross-app verification
scripts/              Docker and deployment orchestration
```

## Operations

### Data and service boundaries

- `apps/admin` is the content and API authority.
- `public-astro`, `links-astro`, and `ngl-svelte` are API-only consumers; they must not access PostgreSQL directly.
- `rag-service` is an approved PostgreSQL actor for RAG responsibilities and may use Admin internal APIs for coordination.
- `live-presence` holds only in-memory, elapsed-time state.

### Deployment

Production deployment is managed by Dokploy at `cloud.nrflabs.net` and targets its configured remote server. The existing Portfolio stack now points to `portfolio-deploy` and keeps its project, environment, Admin domain, server, and PostgreSQL. Its first deployment from the new source is pending in Dokploy's queue. The Compose dependency graph gates Admin/RAG runtime on RAG bootstrap and Admin migration success. Presence is routed under the Admin domain; no DNS changes are needed.

### Time

Server-decided calendar behavior is pinned to `Asia/Jakarta` in application code, database sessions, containers, and deployment scripts. Visitor timezone telemetry intentionally remains visitor-local.

## Documentation

- [AGENTS.md](AGENTS.md) — repository rules and operational constraints
- [DESIGN.md](DESIGN.md) — cross-app visual contract
- [.context/README.md](.context/README.md) — durable architecture and workflow context
- [PROGRESS.md](PROGRESS.md) — project timeline and current discoveries

## License

Private project. All rights reserved.
