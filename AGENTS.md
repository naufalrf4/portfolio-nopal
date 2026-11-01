# AGENTS.md

Authoritative AI control contract for this repository.

## 1. Project Context

- **Name:** `naufalrf-portfolio`
- **Purpose:** coordinate five standalone apps that together power the portfolio ecosystem
- **Architecture:** root repository shell with independent app runtimes under `apps/*`
- **Execution Model:** Bun workspace monorepo — root `package.json` declares `"workspaces": ["apps/*","packages/*"]`; all apps + shared packages (`packages/tsconfig`, `packages/design-tokens`, `packages/http`, `packages/contracts`) install together into a single root `bun.lock`.
- **Critical Domains:** Admin API authority, centralized Postgres ownership, cross-app design contract parity (root `DESIGN.md`), cross-app service boundaries, security hardening

## 2. Technology Baseline

- **Framework:** root workspace shell for Next.js 16, Astro 5 + React, SvelteKit 2, and a TypeScript Bun + Hono RAG service
- **Runtime:** Node `>=22.0.0` at root; Bun per JS app and for `apps/rag-service`
- **Language:** TypeScript across all apps and packages (the RAG service is TypeScript on Bun; the old Python/FastAPI service was removed)
- **Styling:** Tailwind CSS 4 with shared dark-first design tokens from `@naufalrf/design-tokens`
- **Package Manager:** Bun workspaces at root — a single root `bun.lock` is the only lockfile (app-level `bun.lock` files were removed). Install everything with `bun install` from the root.
- **Version Policy:** use versions resolved from manifests and lockfiles; never guess from memory
- **State Management:** framework-native data fetching and app-local state; no shared root state layer
- **Database / ORM:** centralized Postgres (dockerized `pgvector/pgvector` locally, Dokploy-managed in production); Drizzle + `postgres` in Admin, `postgres` (postgres.js) + pgvector in the TS RAG service
- **Testing Stack:** app-local build/type/lint commands plus `bun test` in the RAG service and shared packages; no unified root CI or test runner evidenced

## 3. Architecture and Structure Rules

- Root is a Bun workspace shell; shared code lives only in the four `packages/*` (tsconfig, design-tokens, http, contracts). No component library / `packages/ui`.
- `apps/admin` is the primary content and API authority.
- `apps/public-astro`, `apps/links-astro`, and `apps/ngl-svelte` must stay API-only consumers and must not bypass Admin for database access.
- `apps/rag-service` may connect directly to the centralized database for approved RAG responsibilities and may call Admin internal APIs for coordination.

## 4. Operational Command Set

