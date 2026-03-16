# Architecture

## Style

Repository shell for independent app repos under `apps/*`, with shared project truth documented at the root.

## Execution model

- Root contains metadata, shared linting hooks, and steering docs.
- Each app owns its own dependencies, scripts, runtime, and environment file.
- Cross-app communication happens through HTTP APIs and service tokens, except for the direct database actors documented below.

## App boundaries

- `apps/admin`
  - Next.js 16 app.
  - Primary content authority.
  - Hosts the admin dashboard plus `/api/v1/public`, `/api/v1/admin`, and `/api/v1/internal` routes.
  - Uses Drizzle and `postgres` directly against the centralized Neon/Postgres database.
- `apps/public-astro`
  - Astro 5 + React public portfolio.
  - Reads portfolio content from Admin public APIs.
  - Talks to the RAG service for chat requests.
  - Must not connect directly to the database.
- `apps/links-astro`
  - Astro 5 + React links hub.
  - Reads profile/about/link data from Admin public APIs.
  - Must not connect directly to the database.
- `apps/ngl-svelte`
  - SvelteKit 2 anonymous message app.
  - Submits public messages to Admin public APIs.
  - Must not connect directly to the database.
- `apps/rag-service`
  - Bun wrapper around `fastapi/`.
  - FastAPI app uses its own Python environment and direct Postgres access for the `rag` schema with pgvector.
  - Also calls Admin internal APIs using `X-Service-Token` for coordination such as chat log persistence.

## Database ownership

- The repository uses one centralized Neon/Postgres database.
- Admin owns the primary application schema and operational content flows.
- RAG is the only non-admin service allowed to connect directly to the database, and that access should stay scoped to RAG-specific schemas/tables plus explicitly approved reads.
- Public, Links, and NGL stay API-only consumers.

## Data flow

1. Admin stores and exposes portfolio content through public and admin APIs.
2. Public and Links fetch read models from Admin public endpoints.
3. NGL submits anonymous messages to Admin public endpoints.
4. Admin can trigger ingest requests to the RAG service through `dispatchRagIngest()` using `X-Service-Token`.
5. RAG stores vectors and ingest state in Postgres and can send service-to-service updates back to Admin.

## Design baseline

- The target visual language comes from `../naufalrf-portfolio-phase2`.
- Current evidence already shows partial carryover in the Astro apps via `Neu*` components, light neumorphic surfaces, and shared palette choices.
- Future UI work should preserve that baseline rather than introducing a new visual system ad hoc.

## Repo truth notes

- Root `README.md` now reflects that RAG has direct database access.
- App-local manifests and env examples are more authoritative than broad root summaries when they disagree.
