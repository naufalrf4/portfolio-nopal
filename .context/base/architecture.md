# Architecture

## Style

Bun workspace monorepo for independent app repos under `apps/*` and shared packages under `packages/*`, with shared project truth documented at the root.

## Execution model

- Root is a Bun workspace shell. A single `bun install` installs all apps and shared packages.
- Public, Links, and NGL are pinned as Git submodules at their existing `apps/*` workspace paths. Clone with `--recurse-submodules`; the VPS pull deploy initializes pinned submodules before Docker builds.
- Those three apps choose Cloudflare adapters when Pages injects `CF_PAGES=1`; normal root workspace and VPS Docker builds use Node adapters. VPS Docker builds run from each app submodule and install only its dependencies.
- Each app owns its own scripts, runtime, and environment file.
- Cross-app communication happens through HTTP APIs and service tokens, except for the direct database actors and websocket presence service documented below.

## App boundaries

- `apps/admin`
  - Next.js 16 app.
  - Primary content authority.
  - Hosts the admin dashboard plus `/api/v1/public`, `/api/v1/admin`, and `/api/v1/internal` routes.
  - Uses Drizzle and `postgres` directly against the centralized Postgres database.
- `apps/public-astro`
  - Astro 5 + React public portfolio.
  - Reads portfolio content from Admin public APIs.
  - Proxies chat requests through Admin's public RAG API; it never calls the private RAG service directly.
  - Talks to `apps/live-presence` for ephemeral websocket presence.
  - Must not connect directly to the database.
- `apps/links-astro`
  - Astro 5 + React links hub.
  - Reads profile/about/link data from Admin public APIs.
  - Must not connect directly to the database.
- `apps/ngl-svelte`
  - SvelteKit 2 anonymous message app.
  - Submits public messages to Admin public APIs.
  - Must not connect directly to the database.
- `apps/live-presence`
  - Bun websocket service.
  - Supplies ephemeral room-based cursor presence for the public site.
  - Must not connect to the database or route presence traffic through Admin APIs.
- `apps/rag-service`
  - TypeScript Bun + Hono service.
  - Uses `postgres` (postgres.js) with direct Postgres access for the `rag` schema with pgvector.
  - Also calls Admin internal APIs using `X-Service-Token` for coordination such as chat log persistence.

## Database ownership

- The repository uses one centralized Postgres database (dockerized `pgvector/pgvector` locally, Dokploy-managed in production).
- Admin owns the primary application schema and operational content flows.
- RAG is the only non-admin service allowed to connect directly to the database, and that access should stay scoped to RAG-specific schemas/tables plus explicitly approved reads.
- Public, Links, and NGL stay API-only consumers.
- Live presence stays persistence-free and outside the database boundary entirely.

## Data flow

1. Admin stores and exposes portfolio content through public and admin APIs.
2. Public and Links fetch read models from Admin public endpoints.
3. NGL submits anonymous messages to Admin public endpoints.
4. Public site clients exchange ephemeral websocket presence updates with `apps/live-presence`.
5. Admin can trigger ingest requests to the RAG service through `dispatchRagIngest()` using `X-Service-Token`.
6. RAG stores vectors and ingest state in Postgres and can send service-to-service updates back to Admin.

## Design baseline

- The visual authority is root `DESIGN.md` (dark-first, shared `@naufalrf/design-tokens`).
- The legacy `../naufalrf-portfolio-phase2` neumorphic baseline was explicitly retired and replaced by DESIGN.md (commits `f70d51b`, `a61a7e9`, `cfaf77c`); `public-astro` renamed Neu* components to Card/Button/Badge/Input/Textarea and `admin` keeps `neu-*` names as a flat dark-first naming layer.

## Repo truth notes

- Root `README.md` now reflects that RAG has direct database access.
- Root orchestration now includes `apps/live-presence` as a sixth local service.
- App-local manifests and env examples are more authoritative than broad root summaries when they disagree.