- **Install:** `bun install` at the root installs all workspace apps + packages into the single root `bun.lock`. Per-app installs are unnecessary.
- **Dev:** root supports `bun run dev:all` for local multi-app startup via `./start-dev.sh`; app-local alternatives remain `cd apps/admin && bun run dev`, `cd apps/public-astro && bun run dev`, `cd apps/links-astro && bun run dev`, `cd apps/ngl-svelte && bun run dev`, or `cd apps/rag-service && bun run dev`
- **Build:** root supports `bun run build` (bun `--filter` chain over admin, public-astro, links-astro, ngl-svelte, rag-service; live-presence has no build script). Per-app: `cd apps/admin && bun run build`, `cd apps/public-astro && bun run build`, `cd apps/links-astro && bun run build`, `cd apps/ngl-svelte && bun run build`, or `cd apps/rag-service && bun run build`
- **Test:** root has `bun run test:e2e` (API-only cross-app E2E in `e2e/`, local pre-deploy gate; `bun run test:e2e <feature>` for one feature, `bun run test:e2e:specs` when services are already running). Beyond that there is no unified unit-test command. `bun run reset:seed` resets+reseeds Admin + RAG data via the dockerized flow (`scripts/docker-dev-reset-seed.sh`, needs `docker compose` up with `.env.docker.dev`); `bun run docker:dev:seed` reseeds without reset. For app tests use `cd apps/rag-service && bun test`, `cd packages/http && bun test`, or `cd packages/contracts && bun test`. Do not invent missing app test commands.
- **Lint:** root supports `bun run lint` (admin + ngl-svelte filters) and `bun run typecheck` (admin + ngl-svelte check + rag-service filters); app-local: `cd apps/admin && bun run lint`, `cd apps/ngl-svelte && bun run lint` (ngl also `bun run check`). Typecheck also via `cd apps/admin && bun run typecheck` or `cd apps/rag-service && bun run typecheck` (use the app script, not raw `bun x tsc`, which can re-resolve the lockfile).

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
- Root now has local orchestration scripts: `bun run dev:all` starts all apps, and `bun run reset:seed` resets Admin + RAG data, seeds Admin from `data/`, then triggers proper Admin -> RAG ingest.
- Root hook/tooling is Bun-aligned; remove stale pnpm lockfiles and pnpm-only root docs when updating repo shell docs.
- Root deployment is pull-based: `scripts/github_webhook_server.py` (HMAC-verified, port 9010) triggers `scripts/github-webhook-deploy.sh` which fetches/checks out `main` and runs `scripts/docker-prod-up.sh` + `scripts/docker-prod-migrate.sh`. Production Postgres is Dokploy-managed (`DB_HOST:-db`). Do not turn this into a push-to-server file sync workflow unless the deployment architecture is intentionally changed.

