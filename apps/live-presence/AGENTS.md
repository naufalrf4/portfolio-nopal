# AGENTS.md

Authoritative AI control contract for this repository.

## 1. Project Context

- **Name:** `apps/live-presence`
- **Purpose:** serve lightweight realtime websocket presence for the public site cursor layer
- **Architecture:** standalone Bun websocket service with ephemeral in-memory presence only
- **Execution Model:** runs independently from the other apps and never connects to database or Admin APIs
- **Critical Domains:** low-latency presence updates, page-aware room routing, idle cleanup, graceful degradation, no persistence

## 2. Technology Baseline

- **Framework:** none; Bun native server/websocket runtime
- **Runtime:** Bun
- **Language:** TypeScript
- **Package Manager:** Bun
- **Container build:** `Dockerfile` builds from this app directory and does not install the root workspace; preserve that boundary when extracting the app repo.
- **Database / ORM:** none
- **Testing Stack:** no dedicated automated test command; verify via `bun run start`, `/health`, and browser/manual websocket QA

## 3. Architecture and Structure Rules

- Keep all presence state ephemeral and memory-only.
- Do not route realtime cursor traffic through Admin APIs.
- Keep the event contract minimal (`join`, `move`, `leave`, `ping`, `welcome`, `state`, `overview`).
- Presence is layout-wide across the public site, but rooms are page-specific (`/` -> `public-home`, other routes -> `public/<path>` style room ids).
- Participant state may include page and section metadata for presence rendering, but must never persist history.

## 4. Operational Command Set

- **Dev:** `bun run dev`
- **Start:** `bun run start`

## 5. Self-Learn and Learned Rules

- Local presence verification relies on `/health` plus at least one additional websocket client; do not trust only the homepage indicator.
- The service is designed for playful public presence, not durable messaging or gameplay state.
- Production websocket upgrades must enforce an explicit browser-origin allowlist; CORS does not protect the Bun websocket handshake.
- Keep `ALLOWED_ORIGINS` wired explicitly in both local Docker and production env examples so websocket origin policy does not depend on implicit runtime defaults.
