# E2E — API-only, local pre-deploy

Cross-app end-to-end checks that lock the security behaviour of this monorepo. No browser, no Playwright, no CI: this suite exists to be run locally before a deploy.

Stack is Bun-native only (`bun test` + `fetch` + `WebSocket`). It adds no runtime dependency.

## Run

```bash
bun run test:e2e                 # start missing services per feature, run everything, clean up
bun run test:e2e admin-cron      # one feature only
bun run test:e2e rag-chat presence
bun run test:e2e:specs           # services already running, skip orchestration
```

The runner reuses services that are already up (your `bun run dev:all` session is safe) and only starts what a selected feature actually needs. Services it started are stopped again on exit; services you started are left alone.

## Layout

```
e2e/
  runner.ts               orchestration: discover features -> start services -> bun test -> cleanup
  helpers/
    env.ts                loads .env.docker.dev + app .env files, normalizes ADMIN_* -> *
    http.ts               probe/postJson/waitForHealthy, never throws on non-2xx
    ws.ts                 minimal websocket session for presence
    services.ts           service registry: cwd, dev command, health url
  features/
    manifest.ts           shared FeatureManifest type
    <feature>/
      manifest.ts         name + required services (imported by the runner, no side effects)
      <feature>.spec.ts   the actual checks
```

`manifest.ts` is separate from the spec on purpose: the runner imports it to decide which services to boot, and importing a spec outside `bun test` would crash.

## Features

| Feature | Services | Locks |
|---|---|---|
| `admin-auth` | admin | admin tier gated; `POST /api/v1/admin/messages` never reaches the handler unauthenticated |
| `admin-cron` | admin | `cleanup-chatlogs` fail-closed without a valid bearer secret |
| `public-write` | admin | contact / analytics / guestbook schema bounds |
| `ip-spoofing` | public | client forwarding headers cannot dictate the trusted client IP |
| `presence` | presence | origin enforcement, oversized frames ignored, `/health` reveals only `{ok:true}` |
| `rag-chat` | rag | ingest auth, chat input bounds, agentic guardrails |
| `webhook` | webhook | unsigned payloads rejected, body size capped |

## Environment

`helpers/env.ts` reads, in order: `process.env`, then `.env.docker.dev`, `apps/admin/.env.local`, `apps/rag-service/.env`, `apps/live-presence/.env`. Docker-style `ADMIN_FOO` keys are also exposed as `FOO`, matching how the admin app reads them.

Specs that need a secret skip themselves with the reason printed instead of failing. Currently expected to skip unless you set them:

- `CRON_SECRET` — authorized-path check for the cron endpoint
- `PORTFOLIO_WEBHOOK_SECRET` — the whole webhook feature (its server is also not managed by the runner)

Override any base URL with `E2E_ADMIN_URL`, `E2E_PUBLIC_URL`, `E2E_RAG_URL`, `E2E_PRESENCE_URL`, `E2E_WEBHOOK_URL`.

## Adding a feature

1. `mkdir e2e/features/my-feature`
2. `manifest.ts` exporting `name`, `services`, `description`
3. `my-feature.spec.ts` that re-exports the manifest and guards on `await available(service)`

The runner picks it up with no registration step.

## Deliberate gaps

- `ipHash` HMAC output is not asserted here (needs DB reads); covered at unit level.
- Presence participant/room caps are not load-tested; the caps live in the server and would need a load harness.
- Real Google OAuth is not exercised — only negative paths and the local credentials provider.
