# Service Boundaries

## Cross-app contract model

- `apps/admin` is the central HTTP API authority.
- `apps/public-astro`, `apps/links-astro`, and `apps/ngl-svelte` are consumers of Admin APIs.
- `apps/live-presence` is a standalone websocket service consumed by Public, Links, and NGL from their independent deployments. The clients use `wss://admin.naufalrf.net/presence/ws`; its health check is `https://admin.naufalrf.net/presence/health` so Traefik can strip the `/presence` prefix for both routes.
- Public image API values use `https://assets.naufalrf.net/<key>`; a Cloudflare Worker reads approved image prefixes from the private R2 bucket, while resumes stay on signed URLs and DB keys remain canonical.
- `apps/rag-service` is both a direct database actor and an internal API consumer.

## Observed API consumers

- `apps/public-astro/src/lib/api.ts` -> Admin public endpoints for about, projects, blogs, achievements, guestbook
- `apps/public-astro/src/pages/api/auth/sync.ts` -> Admin public auth sync endpoint
- `apps/public-astro/src/pages/api/rag/chat.ts` and `chat/confirm.ts` -> Admin public RAG proxy; only Admin calls the private RAG service
- `apps/public-astro`, `apps/links-astro`, and `apps/ngl-svelte` -> `apps/live-presence` websocket rooms for cross-project presence
- `apps/links-astro/src/lib/api.ts` -> Admin public about and links endpoints
- `apps/ngl-svelte/src/lib/api.ts` -> Admin public messages endpoint
- `apps/admin/src/lib/services/ragIngest.ts` -> RAG `/ingest` endpoint using `X-Service-Token` carrying `RAG_INGEST_SERVICE_TOKEN` (env alias `ADMIN_SERVICE_TOKEN` also accepted)
- `apps/rag-service/src/admin-client.ts` -> Admin internal APIs using `X-Service-Token` carrying `ADMIN_INTERNAL_API_TOKEN`

## Boundary rules

- Public, Links, and NGL must stay API-only consumers.
- Live presence must stay ephemeral and must not become a database actor or Admin API proxy.
- Admin owns public, admin, and internal API contracts.
- RAG may use direct database access only for approved retrieval and ingestion paths plus internal Admin coordination.
- Internal service-to-service calls must use explicit tokens, not anonymous trust.
- Dokploy's `PRESENCE_ALLOWED_ORIGINS` must list each production Pages origin exactly (`https://naufalrf.net`, `https://links.naufalrf.net`, `https://ngl.naufalrf.net`); add an exact origin whenever another app hostname is introduced.
- Presence clients must send pointer movement and render remote positions; connection status alone does not prove live cursors work.
- When changing an Admin API contract, update every known consumer app in the same task.

## Contract-sensitive areas

- `/api/v1/public/*` response envelopes and content models
- `/api/v1/public/auth/sync`
- `/api/v1/public/messages`
- Presence WebSocket `/presence/ws` and health `/presence/health` (Traefik strips `/presence` before forwarding)
- RAG `/chat`, `/chat/confirm`, and `/ingest` request/response envelopes
- `X-Service-Token` handling between Admin and RAG (`RAG_INGEST_SERVICE_TOKEN` for Admin->RAG, `ADMIN_INTERNAL_API_TOKEN` for RAG->Admin)