- The whole system is GMT+7 (Asia/Jakarta) deterministic regardless of deploy location, enforced at four layers: app code (Jakarta-pinned formatters and date-key math), DB session timezone (`connection: { timezone: 'Asia/Jakarta' }` in both `apps/admin/src/lib/db/index.ts` and `apps/rag-service/src/db.ts`), container env (`TZ: Asia/Jakarta` on every service in both compose files, plus `PGTZ` + `-c timezone=Asia/Jakarta` on the dev Postgres), and deploy scripts (`export TZ="${TZ:-Asia/Jakarta}"`). Do not remove a layer assuming another covers it.
- Anything the SERVER decides must be Jakarta-pinned (analytics day buckets, retention cutoffs, booking slot day boundaries, email date labels, greeting hour, build-time copyright year, deploy log timestamps). Anything that records the VISITOR's own zone must stay visitor-local: the `Intl.DateTimeFormat().resolvedOptions().timeZone` telemetry captured in public-astro/links-astro/ngl-svelte layouts and `submission-context.ts` is intentional — do not "fix" it to Jakarta.
- `apps/public-astro/src/lib/utils.ts` is that app's date authority (`formatDate`, `formatDateShort`, `formatDistanceToNow`, `getJakartaYear`, all Jakarta-explicit). Reuse it instead of adding raw `toLocaleDateString` calls without a `timeZone`. Build-time `new Date().getFullYear()` bakes in the BUILDER's timezone — derive the year through a Jakarta-pinned formatter.
- `apps/rag-service` and `apps/live-presence` need no Jakarta date logic: every timestamp there is an instant (`Date.now()`, `.toISOString()`, SQL `now()`) and TTLs are elapsed-time. Keep it that way rather than introducing local calendar getters.
- Cron scheduling lives OUTSIDE this repo. There is no `vercel.json`, crontab, systemd timer, or GitHub Actions `schedule:` in-tree; `apps/admin/src/app/api/cron/cleanup-chatlogs/route.ts` is only an endpoint. The external Dokploy/host scheduler must be configured as `Asia/Jakarta` (or its expression offset by −7h if it runs UTC).
- `docker compose -f docker-compose.prod.yml config` fails locally because `.env.docker.prod` exists only on the server; validate prod compose edits by parsing the YAML directly instead of assuming the file is broken.
- Cron now lives INSIDE Docker as the `admin-cron` sidecar in `docker-compose.prod.yml` (reuses `node:22-bookworm-slim`, the same image as the admin prod stage, so no extra pull). Nothing is scheduled on the host: there is still no crontab, systemd timer, or GitHub Actions `schedule:` in play. The sidecar computes its next run with GNU `date -d "today $CRON_AT"` under `TZ: Asia/Jakarta`, so the schedule is a real WIB calendar time, not a drifting `sleep 86400`.
- `admin-cron` invokes the endpoint with `node -e fetch(...)` because `curl` is NOT present in `node:22-bookworm-slim`. This mirrors the existing admin healthcheck. `CRON_SECRET` is read via `process.env` inside the container, so it never appears in the command line or on the host.
- Keep `admin-cron` on the `internal` network only, never on `dokploy-network` — it must not gain a public surface. It is also intentionally NOT given a bind mount: prod compose has zero bind mounts, so the scheduler script stays inline in `command:`.
- `CRON_SECRET: ${ADMIN_CRON_SECRET}` must stay on the admin service in BOTH compose files. Without it `apps/admin/src/app/api/cron/cleanup-chatlogs/route.ts` fail-closes to 401 for every request, and the authorized-path test in `e2e/features/admin-cron/admin-cron.spec.ts` silently skips.
- Production media uses a private Cloudflare R2 bucket through the AWS SDK v3 S3 API. `ADMIN_R2_ACCOUNT_ID` and `ADMIN_R2_BUCKET_NAME` are build inputs because Next Image validates the bucket-specific signed-URL host at build time; the access key and secret are runtime-only. Keep legacy GCS URL-to-key normalization while the database contains old media URLs, and never make the media bucket public just to bypass signed URLs.
- For Cloudflare Pages apps, keep non-secret runtime/build variables in the app's `wrangler.toml`, which is the configuration source of truth. Never store tokens or Turnstile secrets in Wrangler config.
- `apps/public-astro`, `apps/links-astro`, and `apps/ngl-svelte` are pinned submodules; initialize them recursively before root workspace install/build. Pages injects `CF_PAGES=1`, which selects the Cloudflare adapter; root/Docker builds without it select Node adapters for the VPS rollback services. Their Dockerfiles expect the parent repository as build context.
- The pull deploy runs `git submodule sync --recursive` and `git submodule update --init --recursive --checkout` after the parent fast-forward and before service classification/build. Keep this fail-closed ordering and classify `.gitmodules` changes as full deploy configuration changes.
- The webhook deploy classifies changes against `/var/lib/portfolio-webhook/last-successful-deploy`, written only after a successful deployment. Preserve that state across failed retries; comparing against the checked-out `HEAD` silently skips a revision after a failed deploy.
- Public, Links, and NGL production containers use Node 22 slim images, so their Compose healthchecks must use Node's built-in `fetch`, never `bun`.
- The production RAG image contains compiled entrypoints only. Build `src/db-bootstrap.ts` into `dist/db-bootstrap.js` and invoke that artifact from `rag-bootstrap`; Admin migrations remain the schema owner.
- When adding a prod service, also add it to `ALL_SERVICES` in `scripts/docker-prod-up.sh`. That array is explicit, and a service missing from it is never built, deployed, or tracked for image rollback by the webhook deploy.
- `scripts/docker-prod-up.sh` builds production images one at a time by default (`PROD_BUILD_PARALLEL=1`); Admin's Next.js build was SIGKILLed on the shared production host when Compose built multiple heavy images in parallel. Only raise this after measuring server memory headroom.
- `apps/live-presence` has no external package dependencies. Its Dockerfile and both Compose build contexts are app-local so the service can be extracted and built independently; do not reintroduce root workspace installation there.
- Cron run time is configurable via `ADMIN_CRON_AT` (`HH:MM` in Asia/Jakarta, default `02:00`). Verify scheduler changes by actually running the extracted `command` in a container against a stub, then checking both the fire time and the failure path; `docker compose config` shows `$$` purely as re-escaping and proves nothing.
