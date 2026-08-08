# AGENTS.md

Authoritative AI control contract for this repository.

## 1. Project Context

- **Name:** `naufalrf-portfolio`
- **Purpose:** coordinate five standalone apps that together power the portfolio ecosystem
- **Architecture:** root repository shell with independent app runtimes under `apps/*`
- **Execution Model:** Bun workspace monorepo — root `package.json` declares `"workspaces": ["apps/*","packages/*"]`; all apps + shared packages (`packages/tsconfig`, `packages/design-tokens`, `packages/http`, `packages/contracts`) install together into a single root `bun.lock`.
- **Critical Domains:** Admin API authority, centralized Neon/Postgres ownership, legacy phase2 design parity, cross-app service boundaries, security hardening

## 2. Technology Baseline

- **Framework:** root workspace shell for Next.js 16, Astro 5 + React, SvelteKit 2, and a TypeScript Bun + Hono RAG service
- **Runtime:** Node `>=22.0.0` at root; Bun per JS app and for `apps/rag-service`
- **Language:** TypeScript across all apps and packages (the RAG service is TypeScript on Bun; the old Python/FastAPI service was removed)
- **Styling:** Tailwind CSS 4 with shared dark-first design tokens from `@naufalrf/design-tokens`
- **Package Manager:** Bun workspaces at root — a single root `bun.lock` is the only lockfile (app-level `bun.lock` files were removed). Install everything with `bun install` from the root.
- **Version Policy:** use versions resolved from manifests and lockfiles; never guess from memory
- **State Management:** framework-native data fetching and app-local state; no shared root state layer
- **Database / ORM:** centralized Neon/Postgres; Drizzle + `postgres` in Admin, `postgres` (postgres.js) + pgvector in the TS RAG service
- **Testing Stack:** app-local build/type/lint commands plus `bun test` in the RAG service and shared packages; no unified root CI or test runner evidenced

## 3. Architecture and Structure Rules

- Root is a Bun workspace shell; shared code lives only in the four `packages/*` (tsconfig, design-tokens, http, contracts). No component library / `packages/ui`.
- `apps/admin` is the primary content and API authority.
- `apps/public-astro`, `apps/links-astro`, and `apps/ngl-svelte` must stay API-only consumers and must not bypass Admin for database access.
- `apps/rag-service` may connect directly to the centralized database for approved RAG responsibilities and may call Admin internal APIs for coordination.

## 4. Operational Command Set

- **Install:** `bun install` at the root installs all workspace apps + packages into the single root `bun.lock`. Per-app installs are unnecessary.
- **Dev:** root supports `bun run dev:all` for local multi-app startup via `./start-dev.sh`; app-local alternatives remain `cd apps/admin && bun run dev`, `cd apps/public-astro && bun run dev`, `cd apps/links-astro && bun run dev`, `cd apps/ngl-svelte && bun run dev`, or `cd apps/rag-service && bun run dev`
- **Build:** root has no single build command; use `cd apps/admin && bun run build`, `cd apps/public-astro && bun run build`, `cd apps/links-astro && bun run build`, `cd apps/ngl-svelte && bun run build`, or `cd apps/rag-service && bun run build`
- **Test:** root supports `bun run reset:seed` for the local reset + reseed + RAG ingest workflow via `./reset-seed-rag.sh`; for app tests use `cd apps/rag-service && bun test`, `cd packages/http && bun test`, or `cd packages/contracts && bun test`. Do not invent missing app test commands.
- **Lint:** use `cd apps/admin && bun run lint` or `cd apps/ngl-svelte && bun run lint` (ngl also `bun run check`). Typecheck via `cd apps/admin && bun run typecheck` and `cd apps/rag-service && bun x tsc --noEmit`.

## 5. Git Workflow Rules

- **Branch Strategy:** not codified in this repo; default to the user's current branch unless instructed otherwise
- **Review Flow:** not codified here; do not assume auto-PR work
- **Auto-Commit:** forbidden unless the user explicitly asks
- **Auto-Push:** forbidden unless the user explicitly asks
- **Push Identity:** use only the user's identity
- **Co-Authors:** forbidden unless the user explicitly asks otherwise
- **Ignored Local Agent Artifacts:** `.agents/`, `.agent-workspace/`, `.agent-review/`, `.evals/`, `.reviews/`, `.opencode/`

## 6. Agent Behavior

- Read the nearest app `AGENTS.md`, this file, and relevant `.context/` files before planning or coding.
- Read `PROGRESS.md` to understand recent timeline, active direction, and known blockers before starting work.
- Do not guess missing root-level commands, CI workflows, or architecture rules that are not evidenced in repo files.
- Keep changes scoped to the task and preserve app boundaries unless the user explicitly changes the architecture.
- Preserve existing behavior unless the user asks for a change or a documented repo contradiction must be repaired.
- Update `.context/` and this file when the task reveals durable project knowledge.
- Append a factual entry to `PROGRESS.md` after meaningful milestones, decisions, or discoveries.
- Do not add co-author trailers, assistant attribution, or alternate authorship metadata on the user's behalf.

## 7. Authority Order

1. nearest app-local `AGENTS.md` when working inside `apps/*`; otherwise this file
2. `.context/`
3. explicit user instruction that does not contradict verified project truth
4. repository code, manifests, env examples, and configs

## 8. Self-Learn and Learned Rules

- Self-learn: add a short factual rule here when a task reveals a recurring repo quirk, boundary, command caveat, or security constraint that future agents would otherwise rediscover.
- Root `README.md` must not describe RAG as API-only; RAG is a direct database actor plus an Admin internal API consumer.
- Public, Links, and NGL are standalone apps, but they are not allowed to bypass Admin for database access.
- Legacy phase2 is the visual baseline until the user explicitly replaces it.
- Public-facing apps should expose their own `llms.txt` surface using the canonical structure from `apps/public-astro/public/llms.txt`, adapted to each app’s actual purpose and hostname; keep `llms-full.txt` removed unless the architecture intentionally changes.
- Root now has local orchestration scripts: `bun run dev:all` starts all apps, and `bun run reset:seed` resets Admin + RAG data, seeds Admin from `data/`, then triggers proper Admin -> RAG ingest.
- Root hook/tooling is Bun-aligned; remove stale pnpm lockfiles and pnpm-only root docs when updating repo shell docs.
- Root deployment automation now includes interactive `deploy.py` (run via `uv run deploy.py`) for single-host Paramiko SSH deploys; keep it pull-based on the server and do not turn it into a push-to-server file sync workflow unless the deployment architecture is intentionally changed.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
