# Standalone app repositories and Dokploy deployment

## Target architecture

The root repository is an integration shell: it pins six independent app repositories as submodules, keeps root-only cross-app E2E tooling and shared integration packages, and does not install app dependencies in one workspace. Every app owns its dependency graph, lockfile, build, CI, and deploy surface.

| Repository | Source/deploy responsibility |
|---|---|
| `portfolio-admin` | Next.js content/API authority, migrations, seed data, and Admin image |
| `portfolio-rag` | Bun/Hono RAG API and image; approved direct Postgres access |
| `portfolio-presence` | Dependency-free WebSocket service and image |
| `portfolio-public` | Astro public portfolio on Cloudflare Pages |
| `portfolio-links` | Astro link hub on Cloudflare Pages |
| `portfolio-ngl` | SvelteKit anonymous messages on Cloudflare Pages |
| `portfolio-deploy` | Image-only VPS Compose, immutable image pins, migration/bootstrap, and rollback |
| `portfolio-nopal` | Pinned integration checkout, E2E tooling, shared integration packages, and docs |

Production remains one Dokploy-managed Compose project on the already configured remote server. Admin is the only public hostname; Presence uses the existing `/presence` WebSocket route; RAG remains private. PostgreSQL remains managed by Dokploy. Do not add DNS for internal service links or create a second deployment project.

## Completed

- All six standalone app repositories exist and are pinned as submodules in the local integration checkout.
- Admin, RAG, and Presence image workflows publish SHA-tagged GHCR images. Candidate images have been pulled and the production Admin/RAG/Presence stack was previously verified healthy; Admin API returned 200, RAG/Presence health returned 200, and Presence accepted the configured origin and rejected an untrusted origin.
- Admin seed data now lives inside `portfolio-admin`; its seed path works from the standalone repository root.
- Root workspace excludes `apps/*`; root lockfile now contains only root integration/E2E workspaces. App dependency installs and Docker contexts are per-repository.
- Admin and RAG Dockerfiles have app-local development targets. Root dev Compose mounts each submodule and uses separate dependency volumes.
- Dokploy read-only inspection found the existing project `Portfolio` and stack `Portfolio Platform`, configured with auto-deploy and an existing remote server target.
- The temporary HMAC receiver, route, and firewall exception were removed. Dokploy is the deployment controller.
- Dokploy's existing stack now points to `naufalrf4/portfolio-deploy` on `main` at `./docker-compose.yml`; the existing server, project, environment, and Admin domain remain attached. A direct Presence domain mapping was removed; DNS was not changed.
- The initial Dokploy deployment API request returned HTTP 200, but Dokploy currently reports the Compose stack as idle and the deployment queue has waiting jobs. Do not treat the deployment as complete until the queue starts and health checks pass.

## Remaining gates

1. **Prove root independence.** Root `bun install --frozen-lockfile` and `bun run install:apps admin` passed; root has no Next CLI while Admin has its own CLI. Check the remaining apps' lock/install metadata and verify E2E still resolves root package snapshots and app paths.
2. **Complete Dokploy deployment.** Source now targets `naufalrf4/portfolio-deploy`; verify the queued run reads the new Compose file and finishes. Its dependency graph requires RAG bootstrap, Admin migrations, and migration verification before Admin/RAG runtime. Failed steps must block dependent runtime replacement.
3. **Verify production through Dokploy.** Check migration result, Admin API, RAG and Presence health, WebSocket origin handling, cron, logs, and that the existing Postgres data remains attached. Keep the prior image pins available for rollback.
4. **Publish the integration root.** Commit and push the root submodule pointers, shell-only workspaces, app-local Compose contexts, and updated docs after local checks. A fresh recursive clone must reproduce the pinned app commits and root E2E setup.

## Build/resource rules

- Build only the changed app for normal work. `bun run build:all` is an explicit sequential integration build.
- Root `bun install` is for root E2E/integration tooling only. `bun run install:apps` installs each app sequentially from its own lockfile.
- Admin's normal Next build works without `--debug-prerender`; do not restore the debug flag unless a normal production build reproduces an upstream prerender failure.
- Admin image compilation stays in CI on Node 22 with a bounded heap. VPS production Compose pulls immutable images and does not compile Next.js.
- Shared package copies in each app repo are intentional to keep builds independent. Keep their API/design contracts in sync with root copies.

## Runtime invariants

- Admin owns application schema and migrations. RAG bootstrap prepares RAG-specific database requirements first; Admin migration and verification run before runtime starts.
- Admin and RAG communicate over private APIs; RAG retains only its approved Postgres scope. Public/Links/NGL never connect to Postgres.
- Presence is ephemeral and persistence-free. The browser URL remains `wss://admin.naufalrf.net/presence/ws`; do not add a separate Presence hostname.
- All server-decided calendar behavior stays pinned to `Asia/Jakarta`; timestamps representing instants remain UTC instants.
