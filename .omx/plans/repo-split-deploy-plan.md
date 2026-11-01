# Repo split and deployment plan

## Target structure

Keep four independently deployable repositories:

| Repository | Apps | Hostname(s) | Hosting | Responsibility |
|---|---|---|---|---|
| `portfolio-nopal` (current root repo) | Admin + RAG + Live Presence | `admin.naufalrf.net`, `presence.naufalrf.net` | VPS / Docker Compose | Admin owns content APIs and Postgres authority; RAG retains its approved DB role; Presence stays a separate Bun WebSocket process/container with in-memory presence state. |
| `portfolio-public` | Public Astro | `naufalrf.net` | Cloudflare Pages | Public pages and server-side calls to Admin, including RAG chat through Admin's proxy. |
| `portfolio-links` | Links Astro | `links.naufalrf.net` | Cloudflare Pages | Link/profile pages, Admin API and Presence WebSocket consumer. |
| `portfolio-ngl` | NGL Svelte | `ngl.naufalrf.net` | Cloudflare Pages | NGL submission UI; Admin remains the API authority. |

Cloudflare Pages is the first target for all three frontends. Vercel is a fallback only if a real Pages preview fails a required route or runtime check. No feature requires running both providers. Keep the presentation/Slide Deck app and its Public route removed per user direction.

Keep the current root repository (`naufalrf4/portfolio-nopal`) as the VPS backend and local integration repo; it owns Admin, RAG, Presence, shared packages, Compose, migrations, and pull-based deploy scripts. Three independent frontend repositories are pinned as submodules at their existing app paths and deploy directly to Pages from their own remotes. VPS Compose can build the same pinned app commit independently as a rollback path. Presence remains in the root repo and in its own container.

## Ownership and invariants

- Public, Links, and NGL call Admin over HTTPS and have no database credentials.
- Admin is the content/API authority. RAG chat and confirmation from Public go through the Admin public proxy; RAG's database remains private. Ingest remains an internal Admin-to-RAG path.
- Browser bundles contain no Admin/RAG service tokens. Presence exposes only its public WebSocket URL and enforces an explicit origin allowlist.
- Backend changes are deployed compatibly first; independent frontend repos consume additive API changes afterward. Remove old API behavior only after all consumers move.
- Initially snapshot the four small workspace packages (`tsconfig`, `design-tokens`, `http`, `contracts`) into each frontend repo with source revision recorded. This is a fast extraction tactic with drift risk; later publish versioned packages if duplication becomes costly. Do not retain unresolvable `workspace:*` dependencies in standalone manifests.
- Root Compose remains functional during migration. Remove public frontend containers from VPS only after the corresponding Cloudflare production hostname is accepted and rollback is documented.

## Implementation status

| Area | Status | Evidence / remaining gate |
|---|---|---|
| Remove Slide Deck | Implemented locally | App, `/portfolio` route, sync script, build/dev hooks, Docker copies and docs references removed. |
| Cloudflare and VPS adapters | Implemented | `CF_PAGES=1` selects the Cloudflare adapter; normal root/Docker builds select Node adapters. Both targets build successfully. NGL preview flags now match production (`nodejs_compat`, `url_standard`). |
| Standalone deploy metadata | Implemented and pushed | Each remote has `DEPLOYMENT.md`, standalone `bun.lock`, Cloudflare output settings, pinned Bun 1.4.3, and non-secret runtime values in `wrangler.toml`. Public's stale direct RAG URL example was removed. Local secret files are ignored; NGL CSP derives the Presence origin from its configured URL. |
| Shared package snapshots | Pushed to child repos | Each frontend repo contains the four workspace package snapshots and their source revision record. |
| Public RAG boundary | Implemented locally | Public calls Admin proxy; Admin rate-limits/bounds and authenticates to RAG; RAG chat/confirm require service token. Local smoke returned expected authorization and validation statuses. |
| Backend co-location | Existing repo/runtime retained | Admin, RAG, Presence remain in root VPS deployment. Presence Docker build is app-local and process/container separate. |
| Git remotes | Complete | Public: `naufalrf4/portfolio-public`; Links: `naufalrf4/portfolio-links`; NGL: `naufalrf4/portfolio-ngl`. All are public GitHub repos, default branch `main`, and connected to Pages Git integration. Root pins the accepted SHAs as submodules. |
| Cloudflare Pages main deployments (`pages.dev`) | Partial | `naufalrf-public`, `naufalrf-links`, and `naufalrf-ngl` are Git-integrated and latest builds succeeded. Links and NGL homepages return 200. Public intentionally returns 503 when its SSR Admin API request times out at `https://admin.naufalrf.net`. NGL's SSR initially returned `Invalid URL string`; adding the Pages-compatible `url_standard` flag resolved it. |
| Secrets and integration | Waiting on production values / reachability | `ADMIN_INTERNAL_API_TOKEN` and the public Turnstile site key were not available in this checkout and were not guessed. A request from Pages to Admin timed out; the same Admin hostname also timed out from this environment. |
| Submodules and VPS checkout | Implemented locally | Frontend remotes are pinned at their existing `apps/*` paths; root clone instructions and pull deploy initialization are in place. VPS Compose builds from each submodule with production-only runtime dependencies. |
| Custom domains and VPS cutover | Blocked by origin health/config | No custom hostname or DNS record has been changed. Admin and Presence return 522, Public Pages returns 503 on Admin timeout, and required Turnstile Pages keys are unset. Keep traffic on the existing VPS route until these are corrected and production smoke/rollback pass. |

## Phases and starting point

