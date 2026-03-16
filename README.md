# NaufalRF Apps Repository

This root is only a repository shell for standalone apps under `apps/*`.

## Apps

| App              | Path                | Framework          | Default Port | Notes                            |
| ---------------- | ------------------- | ------------------ | ------------ | -------------------------------- |
| Public portfolio | `apps/public-astro` | Astro 5 + React    | 3000         | Standalone public site           |
| Admin            | `apps/admin`        | Next.js 16         | 3001         | Standalone CMS and API authority |
| Links            | `apps/links-astro`  | Astro 5 + React    | 3002         | Standalone links page            |
| NGL              | `apps/ngl-svelte`   | SvelteKit 2        | 3003         | Standalone anonymous message app |
| RAG service      | `apps/rag-service`  | FastAPI + pgvector | 3005         | Standalone AI/chat service       |

## Root Intent

- Root is not a package workspace
- Each app owns its own runtime, app scripts, and dependency install state, while root keeps lightweight repo-wide tooling such as hooks and lint config
- Cross-app communication should happen through HTTP APIs and service tokens
- Start, install, and build each app from its own directory

## App Setup

```bash
cd apps/admin && bun install
cd apps/public-astro && bun install
cd apps/links-astro && bun install
cd apps/ngl-svelte && bun install
cd apps/rag-service/fastapi && uv sync
```

## Example App Commands

```bash
cd apps/admin && bun run dev
cd apps/public-astro && bun run dev
cd apps/links-astro && bun run dev
cd apps/ngl-svelte && bun run dev
cd apps/rag-service && bun run dev
```

## Root Helper Scripts

```bash
bun run dev:all
bun run reset:seed
```

- `bun run dev:all` starts the five local app runtimes together from the repo root.
- `bun run reset:seed` resets Admin and RAG app data, seeds Admin content from `data/`, then triggers the existing Admin -> RAG ingest flow.

## App Environments

Create env files per app, not at the root runtime layer:

```bash
cp apps/admin/.env.example apps/admin/.env.local
cp apps/public-astro/.env.example apps/public-astro/.env
cp apps/links-astro/.env.example apps/links-astro/.env
cp apps/ngl-svelte/.env.example apps/ngl-svelte/.env
cp apps/rag-service/fastapi/.env.example apps/rag-service/fastapi/.env
```

## Notes

- `apps/admin` remains the primary content and API authority for application data
- `apps/rag-service` reads and writes the centralized Neon/Postgres database through its own `rag` schema and also calls Admin internal APIs for service-to-service coordination
- Any deployment/runtime infrastructure should live with the individual app, not at the repository root
