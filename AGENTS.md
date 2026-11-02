# AGENTS.md

Authoritative AI control contract for this repository.

## 1. Project Context

- **Name:** `naufalrf-portfolio`
- **Purpose:** coordinate six standalone app repositories, shared integration packages, and cross-app E2E tooling
- **Architecture:** lightweight root integration shell; every app under `apps/*` is a pinned Git submodule
- **Execution Model:** root Bun workspace contains only `packages/*` and `e2e`; each app owns its manifest, lockfile, dependency install, and build.
- **Critical Domains:** Admin API authority, centralized Postgres ownership, cross-app design contract parity (root `DESIGN.md`), cross-app service boundaries, security hardening

## 2. Technology Baseline

- **Framework:** root workspace shell for Next.js 16, Astro 5 + React, SvelteKit 2, and a TypeScript Bun + Hono RAG service
- **Runtime:** Node `>=22.0.0` at root; Bun per JS app and for `apps/rag-service`
- **Language:** TypeScript across all apps and packages (the RAG service is TypeScript on Bun; the old Python/FastAPI service was removed)
- **Styling:** Tailwind CSS 4 with shared dark-first design tokens from `@naufalrf/design-tokens`
- **Package Manager:** Bun. Root `bun install` installs integration/E2E tooling only; `bun run install:apps` installs each app from its own repo and lockfile.
- **Version Policy:** use versions resolved from manifests and lockfiles; never guess from memory
- **State Management:** framework-native data fetching and app-local state; no shared root state layer
- **Database / ORM:** centralized Postgres (dockerized `pgvector/pgvector` locally, Dokploy-managed in production); Drizzle + `postgres` in Admin, `postgres` (postgres.js) + pgvector in the TS RAG service
- **Testing Stack:** app-local build/type/lint commands plus `bun test` in the RAG service and shared packages; no unified root CI or test runner evidenced

## 3. Architecture and Structure Rules

- Root is a Bun workspace shell for E2E/integration tooling and the four `packages/*` (tsconfig, design-tokens, http, contracts). App repositories keep independent snapshots of the shared packages. No component library / `packages/ui`.
- `apps/admin` is the primary content and API authority.
- `apps/public-astro`, `apps/links-astro`, and `apps/ngl-svelte` must stay API-only consumers and must not bypass Admin for database access.
- `apps/rag-service` may connect directly to the centralized database for approved RAG responsibilities and may call Admin internal APIs for coordination.

## 4. Operational Command Set