Start in this root repository (`naufalrf4/portfolio-nopal`). Keep its current VPS deployment path working while creating three frontend remotes. Do not move Admin, RAG, Presence, database ownership, migrations, cron, or deployment scripts out of this repo.

| Phase | Work | Completion gate |
|---:|---|---|
| 1. Stabilize current changes | Build each filtered frontend scratch repo from its own manifest/lockfile; validate Compose and diff; fix adapter/config issues. | Each clean extracted workspace builds without root workspace files; root Compose still parses. |
| 2. Finalize child repo contents | Copy the prepared app code, package snapshots, provenance, lockfile, deployment guide, and standalone-compatible `AGENTS.md`; omit monorepo-context Dockerfiles from frontend repos. Re-run clean frozen install/build from each candidate. | Child repo contents can be committed/pushed without depending on parent files. |
| 3. Create Git remotes | Create one GitHub remote per frontend from the prepared filtered histories; push reviewed child commits under the user's identity. | Fresh clone + install + build succeeds from each pushed commit. |
| 4. Create Pages Git-integrated projects | Connect each Pages project directly to its child remote at project creation; use app-specific build command/output, `BUN_VERSION=1.4.3`, runtime env/secrets and bindings. Validate Preview SSR/API, auth, origins, Turnstile, media, RAG proxy and Presence WS. Resolve Astro SESSION KV behavior. | All required Preview flows work; no service token in browser assets; rollback is available. |
| 5. Cut over frontend hosts | Point `naufalrf.net`, `links.naufalrf.net`, `ngl.naufalrf.net` to accepted Pages projects; retain Admin/Presence DNS on VPS. Keep VPS frontend services until production smoke and rollback are proven. | All three production hostnames pass smoke and rollback is ready. |
| 6. Maintain independent app deploys | Done for current architecture | Frontend repos deploy directly to Pages; VPS pulls the root repo, initializes pinned submodules, and may rebuild the fallback frontend containers from each pinned app repo. A child repo push updates Pages, while VPS advances only after its root gitlink is updated. |

## Cloudflare build/runtime configuration

- Public Astro: Cloudflare adapter, Pages output `dist`; verify SSR routes including chat/confirm, contact, guestbook, booking, analytics, auth redirects, media and runtime Admin URL.
- Links Astro: Cloudflare adapter, Pages output `dist`; verify Admin profile/analytics APIs and Presence WebSocket from the deployed origin.
- NGL Svelte: Cloudflare adapter, output `.svelte-kit/cloudflare`; verify submissions, Turnstile verification, telemetry/log shipping, and runtime bindings.
- Keep secrets in server-side Pages variables. Browser-visible values are limited to public keys and public service URLs.
- The installed Wrangler runtime supports compatibility date `2026-10-30`; update only when the installed Wrangler/workerd supports the newer date.
- Pin Pages' build image with `BUN_VERSION=1.4.3`; `nodejs_compat` plus the current compatibility date makes configured Worker variables available through `process.env`.
- Cloudflare local builds/`wrangler pages dev` are not a substitute for an authenticated Pages preview or production hostname test.

## Backend deployment shape

The existing `portfolio-nopal` repo owns the VPS backend and pins Public, Links and NGL submodules for local workspace/dev plus optional VPS rollback builds. Frontend repos deploy directly to Pages; the root webhook fetches the exact pinned commits before scoped Compose builds. The app images use app-local lockfiles and do not install the whole root workspace. A frontend commit does not change the VPS until the root repo's gitlink is advanced.

## External blockers and risks

- The Pages projects are build-ready, but Public runtime health still depends on `admin.naufalrf.net` being reachable. The Admin endpoint timed out during the Pages SSR smoke check.
- `ADMIN_INTERNAL_API_TOKEN` for server-side log shipping and the public Turnstile widget key remain unset because their actual values were not available locally. Store secrets in Pages settings; do not put them in Wrangler files.
- The three Pages projects currently have only their `pages.dev` domains. DNS/custom-domain traffic and VPS Compose remain unchanged until a real production-hostname check and rollback sequence are ready.
- Astro 5 Cloudflare adapter selects a default `SESSION` KV driver. Neither app currently calls Astro's session API and local SSR smoke worked without a KV binding; add one only if session use is introduced.
- Create Pages projects with Git integration from the child remotes; Cloudflare Direct Upload projects cannot later be converted to Git-integrated projects.
- Snapshot packages duplicate source. Keep each snapshot's source commit documented and compare before coordinated shared-contract changes.
- Existing VPS public frontends should not be removed until Pages production traffic is verified and rollback is ready.

## External platform references

- Astro Cloudflare integration and default KV session driver: https://docs.astro.build/en/guides/integrations-guide/cloudflare/
- Cloudflare Pages build image and Bun version selection: https://developers.cloudflare.com/pages/configuration/build-image/
- Cloudflare runtime environment variables and `process.env`: https://developers.cloudflare.com/workers/configuration/environment-variables/
- Cloudflare Pages Astro deployment: https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/
- Cloudflare Pages SvelteKit deployment: https://developers.cloudflare.com/pages/framework-guides/deploy-a-svelte-kit-site/
- Cloudflare Direct Upload project limitation: https://developers.cloudflare.com/pages/get-started/direct-upload/

## Stop condition

The repository split is implemented locally when three frontend remotes independently build, the root repo pins their exact SHAs as submodules for local integration, and Admin+RAG+Presence remain operable from the VPS repo. Production cutover stays incomplete until Admin/Presence origin health, Pages secrets/Turnstile, custom hostnames, and end-to-end flows pass; keep the existing VPS frontend services available for rollback until then.
