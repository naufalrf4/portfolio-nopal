# AGENTS.md

Authoritative AI control contract for this repository.

## 1. Project Context

- **Name:** `apps/admin`
- **Purpose:** provide the admin dashboard plus the primary public, admin, and internal API authority for the portfolio ecosystem
- **Architecture:** Next.js 16 app-router application with server-side database access and dashboard route groups
- **Execution Model:** runs independently from `apps/admin`; serves dashboard UI and HTTP APIs to other apps
- **Critical Domains:** content management, auth gating, direct Neon/Postgres access, Admin-to-RAG service coordination

## 2. Technology Baseline

- **Framework:** Next.js 16.1.1
- **Runtime:** Bun for local scripts and the Next.js runtime for app execution
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4, Radix UI, and existing light-neumorphic dashboard patterns
- **Package Manager:** Bun via `bun.lock`
- **Version Policy:** use versions resolved from `package.json` and `bun.lock`; never guess from memory
- **State Management:** server components, route handlers, and app-local client state only
- **Database / ORM:** centralized Neon/Postgres through Drizzle ORM and `postgres`
- **Testing Stack:** `bun run typecheck`, `bun run build`, `bun run lint`; no dedicated automated test script currently exists

## 3. Architecture and Structure Rules

- Keep Admin as the primary content and API authority for the whole portfolio ecosystem.
- Preserve public, admin, and internal API namespace boundaries rather than collapsing them into one route surface.
- Keep direct database access in server-side code only.
- Preserve the existing dashboard shell and legacy phase2 neumorphic design vocabulary unless the user replaces the design direction.

## 4. Operational Command Set

- **Install:** `bun install`
- **Dev:** `bun run dev`
- **Build:** `bun run build`
- **Test:** no dedicated automated test command is defined in `package.json`
- **Lint:** `bun run lint`

## 5. Git Workflow Rules

- **Branch Strategy:** not codified locally; default to the user's current branch unless instructed otherwise
- **Review Flow:** not codified locally; do not assume auto-PR work
- **Auto-Commit:** forbidden unless the user explicitly asks
- **Auto-Push:** forbidden unless the user explicitly asks
- **Push Identity:** use only the user's identity
- **Co-Authors:** forbidden unless the user explicitly asks otherwise
- **Ignored Local Agent Artifacts:** inherit `../../AGENTS.md`

## 6. Agent Behavior

- Read this file, `../../AGENTS.md`, `../../PROGRESS.md`, and relevant `../../.context/` files before planning or coding.
- Do not guess missing auth, API, or database rules that are not evidenced in repo files.
- Keep changes scoped to this app unless an API contract or shared rule explicitly requires a cross-app update.
- Preserve existing behavior unless the user asks for a change or a documented contradiction must be repaired.
- Update `../../.context/` and this file when a task reveals durable admin-specific knowledge.
- Append a factual entry to `../../PROGRESS.md` after meaningful milestones, decisions, or discoveries.
- Do not add co-author trailers, assistant attribution, or alternate authorship metadata on the user's behalf.
- Run `bun run typecheck` and `bun run build` after meaningful code changes; also run `bun run lint` when touching linted TS/JS files.

## 7. Authority Order

1. this file
2. `../../AGENTS.md`
3. `../../.context/`
4. explicit user instruction that does not contradict verified project truth
5. repository code, manifests, env examples, and configs in this app

## 8. Self-Learn and Learned Rules

- Self-learn: add a short factual rule here when a task reveals a recurring admin-specific quirk, boundary, command caveat, or security constraint.
- `src/lib/auth-security.ts` enforces the admin email allowlist from `ADMIN_EMAILS`.
- `src/lib/services/ragIngest.ts` is a key Admin -> RAG integration point and uses `X-Service-Token`.
- `src/app/api/v1/public/about/route.ts` must normalize stored Admin `aboutMe` data into the frontend-facing public contract for skills, experience, and social links.
- Local seed/reset flow is Drizzle-based in `scripts/reset-db.ts` and `scripts/seed.ts`; do not reintroduce Prisma-named seed entrypoints.
- Remove stale Prisma config/runtime references when touched, but keep `_prisma_migrations` compatibility history unless the migration strategy is intentionally changed end to end.
- RAG seeding must go through Admin content exports plus `POST /ingest` with `type: all`; do not bypass Admin by pushing raw files directly into RAG.
- Current public API CORS is broader than the target hardening posture; future security work should narrow it, not widen it.
- Project contexts are retired; project detail authority now lives in `projects.summary`, `projects.description`, `projects.content`, and `project_images`, with migration/backfill handled in Drizzle SQL before schema drops.
- Use `node --env-file=.env.local .next/standalone/server.js` for production-like local starts; standalone public routes can fail with DB env `ECONNREFUSED` if `.env.local` is not loaded explicitly.
- Local standalone Admin starts must copy `.next/static` (and `public/` when present) into `.next/standalone` before boot, otherwise sign-in/dashboard pages can 404 `_next/static/*` assets even when the build itself succeeded.
- Admin date/time presentation should stay anchored to `Asia/Jakarta` via `src/lib/utils/date.ts`; keep storage in UTC, but do not format admin dashboard times with raw runtime-local `Date` behavior.
- Admin auth failure recovery depends on `safeAuth()` plus a top-level `/unauthorized` page outside the `(dashboard)` route group; do not move unauthorized handling back under protected dashboard layouts.
- For dynamic Admin API route handlers that need `params` or session data, use `src/lib/api/middleware/auth.ts` `withAdminAuthContext()` instead of duplicating raw `auth()` checks inline.
- Keep `src/lib/api/middleware/auth.ts` on `safeAuth()` rather than raw `auth()` so stale Auth.js cookies degrade to clean API 401s instead of bubbling session errors.
- Child Admin routes under `projects/[id]` must scope image/content mutations to the parent `projectId`; do not trust `imageId` alone on nested project image endpoints.
- `src/app/api/v1/internal/chat-logs/route.ts` now supports `mode: 'append'`; service callers that are adding a fresh turn should append instead of rewriting the full transcript payload.
- `src/lib/api/handlers/chat-logs.service.ts` merges append writes by message `id` under a row lock; keep assistant/user message IDs stable across retries to avoid accidental duplicates.
- Live Admin databases can lag Drizzle migration `0007_nifty_exodus`; use `src/lib/api/handlers/about-read.service.ts` for AboutMe reads that must tolerate a missing `freelanceProfile` column instead of selecting `aboutMe` directly.
- The authoritative editorial UI for `aboutMe.freelanceProfile` is the Knowledge page's `Freelance Tool` tab (`src/app/(dashboard)/knowledge/KnowledgePageContent.tsx` + `src/components/knowledge/FreelanceToolPanel.tsx`), which saves through `useAbout()` to `PUT /api/v1/admin/about`.
- Live Admin databases can also lag the `anonymous_messages.metadata` column; keep `src/lib/api/handlers/anonymous-messages.service.ts` on explicit compatibility-safe selects/returns and fallback inserts instead of relying on implicit `select()` / `returning()` over the full table shape.
- On Next.js 16 in this app, `bun run lint` must call `eslint .` directly; do not revert `package.json` back to `next lint` because it misroutes the argument and fails as `apps/admin/lint`.