- **Install:** run `bun install` at root for E2E/shared tooling, then `bun run install:apps` (or pass app names) for independent app locks.
- **Dev:** root supports `bun run dev:all` for local multi-app startup via `./start-dev.sh`; app-local alternatives remain `cd apps/admin && bun run dev`, `cd apps/public-astro && bun run dev`, `cd apps/links-astro && bun run dev`, `cd apps/ngl-svelte && bun run dev`, or `cd apps/rag-service && bun run dev`
- **Build:** use the app-local build or `bun run build:<app>` for one app. `bun run build:all` explicitly builds all buildable apps sequentially; Live Presence has no build step.
- **Test:** root has `bun run test:e2e` (API-only cross-app E2E in `e2e/`, local pre-deploy gate; `bun run test:e2e <feature>` for one feature, `bun run test:e2e:specs` when services are already running). Beyond that there is no unified unit-test command. `bun run reset:seed` resets+reseeds Admin + RAG data via the dockerized flow (`scripts/docker-dev-reset-seed.sh`, needs `docker compose` up with `.env.docker.dev`); `bun run docker:dev:seed` reseeds without reset. For app tests use `cd apps/rag-service && bun test`, `cd packages/http && bun test`, or `cd packages/contracts && bun test`. Do not invent missing app test commands.
- **Lint/typecheck:** use `bun run lint:admin`, `bun run lint:ngl`, and the app-specific `typecheck:*` scripts; app-local commands remain available. Run from an app repo so Bun uses that app's lockfile.

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
- Visual authority is root `DESIGN.md`; the legacy phase2 neumorphic baseline was retired. Keep UI work on the shared `@naufalrf/design-tokens` (dark-first) and the DESIGN.md per-app scene/layout/motion contract.
- Neumorphic vocabulary is fully removed from the codebase. Utilities are named for what they do: `surface-raised{,-sm,-lg,-hover}`, `surface-sunken{,-sm,-deep}`, `surface-flat`, `shape-{base,sm,lg,inner,container}`, `motion-{fast,base,slow}`, `panel-card`, `card-inset`, `field-input`, `icon-btn`, `divider-line`, `badge-pill`, `avatar-round`, `skeleton-shimmer`, `fill-{accent,success}`, `btn-press`, `btn-{base,primary}`, `interactive-surface`, `toggle-{track,thumb}`, `progress-{track,fill}`. Do not reintroduce `neu-*` names or neumorphic shadow stacks.
- Themed foreground on colored surfaces must use `text-on-accent` / `text-on-error` (backed by inverting `--on-accent` / `--on-error` tokens), never `text-white`: `--teal` inverts between themes, so a fixed white foreground fails contrast in one of them.
- Glass is only for surfaces that overlay flowing content (`glass-bar`, `glass-panel`, `glass-chip`, `scrim`); `backdrop-filter` over an opaque background is forbidden because it costs a compositor layer and renders nothing.
- Admin theming is attribute-based: `ThemeToggler` writes `document.documentElement.dataset.theme`, so the Tailwind variant must stay `@custom-variant light (&:is([data-theme='light'] *))`. A class-based `.dark` variant silently disables light mode. `<html>` needs `suppressHydrationWarning` because the anti-FOUC inline script mutates the attribute before hydration.
- Public-facing apps should expose their own `llms.txt` surface using the canonical structure from `apps/public-astro/public/llms.txt`, adapted to each app’s actual purpose and hostname; keep `llms-full.txt` removed unless the architecture intentionally changes.
- Root now has local orchestration scripts: `bun run dev:all` starts all apps, and `bun run reset:seed` resets Admin + RAG data, seeds Admin from `apps/admin/data/`, then triggers proper Admin -> RAG ingest.
- Root hook/tooling is Bun-aligned; remove stale pnpm lockfiles and pnpm-only root docs when updating repo shell docs.
- Admin and RAG Docker builds run from their app-local contexts and install only that repository's lockfile; root workspace metadata must not pull app dependencies.
- Admin's normal `next build` now succeeds without `--debug-prerender` in the checked local workspace; do not restore that debug-only flag unless a regular production build reproduces the upstream prerender failure.
- Backend split target (accepted 2026-11-02): all six apps are independent source repos pinned as submodules here; `portfolio-deploy` owns image-only VPS Compose and immutable image promotion. Runtime links are Admin↔RAG private APIs, RAG's approved private Postgres access, and Presence WebSocket routing; Admin remains migration owner. Admin seed content lives inside the Admin repo. Admin CI needs `ADMIN_R2_ACCOUNT_ID` and `ADMIN_R2_BUCKET_NAME` Actions variables so Next Image can validate private media URLs at build time. See `.omx/plans/repo-split-deploy-plan.md` for current gates.
- Production deployment control is Dokploy at `cloud.nrflabs.net`, targeting its already-configured remote server. The existing Portfolio Compose stack now points to `portfolio-deploy`; preserve its project, server, environment, Admin domain, and Dokploy-managed Postgres. Presence is routed under the Admin hostname; a stale direct Presence domain mapping was removed in Dokploy without changing DNS. Inter-service links use the Compose network; do not add DNS for them. The earlier HMAC receiver experiment is disabled and must not be re-enabled for this deployment path.

