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
- Dokploy's existing stack now points to `naufalrf4/portfolio-deploy` on `main` at `./docker-compose.yml`; the existing server, project, environment, and Admin domain remain attached. A direct Presence domain mapping was removed.
- Dokploy v0.30.10's in-memory queue was blocked by two orphaned active jobs. The controller was restarted with Swarm `stop-first` after checking that neither host had a live build process; the latest Portfolio deployment and the already-queued MonevHub deployment were re-enqueued and both completed.
- New Dokploy stack `portfolio-platform-qhoghi` is healthy on the pinned Admin, RAG, and Presence images. RAG bootstrap and Admin migration/verification exited successfully (17/17 migrations). The old `portfolio-prod` app and sidecar containers are stopped as rollback standby; the separate Dokploy-managed Postgres service remains running. Traefik now routes only to the new stack.
- Direct-origin smoke checks passed for Admin, RAG, Presence, and allowed/blocked Presence WebSocket origins. The existing Cloudflare-proxied Admin domain was corrected and verified in the Ingress verification section below.
- Root integration changes were committed and pushed as `81272af`. A fresh recursive clone checked out all six exact pins, and root `bun install --frozen-lockfile` succeeded without installing Next.js.

## Migration completion state

The repository split, submodule pins, app-local dependency/build boundaries, Dokploy repository configuration, remote image rollout, migration gate, service health, and direct-origin WebSocket routing are complete and verified. Dokploy currently reads `naufalrf4/portfolio-deploy` from `main` at `./docker-compose.yml` and targets `MonevHub Production`. The old `portfolio-prod` containers are stopped as rollback standby; Postgres remains attached and running.

## Cross-deployment Live Presence follow-up

- Production Presence now explicitly allows the exact Pages origins `https://naufalrf.net`, `https://links.naufalrf.net`, and `https://ngl.naufalrf.net`; the live `live-presence` container was recreated from the Dokploy Compose checkout environment.
- `/presence/health` and `/presence/ws` both pass through the Admin Traefik router, which strips `/presence`. Public and Links now preserve the prefix; all three source commits are on their standalone `main` branches and current Cloudflare Pages production deployments point to those commits.
- Links and NGL now publish normalized pointer movement and render remote participant cursors. Production Pages for Public, Links, and NGL point to their updated commits; Admin's immutable image `47ce52b` is healthy in Dokploy.

## Public asset delivery

- `assets.naufalrf.net` is a Cloudflare Worker custom domain bound to the existing private R2 bucket, not a public R2 custom domain. It serves only image content from `about/`, `projects/`, and `achievements/` and rejects resume paths, traversal, other methods, and non-image objects.
- Admin `/api/v1/public/*` responses map eligible image keys to stable asset URLs while Admin APIs keep signed URLs and resume links remain signed. DB media keys remain unchanged. Two observed 403 external image references were cleared so existing fallbacks are used.
- Worker smoke checks: a production avatar object returned 206 `image/png`; resume and traversal requests returned 404. All 29 production public API image/resume URLs returned 2xx after rollout.

## Ingress verification

Using the Headscale workstation browser at CDP `100.64.0.4:9222`, the existing `admin.naufalrf.net` A record was updated from the retired origin to the current VPS origin, preserving Cloudflare proxying and Auto TTL. The unused `presence.naufalrf.net` A record was removed; Presence remains routed under Admin at `/presence`. Public checks now pass: Admin session endpoint 200, home redirects to login (307), Presence WebSocket 101 for an allowed origin and 403 for an untrusted origin. No public CDP subdomain or port was created; the browser remains private to Headscale.

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
