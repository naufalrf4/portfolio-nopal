# Service Boundaries

## Cross-app contract model

- `apps/admin` is the central HTTP API authority.
- `apps/public-astro`, `apps/links-astro`, and `apps/ngl-svelte` are consumers of Admin APIs.
- `apps/rag-service` is both a direct database actor and an internal API consumer.

## Observed API consumers

- `apps/public-astro/src/lib/api.ts` -> Admin public endpoints for about, projects, blogs, achievements, guestbook
- `apps/public-astro/src/pages/api/auth/sync.ts` -> Admin public auth sync endpoint
- `apps/links-astro/src/lib/api.ts` -> Admin public about and links endpoints
- `apps/ngl-svelte/src/lib/api.ts` -> Admin public messages endpoint
- `apps/admin/src/lib/services/ragIngest.ts` -> RAG `/ingest` endpoint using `X-Service-Token`

## Boundary rules

- Public, Links, and NGL must stay API-only consumers.
- Admin owns public, admin, and internal API contracts.
- RAG may use direct database access only for approved retrieval and ingestion paths plus internal Admin coordination.
- Internal service-to-service calls must use explicit tokens, not anonymous trust.
- When changing an Admin API contract, update every known consumer app in the same task.

## Contract-sensitive areas

- `/api/v1/public/*` response envelopes and content models
- `/api/v1/public/auth/sync`
- `/api/v1/public/messages`
- RAG `/chat` and `/ingest` request/response envelopes
- `X-Service-Token` handling between Admin and RAG
