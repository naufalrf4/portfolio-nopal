# AGENTS.md

Authoritative AI control contract for this repository.

## 1. Project Context

- **Name:** `apps/ngl-svelte`
- **Purpose:** serve the anonymous-message experience for the portfolio ecosystem
- **Architecture:** SvelteKit 2 application that submits public messages to Admin APIs with Turnstile protection
- **Execution Model:** runs independently from `apps/ngl-svelte`; stays API-only and delegates persistence to Admin
- **Critical Domains:** Turnstile validation, public-message flow, Admin API compatibility, legacy neumorphic visual consistency

## 2. Technology Baseline

- **Framework:** SvelteKit 2.50.2 with Svelte 5.51.0
- **Runtime:** Bun and Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 and existing light-neumorphic UI patterns
- **Package Manager:** Bun via `bun.lock`
- **Version Policy:** use versions resolved from `package.json` and `bun.lock`; never guess from memory
- **State Management:** Svelte stores/components and app-local route state only
- **Database / ORM:** none directly; consume Admin public APIs only
- **Testing Stack:** `bun run check`, `bun run lint`, `bun run build`; no dedicated automated test runner currently exists

## 3. Architecture and Structure Rules

- Stay API-only; this app must not connect directly to the database.
- Preserve the Turnstile-backed public submission flow rather than bypassing CAPTCHA when issues occur.
- Keep anonymous messaging isolated from admin/business logic by delegating persistence to Admin APIs.
- Preserve the light-neumorphic page shell already established in `src/routes/+page.svelte`.

## 4. Operational Command Set

- **Install:** `bun install`
- **Dev:** `bun run dev`
- **Build:** `bun run build`
- **Test:** no dedicated automated test command is defined in `package.json`
- **Lint:** `bun run lint`

## 5. Git Workflow Rules

- **Branch Strategy:** not codified locally; default to the user's current branch unless instructed otherwise
- **Review Flow:** not codified locally; do not assume auto-PR work
- **Auto-Commit:** forbidden unless the user explicitly asks
- **Auto-Push:** forbidden unless the user explicitly asks
- **Push Identity:** use only the user's identity
- **Co-Authors:** forbidden unless the user explicitly asks otherwise
- **Ignored Local Agent Artifacts:** inherit `../../AGENTS.md`

## 6. Agent Behavior

- Read this file, `../../AGENTS.md`, `../../PROGRESS.md`, `../../.context/ui-design/legacy-phase2-baseline.md`, and relevant `../../.context/base/*` files before planning or coding.
- Do not guess missing API, CAPTCHA, or design rules that are not evidenced in repo files.
- Keep changes scoped to this app unless an Admin contract or shared rule explicitly requires a cross-app update.
- Preserve existing behavior unless the user asks for a change or a documented contradiction must be repaired.
- Update `../../.context/` and this file when a task reveals durable NGL-specific knowledge.
- Append a factual entry to `../../PROGRESS.md` after meaningful milestones, decisions, or discoveries.
- Do not add co-author trailers, assistant attribution, or alternate authorship metadata on the user's behalf.
- Run `bun run check`, `bun run lint`, and `bun run build` after meaningful code changes.

## 7. Authority Order

1. this file
2. `../../AGENTS.md`
3. `../../.context/`
4. explicit user instruction that does not contradict verified project truth
5. repository code, manifests, env examples, and configs in this app

## 8. Self-Learn and Learned Rules

- Self-learn: add a short factual rule here when a task reveals a recurring NGL-specific quirk, submission caveat, or validation constraint.
- `src/lib/api.ts` posts to Admin `/api/v1/public/messages` and returns envelope-safe fallbacks.
- `src/routes/+page.svelte` assumes Turnstile may be unavailable and degrades by blocking submission, not by bypassing CAPTCHA.
- Turnstile-backed NGL delivery requires CSP allowances for `https://challenges.cloudflare.com`; blocking that origin breaks submission before the Admin API is reached.
- Use SvelteKit public env access (`$env/dynamic/public`) for public browser-exposed runtime config like Turnstile and GA in this app; `import.meta.env` is not reliable here for the current setup.
- NGL Turnstile stays visually hidden until the message field has content; when configured, avoid pre-typing helper copy and reveal the challenge only after user input starts.
- NGL first-party analytics now proxy through `src/routes/api/analytics/+server.ts`; keep pageview/submission telemetry same-origin and separate from GA snippets.
- `static/llms.txt` should follow the canonical section structure from `apps/public-astro/public/llms.txt`, but its content must stay specific to the anonymous-message surface rather than duplicating the full portfolio narrative.
