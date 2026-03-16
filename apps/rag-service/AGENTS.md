# AGENTS.md

Authoritative AI control contract for this repository.

## 1. Project Context

- **Name:** `apps/rag-service`
- **Purpose:** provide the portfolio RAG backend for chat and ingest flows
- **Architecture:** Bun wrapper around a FastAPI service with direct Postgres/pgvector access and Admin internal API coordination
- **Execution Model:** runs from `apps/rag-service` with the real Python app in `fastapi/`; exposes external health/chat/ingest routes
- **Critical Domains:** direct database scope, vector ingest/retrieval, Admin service-token coordination, route compatibility

## 2. Technology Baseline

- **Framework:** FastAPI with Bun wrapper scripts
- **Runtime:** Bun at the app root and Python 3.12+ in `fastapi/`
- **Language:** Python in the runtime service plus small TypeScript/Bun wrapper glue
- **Styling:** none
- **Package Manager:** Bun at the app root and `uv` in `fastapi/`
- **Version Policy:** use versions resolved from `package.json`, `pyproject.toml`, and lockfiles; never guess from memory
- **State Management:** request-scoped service state plus database-backed retrieval and ingest records
- **Database / ORM:** centralized Neon/Postgres via SQLAlchemy async, asyncpg, Alembic, and pgvector
- **Testing Stack:** `bun run typecheck`, `bun run build`, `cd fastapi && uv run pytest`, `cd fastapi && uv run ruff check .`

## 3. Architecture and Structure Rules

- Keep direct database access scoped to approved RAG responsibilities instead of expanding this service into a general content authority.
- Preserve external route compatibility for `GET /health`, `POST /chat`, and `POST /ingest`.
- Preserve the Admin internal API backchannel and `X-Service-Token` flow for service-to-service coordination.
- Keep the Python runtime source of truth inside `fastapi/` and treat the Bun manifest as a wrapper/control layer.

## 4. Operational Command Set

- **Install:** `cd fastapi && uv sync`
- **Dev:** `bun run dev`
- **Build:** `bun run build`
- **Test:** `cd fastapi && uv run pytest`
- **Lint:** `cd fastapi && uv run ruff check .`

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
- Run `bun run typecheck`, `bun run build`, and `cd fastapi && uv run pytest` after meaningful code changes; also run `cd fastapi && uv run ruff check .` when touching Python code.

## 7. Authority Order

1. this file
2. `../../AGENTS.md`
3. `../../.context/`
4. explicit user instruction that does not contradict verified project truth
5. repository code, manifests, env examples, and configs in this app and `fastapi/`

## 8. Self-Learn and Learned Rules

- Self-learn: add a short factual rule here when a task reveals a recurring RAG-specific quirk, schema-scope constraint, or contract caveat.
- `fastapi/README.md` is the clearest local source for route and schema expectations.
- The wrapper manifest states that Admin manages the broader migration lifecycle; do not assume RAG owns cross-app schema migrations.
- RAG is a direct database actor in this repo even though the non-admin frontend apps are not.
