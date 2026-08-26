# Context README

This directory is the durable source of truth for project steering in the `naufalrf-portfolio` repository shell.

Use it in this order:

1. Read the nearest `AGENTS.md` for the app you are touching.
2. Read the root `AGENTS.md` for cross-app rules.
3. Read `.context/base/*` for repo-wide truth.
4. Read optional context files only when the task touches that area.

Included sections:

- `base/` - required repo-wide truth for architecture, workflow, testing, maintenance, and security.
- `ui-design/design-contract.md` - required because the visual authority is now root `DESIGN.md` (dark-first, shared `@naufalrf/design-tokens`); the legacy phase2 neumorphic baseline was explicitly retired and future UI work must not regress to it.
- `integrations/service-boundaries.md` - required because this repo is a multi-app shell with strict API and database boundaries that future agents should not rediscover.

Intentionally omitted for now:

- `copywriting/` - no durable voice or editorial brief was confirmed yet.
- `domain/` - business/domain glossary is still implicit in code and not yet stabilized.
- `data-model/` - schema ownership is documented in `base/architecture.md` and `base/security.yaml`; a dedicated data-model area is not yet justified.
- `operations/` - deployment is now evidenced (`scripts/github_webhook_server.py`, `github-webhook-deploy.sh`, Docker/Dokploy compose) but still thin; fold into `base/workflow.yaml` until an operations story emerges.
- `product/` - roadmap and personas are only partially implied by the unfinished codebase.

Known contradiction(s) repaired during this run:

1. `ui-design/legacy-phase2-baseline.md` claimed light neumorphism from `../naufalrf-portfolio-phase2` was the visual baseline. Evidence: root `DESIGN.md` is now the authoritative dark-first cross-app design contract; commits `f70d51b`, `a61a7e9`, `cfaf77c` retired the phase2 baseline, renamed public-astro Neu* components to Card/Button/Badge/Input/Textarea, and kept `neu-*` in admin only as a naming layer over flat dark-first tokens. Replaced the file with `ui-design/design-contract.md` and updated AGENTS.md's legacy-phase2 rule.
2. `tech-stack.yaml` / `workflow.yaml` / `testing.yaml` described `apps/rag-service` as Python FastAPI with `uv`, `pytest`, `/docs`/`/redoc`, and a `fastapi/` directory. Evidence: commit `907aef6` rewrote it to TypeScript on Bun + Hono (`bun test`, `bun run db:bootstrap`, `bun x tsc --noEmit`); the `fastapi/` dir and asyncpg URLs are gone. All rag entries corrected.
3. `workflow.yaml` claimed no root build/install commands and per-app installs. Evidence: root `package.json` now declares `dev`, `build` (bun --filter chain), `lint`, `typecheck`, `docker:*` scripts; single root `bun.lock` is the only lockfile. Corrected.
4. AGENTS.md + old context claimed deployment via interactive `deploy.py` (Paramiko SSH). Evidence: `deploy.py` does not exist; deployment is now a GitHub webhook server (`scripts/github_webhook_server.py`, HMAC-verified) triggering pull-based `scripts/github-webhook-deploy.sh` -> `docker-prod-up` + `docker-prod-migrate`, with production DB as Dokploy-managed Postgres. AGENTS.md and workflow corrected.
5. Old context claimed `bun run reset:seed` was missing its backing script. Reality: root `package.json` `reset:seed` -> `bash ./scripts/docker-dev-reset-seed.sh`, which exists and works. Corrected.
6. `docker-compose.dev.yml` rag service was still FastAPI-era (`working_dir /app/fastapi`, `postgresql+asyncpg://` URL, `uv run python scripts/bootstrap_db.py`, `rag-venv-dev` volume) while prod was already migrated to the Bun/Hono stack. Repaired the dev compose rag + rag-bootstrap services to match the prod pattern (postgres:// URL, `bun run db:bootstrap`, repo mount, root-node-modules volume) and removed the stale `rag-venv-dev` volume.
7. `base/security.yaml` + `architecture.md` + `overview.md` said "centralized Neon/Postgres". Evidence: dev and prod compose both run dockerized `pgvector/pgvector` Postgres (prod Dokploy-managed at `DB_HOST:-db`); no Neon references remain in compose or env examples. Corrected.

Current repair notes:

- Root steering docs now treat `apps/live-presence` as a sixth standalone app in the shell rather than leaving it implicit in `PROGRESS.md` only.
- Root workflow truth now confirms `bun run dev:all` and `bun run reset:seed` (-> `bash ./scripts/docker-dev-reset-seed.sh`) are both working helpers.
