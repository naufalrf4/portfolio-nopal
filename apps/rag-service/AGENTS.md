# AGENTS.md

Authoritative AI control contract for this repository.

## 1. Project Context

- **Name:** `apps/rag-service`
- **Purpose:** provide the portfolio RAG backend for chat and ingest flows
- **Architecture:** Bun + Hono service with direct Postgres/pgvector access and Admin internal API coordination
- **Execution Model:** runs from `apps/rag-service` as a standalone Bun app; exposes external health/chat/ingest routes
- **Critical Domains:** direct database scope, vector ingest/retrieval, Admin service-token coordination, route compatibility

## 2. Technology Baseline

- **Framework:** Hono ^4.7.5
- **Runtime:** Bun
- **Language:** TypeScript
- **Styling:** none
- **Package Manager:** Bun
- **Version Policy:** use versions resolved from `package.json` and `bun.lock`; never guess from memory
- **State Management:** request-scoped service state plus database-backed retrieval and ingest records
- **Database / ORM:** centralized Neon/Postgres via postgres.js direct; Admin Drizzle owns schema migrations
- **Embedding/Chat:** multi-provider via `src/llm-provider.ts`; default is openai-compatible (`OPENAI_API_KEY`, `text-embedding-3-small` embedding, `gpt-4o-mini` chat), with Google Gemini (`GEMINI_API_KEY`) supported as an alternate provider through the same abstraction
- **Testing Stack:** `bun run typecheck`, `bun run build`

## 3. Architecture and Structure Rules

- Keep direct database access scoped to approved RAG responsibilities instead of expanding this service into a general content authority.
- Preserve external route compatibility for `GET /health`, `POST /chat`, and `POST /ingest`.
- Preserve the Admin internal API backchannel and `X-Service-Token` flow for service-to-service coordination.
- Source code lives in `src/`; the entry point is `src/index.ts`.
- Hybrid retrieval uses dense*0.7 + lexical*0.3 normalized scoring; no contextual-chunk.

## 4. Operational Command Set

- **Install:** `bun install`
- **Dev:** `bun run dev`
- **Build:** `bun run build`
- **Typecheck:** `bun run typecheck`
- **DB Bootstrap:** `bun run db:bootstrap`

## 5. Git Workflow Rules

- **Branch Strategy:** not codified locally; default to the user's current branch unless instructed otherwise
- **Review Flow:** not codified locally; do not assume auto-PR work
- **Auto-Commit:** forbidden unless the user explicitly asks
- **Auto-Push:** forbidden unless the user explicitly asks
- **Push Identity:** use only the user's identity
- **Co-Authors:** forbidden unless the user explicitly asks otherwise
- **Ignored Local Agent Artifacts:** inherit `../../AGENTS.md`

## 6. Agent Behavior

- Read this file, `../../AGENTS.md`, `../../PROGRESS.md`, `../../.context/base/security.yaml`, and `../../.context/integrations/service-boundaries.md` before planning or coding.
- Do not guess missing route, ingest, or schema-scope rules that are not evidenced in repo files.
- Keep changes scoped to this app unless an Admin contract or shared rule explicitly requires a cross-app update.
- Preserve existing behavior unless the user asks for a change or a documented contradiction must be repaired.
- Update `../../.context/` and this file when a task reveals durable RAG-specific knowledge.
- Append a factual entry to `../../PROGRESS.md` after meaningful milestones, decisions, or discoveries.
- Do not add co-author trailers, assistant attribution, or alternate authorship metadata on the user's behalf.
- Run `bun run typecheck` and `bun run build` after meaningful code changes.

## 7. Authority Order

1. this file
2. `../../AGENTS.md`
3. `../../.context/`
4. explicit user instruction that does not contradict verified project truth
5. repository code, manifests, env examples, and configs in this app

## 8. Self-Learn and Learned Rules

- Self-learn: add a short factual rule here when a task reveals a recurring RAG-specific quirk, schema-scope constraint, or contract caveat.
- Admin manages the broader migration lifecycle; do not assume RAG owns cross-app schema migrations.
- RAG is a direct database actor in this repo even though the non-admin frontend apps are not.
- Docker `rag-bootstrap` should only provision the `vector` extension and `rag` schema; Admin Drizzle migrations own `rag.documents`, `rag.chunks`, and `rag.ingestion_runs`.
- RAG should use `ADMIN_INTERNAL_API_TOKEN` for Admin internal API calls and `RAG_INGEST_SERVICE_TOKEN` for validating `/ingest`; `ADMIN_SERVICE_TOKEN` is legacy fallback compatibility only.
- Production browser chat traffic should reach RAG only through the `apps/public-astro` proxy layer; do not assume `POST /chat` is meant for direct public edge exposure.
- RAG chat prompt building now uses forwarded `Accept-Language` as a response-language hint; preserve same-language, semi-casual/semi-formal answering unless the user explicitly changes that assistant behavior.
- The service is now fully TypeScript/Hono/Bun (no Python/FastAPI/uv). All `fastapi/` and `alembic/` directories and `uv.lock` have been removed.
