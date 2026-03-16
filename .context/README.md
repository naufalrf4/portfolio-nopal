# Context README

This directory is the durable source of truth for project steering in the `naufalrf-portfolio` repository shell.

Use it in this order:

1. Read the nearest `AGENTS.md` for the app you are touching.
2. Read the root `AGENTS.md` for cross-app rules.
3. Read `.context/base/*` for repo-wide truth.
4. Read optional context files only when the task touches that area.

Included sections:

- `base/` - required repo-wide truth for architecture, workflow, testing, maintenance, and security.
- `ui-design/legacy-phase2-baseline.md` - required because the user explicitly wants the unfinished apps to follow `../naufalrf-portfolio-phase2` page, component, and visual patterns end to end.
- `integrations/service-boundaries.md` - required because this repo is a multi-app shell with strict API and database boundaries that future agents should not rediscover.

Intentionally omitted for now:

- `copywriting/` - no durable voice or editorial brief was confirmed yet.
- `domain/` - business/domain glossary is still implicit in code and not yet stabilized.
- `data-model/` - schema ownership is documented in `base/architecture.md` and `base/security.yaml`; a dedicated data-model area is not yet justified.
- `operations/` - deployment and observability conventions are not yet explicit enough in this repo shell.
- `product/` - roadmap and personas are only partially implied by the unfinished codebase.

Known contradiction that was repaired during initialization:

- The root `README.md` previously implied that `apps/rag-service` used API-only integration. The app-local FastAPI evidence and user instruction show direct database access to the centralized Neon/Postgres instance through the `rag` schema, plus Admin internal API calls.