- The whole system is GMT+7 (Asia/Jakarta) deterministic regardless of deploy location, enforced at four layers: app code (Jakarta-pinned formatters and date-key math), DB session timezone (`connection: { timezone: 'Asia/Jakarta' }` in both `apps/admin/src/lib/db/index.ts` and `apps/rag-service/src/db.ts`), container env (`TZ: Asia/Jakarta` on every service in both compose files, plus `PGTZ` + `-c timezone=Asia/Jakarta` on the dev Postgres), and deploy scripts (`export TZ="${TZ:-Asia/Jakarta}"`). Do not remove a layer assuming another covers it.
- Anything the SERVER decides must be Jakarta-pinned (analytics day buckets, retention cutoffs, booking slot day boundaries, email date labels, greeting hour, build-time copyright year, deploy log timestamps). Anything that records the VISITOR's own zone must stay visitor-local: the `Intl.DateTimeFormat().resolvedOptions().timeZone` telemetry captured in public-astro/links-astro/ngl-svelte layouts and `submission-context.ts` is intentional — do not "fix" it to Jakarta.
- `apps/public-astro/src/lib/utils.ts` is that app's date authority (`formatDate`, `formatDateShort`, `formatDistanceToNow`, `getJakartaYear`, all Jakarta-explicit). Reuse it instead of adding raw `toLocaleDateString` calls without a `timeZone`. Build-time `new Date().getFullYear()` bakes in the BUILDER's timezone — derive the year through a Jakarta-pinned formatter.
- `apps/rag-service` and `apps/live-presence` need no Jakarta date logic: every timestamp there is an instant (`Date.now()`, `.toISOString()`, SQL `now()`) and TTLs are elapsed-time. Keep it that way rather than introducing local calendar getters.
- Scheduled cleanup runs in the `admin-cron` sidecar in the production Compose stack at a configurable Asia/Jakarta wall-clock time; the route itself remains an Admin endpoint.
- `docker compose -f docker-compose.prod.yml config` fails locally because `.env.docker.prod` exists only on the server; validate prod compose edits by parsing the YAML directly instead of assuming the file is broken.
- Cron now lives INSIDE Docker as the `admin-cron` sidecar in `docker-compose.prod.yml` (reuses `node:22-bookworm-slim`, the same image as the admin prod stage, so no extra pull). Nothing is scheduled on the host: there is still no crontab, systemd timer, or GitHub Actions `schedule:` in play. The sidecar computes its next run with GNU `date -d "today $CRON_AT"` under `TZ: Asia/Jakarta`, so the schedule is a real WIB calendar time, not a drifting `sleep 86400`.
- `admin-cron` invokes the endpoint with `node -e fetch(...)` because `curl` is NOT present in `node:22-bookworm-slim`. This mirrors the existing admin healthcheck. `CRON_SECRET` is read via `process.env` inside the container, so it never appears in the command line or on the host.
- Keep `admin-cron` on the `internal` network only, never on `dokploy-network` — it must not gain a public surface. It is also intentionally NOT given a bind mount: prod compose has zero bind mounts, so the scheduler script stays inline in `command:`.
- `CRON_SECRET: ${ADMIN_CRON_SECRET}` must stay on the admin service in BOTH compose files. Without it `apps/admin/src/app/api/cron/cleanup-chatlogs/route.ts` fail-closes to 401 for every request, and the authorized-path test in `e2e/features/admin-cron/admin-cron.spec.ts` silently skips.
- Production media uses a private Cloudflare R2 bucket through the AWS SDK v3 S3 API. `ADMIN_R2_ACCOUNT_ID` and `ADMIN_R2_BUCKET_NAME` are build inputs because Next Image validates the bucket-specific signed-URL host at build time; the access key and secret are runtime-only. Keep legacy GCS URL-to-key normalization while the database contains old media URLs, and never make the media bucket public just to bypass signed URLs.
- For Cloudflare Pages apps, keep non-secret runtime/build variables in the app's `wrangler.toml`, which is the configuration source of truth. Never store tokens or Turnstile secrets in Wrangler config.
- All six apps are pinned submodules. Initialize them recursively before per-app install/build. Pages injects `CF_PAGES=1`, which selects the Cloudflare adapter; Docker builds from each app repo select its standalone Node adapter where applicable.
- Public, Links, and NGL production containers use Node 22 slim images, so their Compose healthchecks must use Node's built-in `fetch`, never `bun`.
- The production RAG image contains compiled entrypoints only. Build `src/db-bootstrap.ts` into `dist/db-bootstrap.js` and invoke that artifact from `rag-bootstrap`; Admin migrations remain the schema owner.
- Dokploy's deployed Compose checkout provides root `.env`, not `.env.docker.prod`. Production helper scripts prefer `PROD_ENV_FILE`, then `.env.docker.prod`, then Dokploy's `.env`; never copy or print secret values while diagnosing env setup.
- `scripts/docker-prod-up.sh` is a manual local helper, not Dokploy's deployment controller. It builds selected app images serially; Admin migration uses the lightweight `migrator` target and must not compile Next.js. Production is image-only through `portfolio-deploy`; keep migration/bootstrap success as a prerequisite to starting runtime services in Dokploy.
- `apps/live-presence` has no external package dependencies. Keep its Dockerfile and Compose build context app-local; do not reintroduce root workspace installation there.
- Production VPS runs Admin, RAG, and Live Presence in one Compose stack. Admin is the only public hostname; its `/presence` path router strips that prefix and forwards WebSockets to `live-presence:3006`, so browser clients use `wss://admin.naufalrf.net/presence/ws`. Keep RAG internal and do not add a separate Presence hostname unless the user changes this routing decision.
- Cron run time is configurable via `ADMIN_CRON_AT` (`HH:MM` in Asia/Jakarta, default `02:00`). Verify scheduler changes by actually running the extracted `command` in a container against a stub, then checking both the fire time and the failure path; `docker compose config` shows `$$` purely as re-escaping and proves nothing.
