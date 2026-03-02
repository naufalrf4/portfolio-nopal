# Phase 2: Frontend App Migration (Astro + SvelteKit)

## TL;DR

> **Quick Summary**: Migrate 3 frontend apps from their current (incorrect) Next.js implementations to their intended frameworks — Astro 5 with React islands for the portfolio and links hub, SvelteKit 5 for the anonymous message app. New stub apps already exist; we build them out and delete the old Next.js apps when done.
>
> **Deliverables**:
>
> - `apps/public-astro` — Full portfolio site (Astro 5 + React islands, port 3000): home, about, projects, project detail, blogs, contact, ai-chatbot pages
> - `apps/links-astro` — Links hub (Astro 5, port 3002): profile links page
> - `apps/ngl-svelte` — Anonymous message app (SvelteKit 5, port 3003): message submission form
> - Old apps (`apps/public`, `apps/links`, `apps/ngl`) deleted, ALL `packages/*` workspace packages deleted, root workspace scripts updated
>
> **Estimated Effort**: XL
> **Parallel Execution**: YES — 7 waves, up to 9 tasks concurrent
> **Critical Path**: T1 → T2/T3/T4 → T5/T6/T7 → T8/T9/T10 → T11–T17 → T18/T19/T20 → T21 → T22 → T23 → T24 → T25 → F1–F4

---

## Context

### Original Request

Phase 2 of the monorepo build. All 3 frontend apps (`apps/public`, `apps/links`, `apps/ngl`) are currently Next.js but were designed to be Astro SSR + SvelteKit. Create new proper apps (`apps/public-astro`, `apps/links-astro`, `apps/ngl-svelte`) migrating all existing logic, then delete the old Next.js apps.

### Interview Summary

**Key Discussions**:

- Migration strategy: Astro React islands — existing React components from `apps/public/src/features/` reused as islands, no full rewrite
- `apps/ngl` → SvelteKit 5 (as originally specified in AGENTS.md)
- All 3 apps in one Phase 2 plan for maximum parallel execution
- Package manager: **bun everywhere** — never hardcode versions; pnpm-workspace.yaml stays for monorepo orchestration
- Phase 2 is read-only pages only; auth + interactive features deferred to Phase 3

**Research Findings**:

- All 3 stub apps already exist with clean scaffolds (Astro 5 / SvelteKit 5)
- `apps/links-astro` has a stray `package-lock.json` (npm artifact) — must be removed
- `apps/ngl-svelte` already uses bun (has `bun.lock`)
- Design system CSS lives in `apps/public/src/styles/globals.css` (neumorphism + Tailwind)
- New frontend apps use direct `fetch()` to Admin API — no `@naufalrf/sdk` workspace imports in new apps
- `apps/public` Next.js build passes — all React components are valid for island reuse

### Metis Review

**Identified Gaps** (addressed):

- Component portability audit added as Wave 0 (T1)
- `.env.example` creation added to T1
- Error handling patterns mandated in direct API client tasks (T8, T9, T10)
- Old app deletion deferred to final wave (T22) with pre-conditions
- Bun package manager enforcement made explicit in every setup task
- `package-lock.json` removal from `links-astro` added to T1

---

## Work Objectives

### Core Objective

Build production-ready Astro + SvelteKit apps that replace the incorrect Next.js implementations, preserving all existing page content and UX while using correct framework conventions.

### Concrete Deliverables

- `apps/public-astro/` — Astro 5 app, 7 pages, neumorphism design, direct API fetching, SEO
- `apps/links-astro/` — Astro 5 app, 1 page, neumorphism design, direct API fetching
- `apps/ngl-svelte/` — SvelteKit 5 app, 1 page, Tailwind, direct API integration
- `apps/public/`, `apps/links/`, `apps/ngl/` — DELETED
- Root `package.json` scripts updated for new app names

### Definition of Done

- [ ] `bun --cwd apps/public-astro run build` exits 0
- [ ] `bun --cwd apps/links-astro run build` exits 0
- [ ] `bun --cwd apps/ngl-svelte run build` exits 0
- [ ] All 7 public-astro pages respond HTTP 200
- [ ] Root `pnpm build` completes successfully after old apps deleted

### Must Have

- Astro React islands (`@astrojs/react`) for all interactive components in public-astro
- `@astrojs/node` SSR adapter for both Astro apps (self-hosted servers)
- Neumorphism design system CSS ported to all 3 apps
- Each new app has self-contained `src/lib/api.ts` — direct `fetch()` to Admin API, no `@naufalrf/*` workspace imports
- Server-side data fetching via direct fetch (Astro frontmatter / SvelteKit `load()`)
- Each new app defines its own local TypeScript interfaces matching Admin API response shapes
- ALL 6 `packages/*` workspace packages deleted (analytics, auth, config, sdk, types, ui) — dead dependencies confirmed via grep
- `.env.example` with `ADMIN_SERVICE_URL` + `ADMIN_SERVICE_TOKEN` in all 3 apps
- SEO metadata (title, description, OG, Twitter, JSON-LD) on all public-astro pages
- Graceful error fallback when SDK/API call fails (empty state, no crash)
- Old Next.js apps deleted in final cleanup task

### Must NOT Have (Guardrails)

- NO authentication implementation (NextAuth or any auth) — Phase 3
- NO new features not present in original Next.js apps
- NO rewrites of business logic — migrate as-is, adapt only for framework compatibility
- NO touching `apps/admin` or `apps/rag-service` source code — only `package.json` cleanup (removing dead `@naufalrf/*` deps) is allowed in T25
- NO hardcoded package versions anywhere
- NO `npm` or `yarn` commands — bun only for package installs
- NO `package-lock.json` or `yarn.lock` in any app
- NO deletion of old apps before all 3 new apps are verified working
- NO skipping the pre-migration audit (T1) — component portability must be confirmed first
- NO client-side data fetching for static content (projects list, blogs list, links) — server-side only
- NO `@naufalrf/sdk`, `@naufalrf/types`, `@naufalrf/ui`, `@naufalrf/config`, `@naufalrf/auth` imports in any new app
- NO new cross-app workspace package dependencies — each new app must be fully self-contained

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision

- **Infrastructure exists**: NO (no test files in any stub app)
- **Automated tests**: None — QA via agent-executed curl + Playwright scenarios
- **Framework**: N/A
- **Agent-Executed QA**: Playwright for UI, curl for HTTP checks, bash for build/file assertions

### QA Policy

Every task includes agent-executed QA scenarios. Evidence saved to `.sisyphus/evidence/task-{N}-{slug}.{ext}`.

- **UI pages**: Playwright — navigate, assert DOM content, screenshot
- **Build verification**: Bash — `bun run build`, check exit code
- **File existence**: Bash — `test -f path && echo OK`
- **HTTP smoke test**: Bash — `curl -s http://localhost:{port}/path | grep "expected"`

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 0 — Pre-migration audit + env setup (1 task, sequential prerequisite):
└── T1: Audit + pre-validation [quick]

Wave 1 — App config + integrations (3 parallel tasks):
├── T2: public-astro setup + integrations [unspecified-high]
├── T3: links-astro setup + integrations [quick]
└── T4: ngl-svelte setup + integrations [quick]

Wave 2 — Design system + layouts (3 parallel tasks):
├── T5: public-astro layouts + design system [visual-engineering]
├── T6: links-astro layout + design system [visual-engineering]
└── T7: ngl-svelte layout + design system [visual-engineering]

Wave 3 — Direct API client + data layer (3 parallel tasks):
├── T8: public-astro direct API client + typed fetchers [unspecified-high]
├── T9: links-astro direct API client [quick]
└── T10: ngl-svelte direct API client + form server action [unspecified-high]

Wave 4 — Pages (9 parallel tasks, MAX PARALLELISM):
├── T11: public-astro / home page [visual-engineering]
├── T12: public-astro / projects list page [visual-engineering]
├── T13: public-astro / project detail [slug] [visual-engineering]
├── T14: public-astro / about page [visual-engineering]
├── T15: public-astro / blogs page [visual-engineering]
├── T16: public-astro / contact page [visual-engineering]
├── T17: public-astro / ai-chatbot page [visual-engineering]
├── T18: links-astro / home page [visual-engineering]
└── T19: ngl-svelte / message form page [visual-engineering]

Wave 5 — SEO + metadata (3 parallel tasks):
├── T20: public-astro SEO (per-page meta, sitemap, robots, JSON-LD) [unspecified-high]
├── T21: links-astro SEO (meta, OG tags) [quick]
└── T22: ngl-svelte security headers + meta [quick]

Wave 6 — Workspace cleanup (3 sequential tasks):
├── T23: Update root package.json scripts for new app names [quick]
├── T24: Delete deprecated Next.js apps (public, links, ngl) [quick]
└── T25: Delete ALL packages/* + clean admin/rag-service dead deps [quick]

Wave FINAL — Independent review (4 parallel tasks):
├── F1: Plan Compliance Audit [oracle]
├── F2: Code Quality Review [unspecified-high]
├── F3: Real Manual QA — Playwright across all 3 apps [unspecified-high + playwright]
└── F4: Scope Fidelity Check [deep]

Critical Path: T1 → T2 → T5 → T8 → T11 → T20 → T23 → T24 → T25 → F1–F4
Parallel Speedup: ~75% faster than sequential
Max Concurrent: 9 (Wave 4)
```

### Dependency Matrix

| Task    | Depends On    | Blocks     |
| ------- | ------------- | ---------- |
| T1      | —             | T2, T3, T4 |
| T2      | T1            | T5, T8     |
| T3      | T1            | T6, T9     |
| T4      | T1            | T7, T10    |
| T5      | T2            | T11–T17    |
| T6      | T3            | T18        |
| T7      | T4            | T19        |
| T8      | T2            | T11–T17    |
| T9      | T3            | T18        |
| T10     | T4            | T19        |
| T11–T17 | T5, T8        | T20        |
| T18     | T6, T9        | T21        |
| T19     | T7, T10       | T22        |
| T20     | T11–T17       | T23        |
| T21     | T18           | T23        |
| T22     | T19           | T23        |
| T23     | T20, T21, T22 | T24        |
| T24     | T23           | T25        |
| T25     | T24           | F1–F4      |
| F1–F4   | T25           | —          |

### Agent Dispatch Summary

- **Wave 0**: 1 task → T1: `quick`
- **Wave 1**: 3 tasks → T2: `unspecified-high`, T3–T4: `quick`
- **Wave 2**: 3 tasks → T5–T7: `visual-engineering`
- **Wave 3**: 3 tasks → T8: `unspecified-high`, T9: `quick`, T10: `unspecified-high`
- **Wave 4**: 9 tasks → T11–T19: `visual-engineering`
- **Wave 5**: 3 tasks → T20: `unspecified-high`, T21–T22: `quick`
- **Wave 6**: 3 tasks → T23–T25: `quick`
- **Final**: 4 tasks → F1: `oracle`, F2: `unspecified-high`, F3: `unspecified-high` + `playwright`, F4: `deep`

---

## TODOs

---

- [x] T1. **Pre-migration audit + env setup** — `quick` | Wave 0 | Depends on: — | Blocks: T2, T3, T4

  **What to do**:
  1. Open `apps/public/src/features/` and inventory ALL React component files. For each, note whether it uses Next.js-specific APIs (`next/image`, `next/link`, `next/router`, `next/navigation`, `next/font`). Record in `.sisyphus/evidence/task-1-component-audit.md`.
  2. Delete `apps/links-astro/package-lock.json` — stray npm artifact that must not exist in a bun/pnpm monorepo.
  3. Verify all 3 stub apps exist with their scaffold: `apps/public-astro/astro.config.mjs`, `apps/links-astro/astro.config.mjs`, `apps/ngl-svelte/svelte.config.js`.
  4. Create `apps/public-astro/.env.example`:
     ```
     ADMIN_SERVICE_URL=http://localhost:3001
     ADMIN_SERVICE_TOKEN=
     PUBLIC_SITE_URL=http://localhost:3000
     PUBLIC_RAG_SERVICE_URL=http://localhost:3004
     ```
  5. Create `apps/links-astro/.env.example`:
     ```
     ADMIN_SERVICE_URL=http://localhost:3001
     ADMIN_SERVICE_TOKEN=
     ```
  6. Create `apps/ngl-svelte/.env.example`:
     ```
     ADMIN_SERVICE_URL=http://localhost:3001
     ADMIN_SERVICE_TOKEN=
     ```

  **Must NOT do**:
  - NO package installations — that happens in T2/T3/T4
  - NO deletion of any app directories — only delete `apps/links-astro/package-lock.json`
  - NO touching `apps/admin`, `apps/rag-service`, or any `packages/*`

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Pure file audit + create 3 small env files + delete 1 file. No complex logic.
  - **Skills**: []
  - **Skills Evaluated but Omitted**: `playwright` — no browser interaction needed for file audit.

  **Parallelization**:
  - **Can Run In Parallel**: NO — must complete before T2/T3/T4
  - **Parallel Group**: Wave 0 (sole task)
  - **Blocks**: T2, T3, T4
  - **Blocked By**: None (start immediately)

  **References**:
  - `apps/public/src/features/` — all React component directories to audit (source of truth for portability)
  - `apps/links-astro/package-lock.json` — the stray file to delete
  - `apps/admin/src/app/api/v1/public/` — reference to understand API endpoint paths for .env.example values

  **Acceptance Criteria**:
  - [ ] `test ! -f apps/links-astro/package-lock.json` — stray npm lockfile removed
  - [ ] `test -f apps/public-astro/.env.example` — env example created
  - [ ] `test -f apps/links-astro/.env.example` — env example created
  - [ ] `test -f apps/ngl-svelte/.env.example` — env example created
  - [ ] `test -f .sisyphus/evidence/task-1-component-audit.md` — audit document saved

  **QA Scenarios**:

  ```
  Scenario: All .env.example files contain ADMIN_SERVICE_URL
    Tool: Bash
    Preconditions: T1 tasks complete
    Steps:
      1. grep 'ADMIN_SERVICE_URL' apps/public-astro/.env.example apps/links-astro/.env.example apps/ngl-svelte/.env.example
    Expected Result: 3 matches (one per file)
    Evidence: .sisyphus/evidence/task-1-env-check.txt

  Scenario: package-lock.json removed from links-astro
    Tool: Bash
    Steps:
      1. test ! -f apps/links-astro/package-lock.json && echo '✅ removed' || echo '❌ still exists'
    Expected Result: '✅ removed'
    Evidence: .sisyphus/evidence/task-1-lockfile-check.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-1-component-audit.md` — inventory of Next.js-specific usages per component file
  - [ ] `.sisyphus/evidence/task-1-env-check.txt` — grep output confirming env vars present in all 3 files

  **Commit**: YES
  - Message: `chore(infra): pre-migration audit and env examples for new apps`
  - Files: `apps/public-astro/.env.example`, `apps/links-astro/.env.example`, `apps/ngl-svelte/.env.example`
  - Pre-commit: none required

---

- [x] T2. **public-astro: Astro integrations + project structure** — `unspecified-high` | Wave 1 | Depends on: T1 | Blocks: T5, T8

  **What to do**:
  1. `bun add @astrojs/react @astrojs/tailwind @astrojs/node @astrojs/sitemap react react-dom framer-motion lucide-react` inside `apps/public-astro/`
  2. `bun add -D @types/react @types/react-dom typescript` inside `apps/public-astro/`
  3. Update `apps/public-astro/astro.config.mjs`:
     - Import: `import react from '@astrojs/react'; import tailwind from '@astrojs/tailwind'; import sitemap from '@astrojs/sitemap'; import node from '@astrojs/node';`
     - Add to `integrations: [react(), tailwind(), sitemap()]`
     - Add `adapter: node({ mode: 'standalone' })`
     - Set `output: 'server'`
     - Set `site: process.env.PUBLIC_SITE_URL || 'http://localhost:3000'`
     - Set `server: { port: 3000 }`
  4. Create `apps/public-astro/tailwind.config.mjs` — neumorphism design config:
     - Content paths: `'./src/**/*.{astro,html,js,jsx,ts,tsx}'`
     - Custom `neu-*` shadow utilities from `.context/implementation/design-system.yaml`
     - OKLCH color tokens and `--neu-*` CSS variable references
     - Font family config: Plus Jakarta Sans, DM Sans, JetBrains Mono
  5. Update `apps/public-astro/tsconfig.json`: `"strict": true`, `"paths": { "@/*": ["./src/*"] }`
  6. Create directory structure under `apps/public-astro/src/`:
     - `components/layout/`, `components/shared/`, `components/home/`, `components/projects/`
     - `components/about/`, `components/blogs/`, `components/contact/`, `components/chatbot/`
     - `layouts/`, `pages/projects/`, `lib/`, `types/`, `styles/`

  **Must NOT do**:
  - NO `@naufalrf/*` entries in `package.json`
  - NO hardcoded package versions (no `bun add react@18.2.0` — just `bun add react`)
  - NO `npm install` or `yarn add`
  - NO `package-lock.json` or `yarn.lock` creation

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Multi-step Astro 5 config, tailwind v4 neumorphism setup, tsconfig paths. Requires deep framework knowledge.
  - **Skills**: []
  - **Skills Evaluated but Omitted**: `visual-engineering` — no UI rendering yet; `quick` — too complex for quick category.

  **Parallelization**:
  - **Can Run In Parallel**: YES — with T3, T4 (independent app setups)
  - **Parallel Group**: Wave 1 (with T3, T4)
  - **Blocks**: T5, T8
  - **Blocked By**: T1

  **References**:
  - `apps/public-astro/astro.config.mjs` — existing stub to update (not replace; preserve what's there)
  - `.context/implementation/design-system.yaml` — canonical `neu-*` shadow values, OKLCH tokens, font config to translate to tailwind.config.mjs
  - `apps/public-astro/tsconfig.json` — existing tsconfig to extend (not replace)
  - Astro node adapter docs: `node({ mode: 'standalone' })` required for Docker/self-hosted deployment

  **Acceptance Criteria**:
  - [ ] `bun --cwd apps/public-astro run build` exits 0
  - [ ] `grep '@astrojs/react' apps/public-astro/astro.config.mjs` returns match
  - [ ] `grep 'adapter-node' apps/public-astro/astro.config.mjs` returns match
  - [ ] `test ! -f apps/public-astro/package-lock.json`
  - [ ] `grep '@naufalrf' apps/public-astro/package.json || echo '✅ clean'` returns clean

  **QA Scenarios**:

  ```
  Scenario: public-astro builds after integrations added
    Tool: Bash
    Preconditions: bun dependencies installed
    Steps:
      1. bun --cwd apps/public-astro run build 2>&1 | tail -10
      2. echo "exit: $?"
    Expected Result: exit code 0, no TypeScript/config errors
    Evidence: .sisyphus/evidence/task-2-build-output.txt

  Scenario: No @naufalrf workspace imports in package.json
    Tool: Bash
    Steps:
      1. grep -c '@naufalrf' apps/public-astro/package.json || echo '0'
    Expected Result: 0 or 'no such pattern'
    Evidence: .sisyphus/evidence/task-2-no-shared-deps.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-2-build-output.txt` — build stdout/stderr
  - [ ] `.sisyphus/evidence/task-2-no-shared-deps.txt` — grep confirming no @naufalrf deps

  **Commit**: YES (groups with T3, T4)
  - Message: `chore(public-astro): add react/tailwind/node integrations and project structure`
  - Files: `apps/public-astro/astro.config.mjs`, `apps/public-astro/tailwind.config.mjs`, `apps/public-astro/tsconfig.json`, `apps/public-astro/package.json`
  - Pre-commit: `bun --cwd apps/public-astro run build`

---

- [x] T3. **links-astro: Astro integrations + project structure** — `quick` | Wave 1 | Depends on: T1 | Blocks: T6, T9

  **What to do**:
  1. `bun add @astrojs/tailwind @astrojs/node` inside `apps/links-astro/`
  2. `bun add -D typescript` inside `apps/links-astro/`
  3. Update `apps/links-astro/astro.config.mjs`:
     - Add integrations: `tailwind()`
     - Add adapter: `node({ mode: 'standalone' })`
     - Set `output: 'server'`
     - Set `server: { port: 3002 }`
  4. Create `apps/links-astro/tailwind.config.mjs` — same neumorphism config structure as T2 (copy from `.context/implementation/design-system.yaml`)
  5. Update `apps/links-astro/tsconfig.json`: `"strict": true`, `"paths": { "@/*": ["./src/*"] }`
  6. Create directory structure: `src/components/`, `src/layouts/`, `src/pages/`, `src/lib/`, `src/types/`, `src/styles/`

  **Must NOT do**:
  - NO `@astrojs/react` — links page is pure Astro, no React islands needed
  - NO `@naufalrf/*` dependencies
  - NO hardcoded versions, NO npm/yarn

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Same pattern as T2 but simpler — no React integration, fewer packages. 3 config files + directory creation.
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES — with T2, T4
  - **Parallel Group**: Wave 1 (with T2, T4)
  - **Blocks**: T6, T9
  - **Blocked By**: T1

  **References**:
  - `apps/links-astro/astro.config.mjs` — existing stub to update
  - `.context/implementation/design-system.yaml` — tailwind config source (same as T2)

  **Acceptance Criteria**:
  - [ ] `bun --cwd apps/links-astro run build` exits 0
  - [ ] `grep 'adapter-node' apps/links-astro/astro.config.mjs` returns match
  - [ ] `test ! -f apps/links-astro/package-lock.json`

  **QA Scenarios**:

  ```
  Scenario: links-astro builds after integration setup
    Tool: Bash
    Steps:
      1. bun --cwd apps/links-astro run build 2>&1 | tail -5
    Expected Result: exit code 0
    Evidence: .sisyphus/evidence/task-3-build-output.txt
  ```

  **Commit**: YES (groups with T2, T4)
  - Message: `chore(links-astro): add tailwind and node adapter`
  - Files: `apps/links-astro/astro.config.mjs`, `apps/links-astro/tailwind.config.mjs`, `apps/links-astro/tsconfig.json`, `apps/links-astro/package.json`

---

- [x] T4. **ngl-svelte: Vite/SvelteKit integrations + project structure** — `quick` | Wave 1 | Depends on: T1 | Blocks: T7, T10

  **What to do**:
  1. `bun add tailwindcss @tailwindcss/vite` inside `apps/ngl-svelte/`
  2. `bun add @sveltejs/adapter-node` inside `apps/ngl-svelte/`
  3. Update `apps/ngl-svelte/vite.config.ts` — add `@tailwindcss/vite` plugin:
     - Import: `import tailwindcss from '@tailwindcss/vite';`
     - Add to plugins array: `plugins: [tailwindcss(), sveltekit()]`
  4. Update `apps/ngl-svelte/svelte.config.js` — switch to node adapter:
     - `import adapter from '@sveltejs/adapter-node';`
     - `kit: { adapter: adapter() }`
  5. Create `apps/ngl-svelte/src/app.css`:
     - Line 1: `@import "tailwindcss";`
     - Lines 2+: paste the `:root { --neu-* ... }` block from `.context/implementation/design-system.yaml`
  6. Update `apps/ngl-svelte/src/routes/+layout.svelte` — import app.css in `<script>`: `import '../app.css';`
  7. Create `apps/ngl-svelte/src/lib/index.ts` (empty — establishes $lib alias)
  8. Create `apps/ngl-svelte/src/types/` directory

  **Must NOT do**:
  - NO `@naufalrf/*` dependencies
  - NO hardcoded versions, NO npm/yarn

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 3 config file edits + 2 new files. Straightforward adapter swap and CSS scaffold.
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES — with T2, T3
  - **Parallel Group**: Wave 1 (with T2, T3)
  - **Blocks**: T7, T10
  - **Blocked By**: T1

  **References**:
  - `apps/ngl-svelte/vite.config.ts` — existing stub to update
  - `apps/ngl-svelte/svelte.config.js` — existing stub to update
  - `apps/ngl-svelte/src/routes/+layout.svelte` — existing stub to add CSS import
  - `.context/implementation/design-system.yaml` — `--neu-*` CSS variable block to copy into app.css

  **Acceptance Criteria**:
  - [ ] `bun --cwd apps/ngl-svelte run build` exits 0
  - [ ] `grep 'adapter-node' apps/ngl-svelte/svelte.config.js` returns match
  - [ ] `test -f apps/ngl-svelte/src/app.css`
  - [ ] `grep '@import "tailwindcss"' apps/ngl-svelte/src/app.css` returns match

  **QA Scenarios**:

  ```
  Scenario: ngl-svelte builds after integration setup
    Tool: Bash
    Steps:
      1. bun --cwd apps/ngl-svelte run build 2>&1 | tail -5
    Expected Result: exit code 0
    Evidence: .sisyphus/evidence/task-4-build-output.txt
  ```

  **Commit**: YES (groups with T2, T3)
  - Message: `chore(ngl-svelte): add tailwind vite plugin and node adapter`
  - Files: `apps/ngl-svelte/vite.config.ts`, `apps/ngl-svelte/svelte.config.js`, `apps/ngl-svelte/src/app.css`, `apps/ngl-svelte/src/routes/+layout.svelte`

---

- [x] T5. **public-astro: Layouts + Design System** — `visual-engineering` | Wave 2 | Depends on: T2 | Blocks: T8, T11–T17, T20

  **What to do**:
  1. In `apps/public-astro/src/layouts/`, create `BaseLayout.astro` — accept `title`, `description`, `ogImage`, `canonicalUrl` props; render `<html lang="en">`, Google Fonts `<link>` (Inter + Space Grotesk from `.context/implementation/design-system.yaml`), global CSS import, named slot `<slot />`
  2. Create `PageLayout.astro` wrapping `BaseLayout.astro` with `<Navbar />` and `<Footer />` components and a `<FloatingBlobs />` background element
  3. Port `apps/public/src/features/layout/components/Navbar.tsx` → `src/components/layout/Navbar.astro` (static nav links only, no router hooks; replace `next/link` with `<a href>`, replace `next/image` with `<img>`)
  4. Port `apps/public/src/features/layout/components/Footer.tsx` → `src/components/layout/Footer.astro`
  5. Port `apps/public/src/features/layout/components/MobileBottomNav.tsx` → `src/components/layout/MobileBottomNav.tsx` (keep as React island — uses `usePathname`); wire with `client:load` in `PageLayout.astro`
  6. Port `apps/public/src/features/layout/components/FloatingBlobs.tsx` → `src/components/layout/FloatingBlobs.astro` (purely decorative, no interactivity — convert to Astro)
  7. Create `src/styles/globals.css` — port from `apps/public/src/styles/globals.css`; include OKLCH CSS variables from `.context/implementation/design-system.yaml` (neumorphism tokens: `--neu-bg`, `--neu-shadow-light`, `--neu-shadow-dark`, `--neu-surface`, etc.)
  8. Create `src/components/shared/NeuCard.tsx` (React island — may receive dynamic props) and `src/components/shared/NeuButton.tsx` (React island) porting from `apps/public/src/features/shared/components/`
  9. Run `bun --cwd apps/public-astro run build` — zero errors required

  **Must NOT do**:
  - Do NOT import `next/link`, `next/image`, `next/navigation`, or any `next/*` module
  - Do NOT import from `@naufalrf/*` workspace packages
  - Do NOT add authentication UI elements
  - Do NOT introduce new dependencies without `bun add`

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Core design system work — layout components, CSS tokens, neuromorphic shadows; requires visual taste and CSS precision
  - **Skills**: [`frontend-design`, `ui-ux-pro-max`]
    - `frontend-design`: Astro component authoring, layout architecture
    - `ui-ux-pro-max`: Neuromorphic design system token translation, shadow/gradient CSS
  - **Skills Evaluated but Omitted**:
    - `playwright`: No browser testing at this stage — build verification sufficient

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with T6, T7)
  - **Blocks**: T8, T11, T12, T13, T14, T15, T16, T17
  - **Blocked By**: T2

  **References**:
  - `apps/public/src/features/layout/components/Navbar.tsx` — source component to port (nav structure, link list, active detection)
  - `apps/public/src/features/layout/components/Footer.tsx` — source component to port
  - `apps/public/src/features/layout/components/MobileBottomNav.tsx` — keep as React island (uses `usePathname`)
  - `apps/public/src/features/layout/components/FloatingBlobs.tsx` — convert to static Astro (no hooks)
  - `apps/public/src/features/shared/components/` — NeuCard, NeuButton source
  - `apps/public/src/styles/globals.css` — design tokens source
  - `.context/implementation/design-system.yaml` — canonical OKLCH token values, shadow formulas, font stack

  **Acceptance Criteria**:
  - [ ] `ls apps/public-astro/src/layouts/` → contains `BaseLayout.astro`, `PageLayout.astro`
  - [ ] `ls apps/public-astro/src/components/layout/` → contains `Navbar.astro`, `Footer.astro`, `MobileBottomNav.tsx`, `FloatingBlobs.astro`
  - [ ] `ls apps/public-astro/src/styles/` → contains `globals.css` with `--neu-bg` variable defined
  - [ ] `bun --cwd apps/public-astro run build` → exits 0, zero TypeScript/Astro errors

  **QA Scenarios**:

  ```
  Scenario: Layout renders with nav and footer
    Tool: Playwright (playwright skill)
    Preconditions: `bun --cwd apps/public-astro run dev` running on port 4321
    Steps:
      1. Navigate to http://localhost:4321
      2. Assert `nav` element exists in DOM
      3. Assert `footer` element exists in DOM
      4. Assert CSS variable `--neu-bg` is defined on `:root` (evaluate via page.evaluate)
      5. Screenshot full page
    Expected Result: Page renders with visible navbar, footer; `--neu-bg` defined
    Failure Indicators: nav/footer missing; CSS var undefined; build failed
    Evidence: .sisyphus/evidence/task-T5-layout-render.png

  Scenario: MobileBottomNav React island loads client-side
    Tool: Playwright
    Preconditions: Same dev server
    Steps:
      1. Set viewport to 375x812 (mobile)
      2. Navigate to http://localhost:4321
      3. Assert element matching `[data-testid="mobile-bottom-nav"]` or `nav.mobile-nav` is visible
    Expected Result: Mobile nav visible on narrow viewport
    Failure Indicators: Element not found; hydration error in console
    Evidence: .sisyphus/evidence/task-T5-mobile-nav.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-T5-layout-render.png` — full page screenshot showing nav + footer
  - [ ] `.sisyphus/evidence/task-T5-mobile-nav.png` — mobile viewport screenshot

  **Commit**: YES (groups with T5)
  - Message: `feat(public-astro): add layouts and design system tokens`
  - Files: `apps/public-astro/src/layouts/`, `apps/public-astro/src/components/layout/`, `apps/public-astro/src/styles/globals.css`, `apps/public-astro/src/components/shared/`
  - Pre-commit: `bun --cwd apps/public-astro run build`

---

- [x] T6. **links-astro: Layout + Design System** — `visual-engineering` | Wave 2 | Depends on: T3 | Blocks: T9, T18, T21

  **What to do**:
  1. Create `apps/links-astro/src/layouts/BaseLayout.astro` — accept `title`, `description` props; render `<html lang="en">`, Google Fonts `<link>` (Inter), `<slot />`
  2. Create `apps/links-astro/src/styles/globals.css` — minimal reset + OKLCH tokens for the link-tree style (dark background, rounded card, subtle shadow); port from `apps/links/src/app/globals.css`
  3. Run `bun --cwd apps/links-astro run build` — zero errors

  **Must NOT do**:
  - Do NOT import from `@naufalrf/*` workspace packages
  - Do NOT add React dependency — this app is pure Astro
  - Do NOT replicate public-astro complexity (no Navbar, no FloatingBlobs)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: CSS design system work specific to link-tree aesthetic
  - **Skills**: [`frontend-design`]
    - `frontend-design`: Astro layout authoring, minimal CSS system
  - **Skills Evaluated but Omitted**:
    - `ui-ux-pro-max`: Overkill for a single-page layout

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with T5, T7)
  - **Blocks**: T9, T18, T21
  - **Blocked By**: T3

  **References**:
  - `apps/links/src/app/globals.css` — source CSS to port
  - `apps/links/src/app/layout.tsx` — source layout structure (head tags, body wrapper)
  - `.context/implementation/design-system.yaml` — token reference (use only what links page needs)

  **Acceptance Criteria**:
  - [ ] `ls apps/links-astro/src/layouts/` → contains `BaseLayout.astro`
  - [ ] `ls apps/links-astro/src/styles/` → contains `globals.css`
  - [ ] `bun --cwd apps/links-astro run build` → exits 0

  **QA Scenarios**:

  ```
  Scenario: Layout file renders without errors
    Tool: Bash
    Preconditions: deps installed via `bun install` in monorepo root
    Steps:
      1. Run: `bun --cwd apps/links-astro run build`
      2. Assert exit code 0
      3. Assert `dist/` directory created
    Expected Result: Build succeeds with no errors
    Failure Indicators: Non-zero exit; TypeScript errors in output
    Evidence: .sisyphus/evidence/task-T6-build.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-T6-build.txt` — build stdout/stderr showing 0 errors

  **Commit**: YES (groups with T6)
  - Message: `feat(links-astro): add base layout and design system`
  - Files: `apps/links-astro/src/layouts/`, `apps/links-astro/src/styles/`
  - Pre-commit: `bun --cwd apps/links-astro run build`

---

- [x] T7. **ngl-svelte: Layout + Design System** — `visual-engineering` | Wave 2 | Depends on: T4 | Blocks: T10, T19, T22

  **What to do**:
  1. Create `apps/ngl-svelte/src/app.css` — global styles: OKLCH dark palette CSS variables, minimal reset, base typography; port from `apps/ngl/src/app/globals.css`
  2. Create `apps/ngl-svelte/src/routes/+layout.svelte` — import `app.css`, render `<slot />`, add page-level wrapper `<div class="ngl-root">`
  3. Create `apps/ngl-svelte/src/routes/+layout.ts` — set `export const prerender = false` (SSR required for form actions)
  4. Run `bun --cwd apps/ngl-svelte run build` — zero errors

  **Must NOT do**:
  - Do NOT use old Svelte 4 `$:` reactive syntax — use Svelte 5 Runes (`$state`, `$derived`)
  - Do NOT import from `@naufalrf/*` workspace packages
  - Do NOT add React dependency

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: SvelteKit layout + CSS design system setup
  - **Skills**: [`frontend-design`]
    - `frontend-design`: SvelteKit layout authoring, CSS custom properties
  - **Skills Evaluated but Omitted**:
    - `ui-ux-pro-max`: Overkill for single-screen app

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with T5, T6)
  - **Blocks**: T10, T19, T22
  - **Blocked By**: T4

  **References**:
  - `apps/ngl/src/app/globals.css` — source CSS tokens + reset to port
  - `apps/ngl/src/app/layout.tsx` — body wrapper, font import
  - `.context/implementation/design-system.yaml` — OKLCH dark palette variables

  **Acceptance Criteria**:
  - [ ] `ls apps/ngl-svelte/src/` → contains `app.css`
  - [ ] `ls apps/ngl-svelte/src/routes/` → contains `+layout.svelte`, `+layout.ts`
  - [ ] `cat apps/ngl-svelte/src/routes/+layout.ts` → contains `prerender = false`
  - [ ] `bun --cwd apps/ngl-svelte run build` → exits 0

  **QA Scenarios**:

  ```
  Scenario: Layout builds successfully with SSR enabled
    Tool: Bash
    Preconditions: `bun install` run at monorepo root
    Steps:
      1. Run: `bun --cwd apps/ngl-svelte run build`
      2. Assert exit code 0
      3. Assert `.svelte-kit/output/` or `build/` directory exists
    Expected Result: SvelteKit SSR build succeeds
    Failure Indicators: Runes syntax error; missing adapter; non-zero exit
    Evidence: .sisyphus/evidence/task-T7-build.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-T7-build.txt` — build stdout showing 0 errors

  **Commit**: YES (groups with T7)
  - Message: `feat(ngl-svelte): add root layout and global styles`
  - Files: `apps/ngl-svelte/src/app.css`, `apps/ngl-svelte/src/routes/+layout.svelte`, `apps/ngl-svelte/src/routes/+layout.ts`
  - Pre-commit: `bun --cwd apps/ngl-svelte run build`

---

- [x] T8. **public-astro: Direct API Client + Typed Interfaces** — `unspecified-high` | Wave 3 | Depends on: T5 | Blocks: T11–T17, T20

  **What to do**:
  1. Inspect `apps/admin/src/app/api/v1/public/` to map response shapes for: projects list, project detail (by slug), blogs list, about/profile data, guestbook entries
  2. Create `apps/public-astro/src/types/index.ts` — local TypeScript interfaces only (no import from `@naufalrf/types`): `Project`, `ProjectContext`, `BlogLink`, `Profile`, `ProfileLink`, `GuestbookEntry`, `Achievement`, `Skill`, `Experience`
  3. Create `apps/public-astro/src/lib/api.ts`:
     - Export `const API_BASE = import.meta.env.ADMIN_API_URL` (server-side only)
     - Export `async function apiFetch<T>(path: string, options?: RequestInit): Promise<T>` — wraps `fetch(API_BASE + path)` with `X-Service-Token` header from `import.meta.env.SERVICE_TOKEN`
     - Export named fetchers: `getProjects()`, `getProjectBySlug(slug: string)`, `getBlogs()`, `getAbout()`, `getGuestbookEntries()`
  4. Add to `apps/public-astro/.env.example`: `ADMIN_API_URL=http://localhost:3001`, `SERVICE_TOKEN=`
  5. Run `bun --cwd apps/public-astro run build` — zero TypeScript errors

  **Must NOT do**:
  - Do NOT import types from `@naufalrf/types` or `packages/types`
  - Do NOT use `packages/sdk` — build direct `fetch()` calls from scratch
  - Do NOT expose `SERVICE_TOKEN` to client-side code (keep in server-only Astro frontmatter)
  - Do NOT hardcode API URL — use `import.meta.env`

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: API contract reverse-engineering + TypeScript interface design + environment variable wiring
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `frontend-design`: Not relevant — this is pure TS/API layer

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with T9, T10)
  - **Blocks**: T11, T12, T13, T14, T15, T16, T17, T20
  - **Blocked By**: T5

  **References**:
  - `apps/admin/src/app/api/v1/public/projects/route.ts` — GET response shape for projects list
  - `apps/admin/src/app/api/v1/public/projects/[slug]/route.ts` — GET response shape for project detail
  - `apps/admin/src/app/api/v1/public/blogs/route.ts` — GET response shape for blog links
  - `apps/admin/src/app/api/v1/public/about/route.ts` — GET response shape for about/profile
  - `apps/admin/src/app/api/v1/public/guestbook/route.ts` — GET response shape for guestbook entries
  - `packages/types/src/` — reference only for field names; do NOT import in new app
  - `apps/public/src/lib/api.ts` — existing fetch wrapper pattern to adapt (if present)

  **Acceptance Criteria**:
  - [ ] `ls apps/public-astro/src/types/` → contains `index.ts` with exported `Project` interface
  - [ ] `ls apps/public-astro/src/lib/` → contains `api.ts` with exported `apiFetch` and named fetchers
  - [ ] `grep -n "@naufalrf" apps/public-astro/src/lib/api.ts` → empty (no workspace imports)
  - [ ] `grep -n "@naufalrf" apps/public-astro/src/types/index.ts` → empty
  - [ ] `bun --cwd apps/public-astro run build` → exits 0

  **QA Scenarios**:

  ```
  Scenario: apiFetch compiles without type errors
    Tool: Bash
    Preconditions: `bun install` at root; `ADMIN_API_URL` and `SERVICE_TOKEN` set in `apps/public-astro/.env` (can be dummy values for build check)
    Steps:
      1. Run: `bun --cwd apps/public-astro run build`
      2. Assert exit code 0
      3. Assert no TypeScript error mentioning `api.ts` or `types/index.ts`
    Expected Result: Build succeeds with full type coverage on api.ts
    Failure Indicators: `TS2305` missing export; `TS7006` implicit any; non-zero exit
    Evidence: .sisyphus/evidence/task-T8-build.txt

  Scenario: No workspace package imports in new app
    Tool: Bash
    Preconditions: None
    Steps:
      1. Run: `grep -r "@naufalrf" apps/public-astro/src/`
      2. Assert output is empty
    Expected Result: Zero occurrences of `@naufalrf` in public-astro source
    Failure Indicators: Any line referencing `@naufalrf/types`, `@naufalrf/sdk`, etc.
    Evidence: .sisyphus/evidence/task-T8-no-workspace-imports.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-T8-build.txt` — build stdout, 0 errors
  - [ ] `.sisyphus/evidence/task-T8-no-workspace-imports.txt` — grep output (empty = pass)

  **Commit**: YES (groups with T8)
  - Message: `feat(public-astro): add direct API client and typed interfaces`
  - Files: `apps/public-astro/src/lib/api.ts`, `apps/public-astro/src/types/index.ts`, `apps/public-astro/.env.example`
  - Pre-commit: `bun --cwd apps/public-astro run build`

---

- [x] T9. **links-astro: Direct API Client** — `quick` | Wave 3 | Depends on: T6 | Blocks: T18, T21

  **What to do**:
  1. Inspect `apps/admin/src/app/api/v1/public/links/route.ts` to map the response shape for profile links (id, label, url, icon, order)
  2. Create `apps/links-astro/src/types/index.ts` — local interface `ProfileLink { id: string; label: string; url: string; icon: string; order: number }` (no `@naufalrf/types` import)
  3. Create `apps/links-astro/src/lib/api.ts`:
     - Export `const API_BASE = import.meta.env.ADMIN_API_URL`
     - Export `async function apiFetch<T>(path: string): Promise<T>` — wraps `fetch()` with `X-Service-Token` from `import.meta.env.SERVICE_TOKEN`
     - Export `getProfileLinks(): Promise<ProfileLink[]>`
  4. Add `apps/links-astro/.env.example`: `ADMIN_API_URL=http://localhost:3001`, `SERVICE_TOKEN=`
  5. Run `bun --cwd apps/links-astro run build` — zero errors

  **Must NOT do**:
  - Do NOT import from `@naufalrf/*`
  - Do NOT add React or any UI framework dependency
  - Do NOT expose `SERVICE_TOKEN` to client-side code

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Minimal API client — single endpoint, simple typed fetcher
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `frontend-design`: Not relevant — pure data layer

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with T8, T10)
  - **Blocks**: T18, T21
  - **Blocked By**: T6

  **References**:
  - `apps/admin/src/app/api/v1/public/links/route.ts` — response shape to derive `ProfileLink` interface from
  - `apps/links/src/lib/api.ts` — existing fetch pattern to adapt (if present)
  - `apps/public-astro/src/lib/api.ts` (T8 output) — reference pattern for `apiFetch` helper structure

  **Acceptance Criteria**:
  - [ ] `ls apps/links-astro/src/lib/` → contains `api.ts`
  - [ ] `ls apps/links-astro/src/types/` → contains `index.ts` with `ProfileLink` interface
  - [ ] `grep -n "@naufalrf" apps/links-astro/src/lib/api.ts` → empty
  - [ ] `bun --cwd apps/links-astro run build` → exits 0

  **QA Scenarios**:

  ```
  Scenario: API client compiles with no type errors
    Tool: Bash
    Preconditions: `bun install` at root; dummy `.env` values set
    Steps:
      1. Run: `bun --cwd apps/links-astro run build`
      2. Assert exit code 0
    Expected Result: Build succeeds
    Failure Indicators: TypeScript errors in api.ts or types/index.ts
    Evidence: .sisyphus/evidence/task-T9-build.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-T9-build.txt` — build stdout, 0 errors

  **Commit**: YES (groups with T9)
  - Message: `feat(links-astro): add direct API client and typed interfaces`
  - Files: `apps/links-astro/src/lib/api.ts`, `apps/links-astro/src/types/index.ts`, `apps/links-astro/.env.example`
  - Pre-commit: `bun --cwd apps/links-astro run build`

---

- [x] T10. **ngl-svelte: Direct API Client + Form Server Action** — `unspecified-high` | Wave 3 | Depends on: T7 | Blocks: T19, T22

  **What to do**:
  1. Inspect `apps/admin/src/app/api/v1/public/messages/route.ts` to capture the POST request body shape and response shape
  2. Create `apps/ngl-svelte/src/types/index.ts` — local interfaces: `MessagePayload { recipientId?: string; content: string; isAnonymous: boolean }`, `MessageResponse { id: string; createdAt: string }`
  3. Create `apps/ngl-svelte/src/lib/api.ts`:
     - Export `const API_BASE = import.meta.env.ADMIN_API_URL` (server-only — use in `+page.server.ts` only)
     - Export `async function submitMessage(payload: MessagePayload): Promise<MessageResponse>` — POST to `${API_BASE}/api/public-write/messages` with JSON body and rate-limit-safe headers
  4. Create `apps/ngl-svelte/src/routes/+page.server.ts`:
     - Export `actions` with default action: parse `FormData`, validate fields (content non-empty, max 500 chars), call `submitMessage()`, return `{ success: true }` or `fail(422, { error: '...' })`
  5. Run `bun --cwd apps/ngl-svelte run build` — zero errors

  **Must NOT do**:
  - Do NOT import from `@naufalrf/*`
  - Do NOT expose `ADMIN_API_URL` to client-side (server action only)
  - Do NOT implement authentication or recipient lookup (Phase 3)
  - Do NOT use old Svelte 4 `$:` reactive syntax

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: SvelteKit form action architecture + API integration + validation layer
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `frontend-design`: Not relevant at this stage — UI is T19

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with T8, T9)
  - **Blocks**: T19, T22
  - **Blocked By**: T7

  **References**:
  - `apps/admin/src/app/api/v1/public/messages/route.ts` — POST body + response shapes
  - `apps/ngl/src/components/MessageForm.tsx` — existing form logic and validation rules to replicate in server action
  - SvelteKit actions docs: https://kit.svelte.dev/docs/form-actions — `actions` export, `fail()`, `FormData` parsing

  **Acceptance Criteria**:
  - [ ] `ls apps/ngl-svelte/src/routes/` → contains `+page.server.ts` with `actions` export
  - [ ] `ls apps/ngl-svelte/src/lib/` → contains `api.ts`
  - [ ] `grep -n "export const actions" apps/ngl-svelte/src/routes/+page.server.ts` → non-empty
  - [ ] `bun --cwd apps/ngl-svelte run build` → exits 0

  **QA Scenarios**:

  ```
  Scenario: Server action rejects empty message
    Tool: Bash (curl)
    Preconditions: `bun --cwd apps/ngl-svelte run dev` running on port 5173
    Steps:
      1. Run: `curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:5173/?/default -d "content="`
      2. Assert HTTP status is 422
    Expected Result: 422 Unprocessable Entity with validation error body
    Failure Indicators: 200 or 500 response; missing actions export
    Evidence: .sisyphus/evidence/task-T10-action-reject.txt

  Scenario: SvelteKit SSR build succeeds with prerender=false
    Tool: Bash
    Preconditions: `bun install` at root
    Steps:
      1. Run: `bun --cwd apps/ngl-svelte run build`
      2. Assert exit code 0
      3. Assert `build/` directory created
    Expected Result: SSR build artifacts generated
    Failure Indicators: Non-zero exit; adapter error; prerender conflict
    Evidence: .sisyphus/evidence/task-T10-build.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-T10-action-reject.txt` — curl response for empty-content POST
  - [ ] `.sisyphus/evidence/task-T10-build.txt` — build stdout, 0 errors

  **Commit**: YES (groups with T10)
  - Message: `feat(ngl-svelte): add direct API client and form server action`
  - Files: `apps/ngl-svelte/src/lib/api.ts`, `apps/ngl-svelte/src/types/index.ts`, `apps/ngl-svelte/src/routes/+page.server.ts`
  - Pre-commit: `bun --cwd apps/ngl-svelte run build`

---

- [x] T11. **public-astro: Home Page** — `visual-engineering` | Wave 4 | Depends on: T8 | Blocks: T20

  **What to do**:
  1. Create `apps/public-astro/src/pages/index.astro`:
     - In frontmatter: call `getProjects()` and `getBlogs()` from `src/lib/api.ts`; pass as props to islands
     - Wrap in `PageLayout.astro` with `title="NaufalRF | Full-Stack Engineer"`
  2. Port `apps/public/src/features/home/components/HeroSection.tsx` → `src/components/home/HeroSection.tsx` (React island, `client:load` — animated text requires JS)
  3. Port `apps/public/src/features/home/components/FeaturedProjects.tsx` → `src/components/home/FeaturedProjects.tsx` (React island, `client:visible` — below fold)
  4. Port `apps/public/src/features/home/components/LatestArticles.tsx` → `src/components/home/LatestArticles.tsx` (React island, `client:visible`)
  5. Port `apps/public/src/features/home/components/TechnicalExpertise.tsx` → `src/components/home/TechnicalExpertise.tsx` (React island, `client:visible`)
  6. Replace all `next/link` → `<a href>`, `next/image` → `<img>`, `useRouter` → removed (no client routing needed)
  7. Run `bun --cwd apps/public-astro run build` — zero errors

  **Must NOT do**:
  - Do NOT implement guestbook on home page (Phase 3)
  - Do NOT use `next/*` imports
  - Do NOT import from `@naufalrf/*`
  - Do NOT add features absent from original `apps/public` home page

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: React component migration with Astro islands wiring and layout props
  - **Skills**: [`frontend-design`, `ui-ux-pro-max`]
    - `frontend-design`: Astro page composition, component porting
    - `ui-ux-pro-max`: Visual fidelity — ensure ported components match original design
  - **Skills Evaluated but Omitted**:
    - `playwright`: QA scenario handles browser verification

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with T12–T19)
  - **Blocks**: T20
  - **Blocked By**: T8

  **References**:
  - `apps/public/src/features/home/components/HeroSection.tsx` — source component
  - `apps/public/src/features/home/components/FeaturedProjects.tsx` — source component
  - `apps/public/src/features/home/components/LatestArticles.tsx` — source component
  - `apps/public/src/features/home/components/TechnicalExpertise.tsx` — source component
  - `apps/public/src/app/page.tsx` — original page structure, layout props
  - `apps/public-astro/src/layouts/PageLayout.astro` (T5 output) — layout to wrap
  - `apps/public-astro/src/lib/api.ts` (T8 output) — `getProjects()`, `getBlogs()` fetchers

  **Acceptance Criteria**:
  - [ ] `ls apps/public-astro/src/pages/` → contains `index.astro`
  - [ ] `grep -n "PageLayout" apps/public-astro/src/pages/index.astro` → non-empty
  - [ ] `grep -n "getProjects\|getBlogs" apps/public-astro/src/pages/index.astro` → non-empty
  - [ ] `grep -rn "next/" apps/public-astro/src/components/home/` → empty (no next imports)
  - [ ] `bun --cwd apps/public-astro run build` → exits 0

  **QA Scenarios**:

  ```
  Scenario: Home page renders hero section
    Tool: Playwright (playwright skill)
    Preconditions: `bun --cwd apps/public-astro run dev` on port 4321; admin API running with test data
    Steps:
      1. Navigate to http://localhost:4321
      2. Assert element `.hero-section` or `[data-testid="hero"]` is visible
      3. Assert page `<title>` contains "NaufalRF"
      4. Screenshot full page
    Expected Result: Hero section visible; title correct
    Failure Indicators: Empty page; hydration error; title mismatch
    Evidence: .sisyphus/evidence/task-T11-home.png

  Scenario: FeaturedProjects renders project cards when API returns data
    Tool: Playwright
    Preconditions: Same dev server; admin API returns ≥1 project
    Steps:
      1. Navigate to http://localhost:4321
      2. Scroll to featured projects section
      3. Assert at least 1 element matching `.project-card` or `[data-testid="project-card"]` exists
    Expected Result: ≥1 project card rendered
    Failure Indicators: 0 cards; fetch error in console
    Evidence: .sisyphus/evidence/task-T11-projects.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-T11-home.png` — full-page screenshot of home
  - [ ] `.sisyphus/evidence/task-T11-projects.png` — screenshot of featured projects section

  **Commit**: YES (groups with T11)
  - Message: `feat(public-astro): add home page with React islands`
  - Files: `apps/public-astro/src/pages/index.astro`, `apps/public-astro/src/components/home/`
  - Pre-commit: `bun --cwd apps/public-astro run build`

---

- [x] T12. **public-astro: Projects List Page** — `visual-engineering` | Wave 4 | Depends on: T8 | Blocks: T20

  **What to do**:
  1. Create `apps/public-astro/src/pages/projects/index.astro`:
     - Frontmatter: call `getProjects()` from `src/lib/api.ts`
     - Wrap in `PageLayout.astro` with `title="Projects | NaufalRF"`
  2. Port `apps/public/src/features/projects/components/ProjectsContent.tsx` → `src/components/projects/ProjectsContent.tsx` (React island, `client:load` — client-side filtering)
  3. Port `apps/public/src/features/projects/components/ProjectCard.tsx` → `src/components/projects/ProjectCard.tsx` (React island — used inside ProjectsContent)
  4. Replace `next/link` → `<a href>`, `next/image` → `<img>` in ported components
  5. Run `bun --cwd apps/public-astro run build` — zero errors

  **Must NOT do**:
  - Do NOT implement pagination if not in original (add only if original has it)
  - Do NOT add sorting/filtering beyond what original app provides
  - Do NOT import from `@naufalrf/*`

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: React island composition + data-driven list rendering
  - **Skills**: [`frontend-design`]
    - `frontend-design`: Astro page + React island wiring
  - **Skills Evaluated but Omitted**:
    - `ui-ux-pro-max`: No new design work — straight port

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with T11, T13–T19)
  - **Blocks**: T20
  - **Blocked By**: T8

  **References**:
  - `apps/public/src/features/projects/components/ProjectsContent.tsx` — source component
  - `apps/public/src/features/projects/components/ProjectCard.tsx` — source component
  - `apps/public/src/app/projects/page.tsx` — original page structure
  - `apps/public-astro/src/lib/api.ts` (T8) — `getProjects()` fetcher

  **Acceptance Criteria**:
  - [ ] `ls apps/public-astro/src/pages/projects/` → contains `index.astro`
  - [ ] `grep -n "getProjects" apps/public-astro/src/pages/projects/index.astro` → non-empty
  - [ ] `bun --cwd apps/public-astro run build` → exits 0

  **QA Scenarios**:

  ```
  Scenario: Projects list page renders cards
    Tool: Playwright
    Preconditions: Dev server on port 4321; admin API has ≥1 project
    Steps:
      1. Navigate to http://localhost:4321/projects
      2. Assert HTTP status 200 (no 404 or 500)
      3. Assert ≥1 `.project-card` or `[data-testid="project-card"]` visible
      4. Screenshot
    Expected Result: Projects list renders with at least 1 card
    Failure Indicators: 404; empty list with data available; console errors
    Evidence: .sisyphus/evidence/task-T12-projects-list.png

  Scenario: Projects page has correct title
    Tool: Playwright
    Preconditions: Same dev server
    Steps:
      1. Navigate to http://localhost:4321/projects
      2. Assert `document.title` contains "Projects"
    Expected Result: Title includes "Projects"
    Failure Indicators: Generic or empty title
    Evidence: .sisyphus/evidence/task-T12-projects-title.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-T12-projects-list.png` — screenshot of projects grid
  - [ ] `.sisyphus/evidence/task-T12-projects-title.txt` — page title assertion output

  **Commit**: YES (groups with T12)
  - Message: `feat(public-astro): add projects list page`
  - Files: `apps/public-astro/src/pages/projects/index.astro`, `apps/public-astro/src/components/projects/`
  - Pre-commit: `bun --cwd apps/public-astro run build`

---

- [x] T13. **public-astro: Project Detail Page** — `visual-engineering` | Wave 4 | Depends on: T8 | Blocks: T20

  **What to do**:
  1. Create `apps/public-astro/src/pages/projects/[slug].astro`:
     - Frontmatter: call `getProjectBySlug(Astro.params.slug)` from `src/lib/api.ts`; if null, call `return Astro.redirect('/404')`
     - Wrap in `PageLayout.astro` with `title={project.title + ' | NaufalRF'}`
  2. Port `apps/public/src/features/projects/components/ProjectDetail.tsx` → `src/components/projects/ProjectDetail.tsx` (React island, `client:load`)
  3. Port `apps/public/src/features/projects/components/ImageCarousel.tsx` → `src/components/projects/ImageCarousel.tsx` (React island, `client:load` — needs JS for carousel interaction)
  4. Replace `next/image` → `<img>`, `next/link` → `<a href>`, `next/navigation useParams` → `Astro.params` (in frontmatter only)
  5. Run `bun --cwd apps/public-astro run build` — zero errors

  **Must NOT do**:
  - Do NOT use `getStaticPaths` or prerender project pages — keep SSR (admin data may change)
  - Do NOT import from `@naufalrf/*`
  - Do NOT add features absent from original detail page (e.g. comments)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Dynamic route + carousel component porting + 404 handling
  - **Skills**: [`frontend-design`]
    - `frontend-design`: Dynamic Astro routes, React island composition
  - **Skills Evaluated but Omitted**:
    - `ui-ux-pro-max`: No new design; straight port

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with T11, T12, T14–T19)
  - **Blocks**: T20
  - **Blocked By**: T8

  **References**:
  - `apps/public/src/features/projects/components/ProjectDetail.tsx` — source component
  - `apps/public/src/features/projects/components/ImageCarousel.tsx` — source carousel component
  - `apps/public/src/app/projects/[slug]/page.tsx` — original dynamic page + 404 handling pattern
  - `apps/public-astro/src/lib/api.ts` (T8) — `getProjectBySlug()` fetcher

  **Acceptance Criteria**:
  - [ ] `ls apps/public-astro/src/pages/projects/` → contains `[slug].astro`
  - [ ] `grep -n "Astro.params.slug" apps/public-astro/src/pages/projects/\[slug\].astro` → non-empty
  - [ ] `grep -n "redirect" apps/public-astro/src/pages/projects/\[slug\].astro` → non-empty (404 handling)
  - [ ] `bun --cwd apps/public-astro run build` → exits 0

  **QA Scenarios**:

  ```
  Scenario: Valid slug renders project detail
    Tool: Playwright
    Preconditions: Dev server port 4321; admin API has project with slug `test-project`
    Steps:
      1. Navigate to http://localhost:4321/projects/test-project
      2. Assert HTTP status 200
      3. Assert project title heading is visible
      4. Screenshot
    Expected Result: Project detail page renders with title and content
    Failure Indicators: 404; empty page; hydration error
    Evidence: .sisyphus/evidence/task-T13-detail.png

  Scenario: Invalid slug returns 404 redirect
    Tool: Playwright
    Preconditions: Same dev server
    Steps:
      1. Navigate to http://localhost:4321/projects/non-existent-slug-xyz
      2. Assert redirected to /404 or HTTP status 404
    Expected Result: 404 handling triggered for unknown slug
    Failure Indicators: 500 error; unhandled null reference; blank page
    Evidence: .sisyphus/evidence/task-T13-404.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-T13-detail.png` — screenshot of project detail page
  - [ ] `.sisyphus/evidence/task-T13-404.txt` — response status for invalid slug

  **Commit**: YES (groups with T13)
  - Message: `feat(public-astro): add project detail page with carousel`
  - Files: `apps/public-astro/src/pages/projects/[slug].astro`, `apps/public-astro/src/components/projects/ProjectDetail.tsx`, `apps/public-astro/src/components/projects/ImageCarousel.tsx`
  - Pre-commit: `bun --cwd apps/public-astro run build`

---

- [x] T14. **public-astro: About Page** — `visual-engineering` | Wave 4 | Depends on: T8 | Blocks: T20

  **What to do**:
  1. Create `apps/public-astro/src/pages/about.astro`:
     - Frontmatter: call `getAbout()` from `src/lib/api.ts` to fetch profile, experience, skills, achievements
     - Wrap in `PageLayout.astro` with `title="About | NaufalRF"`
  2. Port `apps/public/src/features/about/components/AboutContent.tsx` → `src/components/about/AboutContent.tsx` (React island, `client:load`)
  3. Port `apps/public/src/features/about/components/ExperienceTabs.tsx` → `src/components/about/ExperienceTabs.tsx` (React island, `client:load` — tab interaction requires JS)
  4. Port `apps/public/src/features/about/components/SkillBadges.tsx` → `src/components/about/SkillBadges.tsx` (React island, `client:visible`)
  5. Port `apps/public/src/features/about/components/AchievementsDisplay.tsx` → `src/components/about/AchievementsDisplay.tsx` (React island, `client:visible`)
  6. Replace `next/image` → `<img>`, `next/link` → `<a href>` in ported components
  7. Run `bun --cwd apps/public-astro run build` — zero errors

  **Must NOT do**:
  - Do NOT import from `@naufalrf/*`
  - Do NOT add new sections absent from original about page
  - Do NOT implement any forms or write operations on this page

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Multi-component page with interactive tabs and skill displays
  - **Skills**: [`frontend-design`, `ui-ux-pro-max`]
    - `frontend-design`: Component porting + Astro island wiring
    - `ui-ux-pro-max`: Tab component, skill badge visual fidelity
  - **Skills Evaluated but Omitted**:
    - `playwright`: Covered in QA scenarios

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with T11–T13, T15–T19)
  - **Blocks**: T20
  - **Blocked By**: T8

  **References**:
  - `apps/public/src/features/about/components/AboutContent.tsx` — source
  - `apps/public/src/features/about/components/ExperienceTabs.tsx` — source (tab interaction logic)
  - `apps/public/src/features/about/components/SkillBadges.tsx` — source
  - `apps/public/src/features/about/components/AchievementsDisplay.tsx` — source
  - `apps/public/src/app/about/page.tsx` — original page structure
  - `apps/public-astro/src/lib/api.ts` (T8) — `getAbout()` fetcher

  **Acceptance Criteria**:
  - [ ] `ls apps/public-astro/src/pages/` → contains `about.astro`
  - [ ] `grep -n "getAbout" apps/public-astro/src/pages/about.astro` → non-empty
  - [ ] `bun --cwd apps/public-astro run build` → exits 0

  **QA Scenarios**:

  ```
  Scenario: About page renders experience tabs
    Tool: Playwright
    Preconditions: Dev server port 4321; admin API has profile data
    Steps:
      1. Navigate to http://localhost:4321/about
      2. Assert element matching `.experience-tabs` or `[role="tablist"]` is visible
      3. Click first tab
      4. Assert tab panel content is visible
      5. Screenshot
    Expected Result: Tabs render and are interactive
    Failure Indicators: No tabs; click fails; hydration error
    Evidence: .sisyphus/evidence/task-T14-about.png

  Scenario: About page title is correct
    Tool: Playwright
    Preconditions: Same dev server
    Steps:
      1. Navigate to http://localhost:4321/about
      2. Assert `document.title` contains "About"
    Expected Result: Correct page title
    Evidence: .sisyphus/evidence/task-T14-title.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-T14-about.png` — about page with tabs visible
  - [ ] `.sisyphus/evidence/task-T14-title.txt` — page title assertion

  **Commit**: YES (groups with T14)
  - Message: `feat(public-astro): add about page`
  - Files: `apps/public-astro/src/pages/about.astro`, `apps/public-astro/src/components/about/`
  - Pre-commit: `bun --cwd apps/public-astro run build`

---

- [x] T15. **public-astro: Blogs Page** — `visual-engineering` | Wave 4 | Depends on: T8 | Blocks: T20

  **What to do**:
  1. Create `apps/public-astro/src/pages/blogs.astro`:
     - Frontmatter: call `getBlogs()` from `src/lib/api.ts`
     - Wrap in `PageLayout.astro` with `title="Blog | NaufalRF"`
  2. Port `apps/public/src/features/blogs/components/BlogsContent.tsx` → `src/components/blogs/BlogsContent.tsx` (React island, `client:load` — filtering by tag)
  3. Port `apps/public/src/features/blogs/components/BlogCard.tsx` → `src/components/blogs/BlogCard.tsx` (React island — rendered by BlogsContent)
  4. Replace `next/link` → `<a href target="_blank" rel="noopener noreferrer">` (blog entries link to external URLs)
  5. Run `bun --cwd apps/public-astro run build` — zero errors

  **Must NOT do**:
  - Do NOT create individual blog post pages — blog entries are external links only
  - Do NOT import from `@naufalrf/*`
  - Do NOT add features absent from original blogs page

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Card list with tag filtering — React island with client-side state
  - **Skills**: [`frontend-design`]
    - `frontend-design`: React island + filtered list pattern
  - **Skills Evaluated but Omitted**:
    - `ui-ux-pro-max`: No new design work

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with T11–T14, T16–T19)
  - **Blocks**: T20
  - **Blocked By**: T8

  **References**:
  - `apps/public/src/features/blogs/components/BlogsContent.tsx` — source (filtering logic)
  - `apps/public/src/features/blogs/components/BlogCard.tsx` — source card component
  - `apps/public/src/app/blogs/page.tsx` — original page
  - `apps/public-astro/src/lib/api.ts` (T8) — `getBlogs()` fetcher

  **Acceptance Criteria**:
  - [ ] `ls apps/public-astro/src/pages/` → contains `blogs.astro`
  - [ ] `bun --cwd apps/public-astro run build` → exits 0

  **QA Scenarios**:

  ```
  Scenario: Blogs page renders blog cards
    Tool: Playwright
    Preconditions: Dev server port 4321; admin API has ≥1 blog link
    Steps:
      1. Navigate to http://localhost:4321/blogs
      2. Assert ≥1 element matching `.blog-card` or `[data-testid="blog-card"]` visible
      3. Screenshot
    Expected Result: ≥1 blog card rendered with title and link
    Failure Indicators: Empty list; 404; console fetch error
    Evidence: .sisyphus/evidence/task-T15-blogs.png

  Scenario: Blog card links open externally
    Tool: Playwright
    Preconditions: Same dev server
    Steps:
      1. Navigate to http://localhost:4321/blogs
      2. Find first `.blog-card a` element
      3. Assert `target="_blank"` attribute is set
    Expected Result: All blog links open in new tab
    Failure Indicators: Missing target attribute; internal navigation triggered
    Evidence: .sisyphus/evidence/task-T15-links.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-T15-blogs.png` — screenshot of blogs page
  - [ ] `.sisyphus/evidence/task-T15-links.txt` — link target attribute check

  **Commit**: YES (groups with T15)
  - Message: `feat(public-astro): add blogs page`
  - Files: `apps/public-astro/src/pages/blogs.astro`, `apps/public-astro/src/components/blogs/`
  - Pre-commit: `bun --cwd apps/public-astro run build`

---

- [x] T16. **public-astro: Contact Page** — `visual-engineering` | Wave 4 | Depends on: T8 | Blocks: T20

  **What to do**:
  1. Create `apps/public-astro/src/pages/contact.astro`:
     - Wrap in `PageLayout.astro` with `title="Contact | NaufalRF"`
     - No data fetching needed — static page
  2. Port `apps/public/src/features/contact/components/ContactContent.tsx` → `src/components/contact/ContactContent.tsx` (React island, `client:load`)
  3. Port `apps/public/src/features/contact/components/ContactForm.tsx` → `src/components/contact/ContactForm.tsx` (React island, `client:load`) — **display-only in Phase 2**: render the form HTML with inputs but disable submission (`onSubmit` returns early with a "coming soon" toast or empty handler)
  4. Replace `next/*` imports in ported components
  5. Run `bun --cwd apps/public-astro run build` — zero errors

  **Must NOT do**:
  - Do NOT implement actual form submission (Phase 3)
  - Do NOT integrate with any mailing service or API
  - Do NOT import from `@naufalrf/*`

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Form display component — visual structure required, no backend logic
  - **Skills**: [`frontend-design`]
    - `frontend-design`: Static page + form display pattern
  - **Skills Evaluated but Omitted**:
    - `ui-ux-pro-max`: No new design; straight port

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with T11–T15, T17–T19)
  - **Blocks**: T20
  - **Blocked By**: T8

  **References**:
  - `apps/public/src/features/contact/components/ContactContent.tsx` — source
  - `apps/public/src/features/contact/components/ContactForm.tsx` — source (disable onSubmit)
  - `apps/public/src/app/contact/page.tsx` — original page

  **Acceptance Criteria**:
  - [ ] `ls apps/public-astro/src/pages/` → contains `contact.astro`
  - [ ] `grep -n "onSubmit" apps/public-astro/src/components/contact/ContactForm.tsx` → returns early or is empty handler (no API call)
  - [ ] `bun --cwd apps/public-astro run build` → exits 0

  **QA Scenarios**:

  ```
  Scenario: Contact page renders form fields
    Tool: Playwright
    Preconditions: Dev server port 4321
    Steps:
      1. Navigate to http://localhost:4321/contact
      2. Assert `input[name="name"]` or `input[type="text"]` is visible
      3. Assert `textarea` is visible
      4. Screenshot
    Expected Result: Contact form rendered with input fields
    Failure Indicators: Empty page; form fields missing; 404
    Evidence: .sisyphus/evidence/task-T16-contact.png

  Scenario: Form submit does NOT send API request
    Tool: Playwright
    Preconditions: Same dev server; network interception enabled
    Steps:
      1. Navigate to http://localhost:4321/contact
      2. Fill `input[name="name"]` with "Test User"
      3. Fill `textarea` with "Hello"
      4. Intercept network requests to admin API
      5. Click submit button
      6. Assert no POST request was made to admin API
    Expected Result: Form submit fires no backend call
    Failure Indicators: Network request to `/api/` intercepted
    Evidence: .sisyphus/evidence/task-T16-no-submit.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-T16-contact.png` — contact form screenshot
  - [ ] `.sisyphus/evidence/task-T16-no-submit.txt` — network interception log confirming no API call

  **Commit**: YES (groups with T16)
  - Message: `feat(public-astro): add contact page (display-only form)`
  - Files: `apps/public-astro/src/pages/contact.astro`, `apps/public-astro/src/components/contact/`
  - Pre-commit: `bun --cwd apps/public-astro run build`

---

- [x] T17. **public-astro: AI Chatbot Page** — `visual-engineering` | Wave 4 | Depends on: T8 | Blocks: T20

  **What to do**:
  1. Create `apps/public-astro/src/pages/ai-chatbot.astro`:
     - Wrap in `PageLayout.astro` with `title="AI Chatbot | NaufalRF"`
     - No server-side data fetching needed (chatbot calls RAG service client-side)
  2. Port `apps/public/src/features/chatbot/components/ChatWidget.tsx` (or equivalent) → `src/components/chatbot/ChatWidget.tsx` as React island with `client:load` (requires JS for streaming/SSE)
  3. Pass `PUBLIC_RAG_SERVICE_URL` as a prop using `import.meta.env.PUBLIC_RAG_SERVICE_URL` (Astro exposes `PUBLIC_*` vars to client)
  4. Add `PUBLIC_RAG_SERVICE_URL=http://localhost:3002` to `apps/public-astro/.env.example`
  5. Replace `next/*` imports in ChatWidget
  6. Run `bun --cwd apps/public-astro run build` — zero errors

  **Must NOT do**:
  - Do NOT call RAG service from Astro frontmatter (SSR) — client-side only
  - Do NOT expose `SERVICE_TOKEN` to client code
  - Do NOT import from `@naufalrf/*`

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Chat widget React island with environment variable wiring
  - **Skills**: [`frontend-design`]
    - `frontend-design`: Astro page + React island client:load pattern
  - **Skills Evaluated but Omitted**:
    - `ui-ux-pro-max`: No new design; port existing UI

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with T11–T16, T18, T19)
  - **Blocks**: T20
  - **Blocked By**: T8

  **References**:
  - `apps/public/src/features/chatbot/` — source chatbot components and hooks
  - `apps/public/src/app/ai-chatbot/page.tsx` — original page structure
  - Astro env docs: https://docs.astro.build/en/guides/environment-variables/ — `PUBLIC_*` client-side variable convention

  **Acceptance Criteria**:
  - [ ] `ls apps/public-astro/src/pages/` → contains `ai-chatbot.astro`
  - [ ] `grep -n "client:load" apps/public-astro/src/pages/ai-chatbot.astro` → non-empty
  - [ ] `grep -n "PUBLIC_RAG_SERVICE_URL" apps/public-astro/src/pages/ai-chatbot.astro` → non-empty
  - [ ] `bun --cwd apps/public-astro run build` → exits 0

  **QA Scenarios**:

  ```
  Scenario: Chatbot page renders chat widget
    Tool: Playwright
    Preconditions: Dev server port 4321; `PUBLIC_RAG_SERVICE_URL` set in `.env`
    Steps:
      1. Navigate to http://localhost:4321/ai-chatbot
      2. Assert chat input element (`input[type="text"]` or `textarea`) is visible after hydration
      3. Screenshot
    Expected Result: Chat widget renders with input field
    Failure Indicators: Empty page; hydration error; input not visible
    Evidence: .sisyphus/evidence/task-T17-chatbot.png

  Scenario: Chat widget does not expose SERVICE_TOKEN to window
    Tool: Playwright
    Preconditions: Same dev server
    Steps:
      1. Navigate to http://localhost:4321/ai-chatbot
      2. Evaluate: `window.__env?.SERVICE_TOKEN ?? ''`
      3. Assert result is empty string
    Expected Result: SERVICE_TOKEN not exposed to window
    Failure Indicators: Non-empty SERVICE_TOKEN in window object
    Evidence: .sisyphus/evidence/task-T17-token-check.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-T17-chatbot.png` — screenshot showing chat input
  - [ ] `.sisyphus/evidence/task-T17-token-check.txt` — window env check result

  **Commit**: YES (groups with T17)
  - Message: `feat(public-astro): add AI chatbot page`
  - Files: `apps/public-astro/src/pages/ai-chatbot.astro`, `apps/public-astro/src/components/chatbot/`
  - Pre-commit: `bun --cwd apps/public-astro run build`

---

- [x] T18. **links-astro: Home Page** — `visual-engineering` | Wave 4 | Depends on: T9 | Blocks: T21

  **What to do**:
  1. Create `apps/links-astro/src/pages/index.astro`:
     - Frontmatter: call `getProfileLinks()` from `src/lib/api.ts`
     - Wrap in `BaseLayout.astro` with `title="NaufalRF | Links"`
  2. Create `src/components/ProfileHeader.astro` — port from `apps/links/src/components/ProfileHeader.tsx` as pure Astro (no React; static HTML: avatar `<img>`, name heading, short bio)
  3. Create `src/components/LinkButtons.astro` — port from `apps/links/src/components/LinkButtons.tsx` as pure Astro (accept `links: ProfileLink[]` prop; render `<a href>` list)
  4. Create `src/components/SocialIcons.astro` — port from `apps/links/src/components/SocialIcons.tsx` as pure Astro (SVG icons or icon font links; no React state needed)
  5. Run `bun --cwd apps/links-astro run build` — zero errors

  **Must NOT do**:
  - Do NOT add React dependency to this app
  - Do NOT use React islands — everything is pure `.astro` components
  - Do NOT import from `@naufalrf/*`
  - Do NOT add interactivity beyond static link clicks

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Pure Astro component authoring — static link-tree page
  - **Skills**: [`frontend-design`]
    - `frontend-design`: Astro component composition, data-driven static rendering
  - **Skills Evaluated but Omitted**:
    - `ui-ux-pro-max`: Single-page link-tree — no complex design needed

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with T11–T17, T19)
  - **Blocks**: T21
  - **Blocked By**: T9

  **References**:
  - `apps/links/src/components/ProfileHeader.tsx` — source (convert to .astro)
  - `apps/links/src/components/LinkButtons.tsx` — source (convert to .astro)
  - `apps/links/src/components/SocialIcons.tsx` — source (convert to .astro)
  - `apps/links/src/app/page.tsx` — original page structure
  - `apps/links-astro/src/lib/api.ts` (T9) — `getProfileLinks()` fetcher

  **Acceptance Criteria**:
  - [ ] `ls apps/links-astro/src/pages/` → contains `index.astro`
  - [ ] `ls apps/links-astro/src/components/` → contains `ProfileHeader.astro`, `LinkButtons.astro`, `SocialIcons.astro`
  - [ ] `grep -rn "\.tsx\|'react'" apps/links-astro/src/` → empty (no React files)
  - [ ] `bun --cwd apps/links-astro run build` → exits 0

  **QA Scenarios**:

  ```
  Scenario: Links page renders profile and link buttons
    Tool: Playwright
    Preconditions: Dev server port 4322 (or configured port); admin API returns ≥1 profile link
    Steps:
      1. Navigate to http://localhost:4322
      2. Assert `img` with profile avatar src is visible
      3. Assert ≥1 `a` elements inside `.link-buttons` or `[data-testid="link-buttons"]`
      4. Screenshot
    Expected Result: Profile header and link buttons rendered
    Failure Indicators: Empty page; 0 links; 404
    Evidence: .sisyphus/evidence/task-T18-links.png

  Scenario: Zero React hydration scripts loaded
    Tool: Playwright
    Preconditions: Same dev server
    Steps:
      1. Navigate to http://localhost:4322
      2. Assert no `<script>` with `type="module"` containing `react` in page source
    Expected Result: No React JS bundle loaded
    Failure Indicators: React scripts present in page
    Evidence: .sisyphus/evidence/task-T18-no-react.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-T18-links.png` — screenshot of links page
  - [ ] `.sisyphus/evidence/task-T18-no-react.txt` — script tag audit (confirms pure Astro)

  **Commit**: YES (groups with T18)
  - Message: `feat(links-astro): add home page with pure Astro components`
  - Files: `apps/links-astro/src/pages/index.astro`, `apps/links-astro/src/components/`
  - Pre-commit: `bun --cwd apps/links-astro run build`

---

- [x] T19. **ngl-svelte: Message Form UI** — `visual-engineering` | Wave 4 | Depends on: T10 | Blocks: T22

  **What to do**:
  1. Create `apps/ngl-svelte/src/routes/+page.svelte`:
     - Use `enhance` from `$app/forms` for progressive enhancement
     - Bind to the `actions` exported from `+page.server.ts` (T10) via `action="?/default"`
     - Show `form.error` if present; show success state if `form.success`
  2. Port the form UI from `apps/ngl/src/components/MessageForm.tsx` converting React to Svelte 5 Runes:
     - `useState('')` → `let message = $state('')`
     - `onChange` → `bind:value`
     - `className` → `class`
     - JSX → Svelte template (`{#if}`, `{#each}`, `{expression}`)
  3. Create character counter: `let remaining = $derived(500 - message.length)` — display as `{remaining} characters remaining`
  4. Style with app.css classes (T7); add `.ngl-form`, `.ngl-textarea`, `.ngl-submit` CSS classes
  5. Run `bun --cwd apps/ngl-svelte run build` — zero errors

  **Must NOT do**:
  - Do NOT use Svelte 4 `$:` reactive statements
  - Do NOT install React or any React dependencies
  - Do NOT implement authentication or sender identity (Phase 3)
  - Do NOT import from `@naufalrf/*`

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: React-to-Svelte 5 conversion with progressive enhancement UX
  - **Skills**: [`frontend-design`]
    - `frontend-design`: SvelteKit form component authoring, Svelte 5 runes
  - **Skills Evaluated but Omitted**:
    - `ui-ux-pro-max`: Single-screen form; no complex layout

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with T11–T18)
  - **Blocks**: T22
  - **Blocked By**: T10

  **References**:
  - `apps/ngl/src/components/MessageForm.tsx` — source React component to port to Svelte
  - `apps/ngl-svelte/src/routes/+page.server.ts` (T10) — `actions` export shape for `use:enhance` binding
  - SvelteKit use:enhance docs: https://kit.svelte.dev/docs/form-actions#progressive-enhancement — import from `$app/forms`
  - Svelte 5 runes docs: https://svelte.dev/docs/svelte/$state — `$state`, `$derived` usage

  **Acceptance Criteria**:
  - [ ] `ls apps/ngl-svelte/src/routes/` → contains `+page.svelte`
  - [ ] `grep -n "use:enhance" apps/ngl-svelte/src/routes/+page.svelte` → non-empty
  - [ ] `grep -n "\$state" apps/ngl-svelte/src/routes/+page.svelte` → non-empty (Svelte 5 runes)
  - [ ] `grep -n "\$:" apps/ngl-svelte/src/routes/+page.svelte` → empty (no old Svelte 4 syntax)
  - [ ] `bun --cwd apps/ngl-svelte run build` → exits 0

  **QA Scenarios**:

  ```
  Scenario: Form renders textarea and submit button
    Tool: Playwright
    Preconditions: `bun --cwd apps/ngl-svelte run dev` on port 5173
    Steps:
      1. Navigate to http://localhost:5173
      2. Assert `textarea` is visible
      3. Assert `button[type="submit"]` is visible
      4. Screenshot
    Expected Result: Form visible with textarea and submit button
    Failure Indicators: Empty page; missing elements; hydration error
    Evidence: .sisyphus/evidence/task-T19-form.png

  Scenario: Character counter updates on input
    Tool: Playwright
    Preconditions: Same dev server
    Steps:
      1. Navigate to http://localhost:5173
      2. Type "Hello" into textarea
      3. Assert counter text shows "495 characters remaining"
    Expected Result: Counter decrements as user types
    Failure Indicators: Counter static; shows wrong value
    Evidence: .sisyphus/evidence/task-T19-counter.txt

  Scenario: Empty message shows validation error via server action
    Tool: Playwright
    Preconditions: Same dev server
    Steps:
      1. Navigate to http://localhost:5173
      2. Leave textarea empty
      3. Click submit button
      4. Assert error message element is visible
    Expected Result: Validation error displayed without page reload (enhance)
    Failure Indicators: Full page reload; no error shown; 500 error
    Evidence: .sisyphus/evidence/task-T19-error.png
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-T19-form.png` — form screenshot
  - [ ] `.sisyphus/evidence/task-T19-counter.txt` — counter value after typing
  - [ ] `.sisyphus/evidence/task-T19-error.png` — screenshot of error state

  **Commit**: YES (groups with T19)
  - Message: `feat(ngl-svelte): add message form UI with Svelte 5 runes`
  - Files: `apps/ngl-svelte/src/routes/+page.svelte`
  - Pre-commit: `bun --cwd apps/ngl-svelte run build`

---

- [x] T20. **public-astro: SEO — Meta, OG, JSON-LD, Sitemap** — `unspecified-high` | Wave 5 | Depends on: T11–T17 | Blocks: none

  **What to do**:
  1. Update `BaseLayout.astro` to accept and render full SEO head: `title`, `description`, `canonicalUrl`, `ogImage`, `ogType` (default `website`)
  2. Add JSON-LD structured data blocks in `BaseLayout.astro`:
     - `Person` schema: name, jobTitle, url, sameAs (social profiles from about data or hardcoded from `.context/implementation/seo-strategy.yaml`)
     - `WebSite` schema: name, url, potentialAction SearchAction
  3. Update every page (`index.astro`, `projects/index.astro`, `projects/[slug].astro`, `about.astro`, `blogs.astro`, `contact.astro`, `ai-chatbot.astro`) to pass accurate title, description, canonicalUrl to `BaseLayout`/`PageLayout`
  4. For `projects/[slug].astro`: add `Article` JSON-LD with project title, description, datePublished from API data
  5. Install and configure `@astrojs/sitemap` integration: `bun add --cwd apps/public-astro @astrojs/sitemap`; add to `astro.config.mjs` with `site: import.meta.env.SITE_URL`
  6. Create `apps/public-astro/src/pages/robots.txt.ts` — export `GET` returning `User-agent: *\nAllow: /\nSitemap: {SITE_URL}/sitemap-index.xml`
  7. Add `SITE_URL=https://naufalrf.tech` to `.env.example`
  8. Run `bun --cwd apps/public-astro run build` — verify `dist/sitemap-index.xml` exists

  **Must NOT do**:
  - Do NOT add `noindex` to public pages
  - Do NOT implement blog article pages (blogs are external links only)
  - Do NOT import from `@naufalrf/*`

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Multi-page SEO wiring — structured data schemas, sitemap integration, canonical URLs across 7 pages
  - **Skills**: [`seo-audit`]
    - `seo-audit`: JSON-LD schema correctness, canonical URL patterns, sitemap format
  - **Skills Evaluated but Omitted**:
    - `frontend-design`: Not relevant — this is SEO metadata, not visual

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5 (with T21, T22)
  - **Blocks**: nothing (Wave 5 feeds into F-wave)
  - **Blocked By**: T11, T12, T13, T14, T15, T16, T17

  **References**:
  - `.context/implementation/seo-strategy.yaml` — canonical SEO metadata values (title templates, OG defaults, JSON-LD schemas)
  - `@astrojs/sitemap` docs: https://docs.astro.build/en/guides/integrations-guide/sitemap/ — setup and config
  - `apps/public/src/app/layout.tsx` — original metadata patterns to replicate
  - `apps/public/src/app/projects/[slug]/page.tsx` — original `generateMetadata` for article schema reference

  **Acceptance Criteria**:
  - [ ] `bun --cwd apps/public-astro run build` → exits 0
  - [ ] `ls apps/public-astro/dist/` → contains `sitemap-index.xml`
  - [ ] `ls apps/public-astro/dist/` → contains `robots.txt`
  - [ ] `grep -n 'application/ld+json' apps/public-astro/dist/index.html` → non-empty (JSON-LD present)
  - [ ] `grep -n '<meta property="og:' apps/public-astro/dist/index.html` → non-empty (OG tags present)

  **QA Scenarios**:

  ```
  Scenario: Home page has Person JSON-LD schema
    Tool: Bash
    Preconditions: Build completed (`dist/` exists)
    Steps:
      1. Run: `grep -c '"@type":"Person"' apps/public-astro/dist/index.html`
      2. Assert count ≥1
    Expected Result: Person schema present in home page HTML
    Failure Indicators: Count 0; JSON-LD script tag missing
    Evidence: .sisyphus/evidence/task-T20-jsonld.txt

  Scenario: Sitemap contains all page URLs
    Tool: Bash
    Preconditions: Build completed
    Steps:
      1. Run: `grep -c '<loc>' apps/public-astro/dist/sitemap-0.xml`
      2. Assert count ≥5 (home, projects, about, blogs, contact)
    Expected Result: ≥5 URLs in sitemap
    Failure Indicators: Sitemap missing; fewer than 5 URLs
    Evidence: .sisyphus/evidence/task-T20-sitemap.txt

  Scenario: robots.txt references sitemap
    Tool: Bash
    Preconditions: Build completed
    Steps:
      1. Run: `grep 'Sitemap' apps/public-astro/dist/robots.txt`
      2. Assert output contains `Sitemap:` line
    Expected Result: robots.txt has Sitemap directive
    Evidence: .sisyphus/evidence/task-T20-robots.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-T20-jsonld.txt` — grep count of JSON-LD in home page
  - [ ] `.sisyphus/evidence/task-T20-sitemap.txt` — sitemap URL count
  - [ ] `.sisyphus/evidence/task-T20-robots.txt` — robots.txt sitemap directive

  **Commit**: YES (groups with T20)
  - Message: `feat(public-astro): add SEO meta tags, JSON-LD schemas, sitemap, robots.txt`
  - Files: `apps/public-astro/src/layouts/BaseLayout.astro`, `apps/public-astro/src/pages/robots.txt.ts`, `apps/public-astro/astro.config.mjs`
  - Pre-commit: `bun --cwd apps/public-astro run build`

---

- [x] T21. **links-astro: SEO — Meta + OG Tags** — `quick` | Wave 5 | Depends on: T18 | Blocks: none

  **What to do**:
  1. Update `apps/links-astro/src/layouts/BaseLayout.astro` to accept and render: `<title>`, `<meta name="description">`, `<meta property="og:title">`, `<meta property="og:description">`, `<meta property="og:type" content="website">`, `<meta property="og:url">`, `<link rel="canonical">`
  2. Update `apps/links-astro/src/pages/index.astro` to pass: `title="NaufalRF | Links"`, `description="Naufal Rizqullah Firdaus links page"`, `canonicalUrl="https://links.naufalrf.tech"`
  3. Run `bun --cwd apps/links-astro run build` — verify `dist/index.html` contains OG tags

  **Must NOT do**:
  - Do NOT add `noindex` to links page
  - Do NOT import from `@naufalrf/*`

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple meta tag additions to existing layout — minimal work
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `seo-audit`: Overkill for basic meta tags on a link-tree page

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5 (with T20, T22)
  - **Blocks**: nothing
  - **Blocked By**: T18

  **References**:
  - `apps/links-astro/src/layouts/BaseLayout.astro` (T6 output) — add SEO head tags
  - `apps/links/src/app/layout.tsx` — original metadata values to replicate
  - `.context/implementation/seo-strategy.yaml` — OG defaults

  **Acceptance Criteria**:
  - [ ] `bun --cwd apps/links-astro run build` → exits 0
  - [ ] `grep -n 'og:title' apps/links-astro/dist/index.html` → non-empty
  - [ ] `grep -n 'canonical' apps/links-astro/dist/index.html` → non-empty

  **QA Scenarios**:

  ```
  Scenario: Built HTML contains OG and canonical tags
    Tool: Bash
    Preconditions: `bun --cwd apps/links-astro run build` completed
    Steps:
      1. Run: `grep -c 'property="og:title"' apps/links-astro/dist/index.html`
      2. Assert count ≥1
      3. Run: `grep -c 'rel="canonical"' apps/links-astro/dist/index.html`
      4. Assert count ≥1
    Expected Result: OG title and canonical link present in built HTML
    Failure Indicators: Count 0 for either check
    Evidence: .sisyphus/evidence/task-T21-seo.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-T21-seo.txt` — grep counts for OG + canonical tags

  **Commit**: YES (groups with T21)
  - Message: `feat(links-astro): add SEO meta and OG tags`
  - Files: `apps/links-astro/src/layouts/BaseLayout.astro`, `apps/links-astro/src/pages/index.astro`
  - Pre-commit: `bun --cwd apps/links-astro run build`

---

- [x] T22. **ngl-svelte: Security Headers + Noindex Meta** — `quick` | Wave 5 | Depends on: T19 | Blocks: none

  **What to do**:
  1. Create `apps/ngl-svelte/src/hooks.server.ts`:
     - Export `handle` SvelteKit hook using `resolve(event)`
     - Add response headers: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Content-Security-Policy: default-src 'self'; form-action 'self'`
  2. Update `apps/ngl-svelte/src/routes/+layout.svelte` head (or add a `+layout.svelte` `<svelte:head>` block) with `<meta name="robots" content="noindex, nofollow">` (NGL is a private tool — should not be indexed)
  3. Run `bun --cwd apps/ngl-svelte run build` — zero errors

  **Must NOT do**:
  - Do NOT add a sitemap to ngl-svelte
  - Do NOT set `robots: index` on NGL
  - Do NOT import from `@naufalrf/*`

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple hooks.server.ts + meta tag — minimal files
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `seo-audit`: Not needed — NGL should NOT be indexed

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5 (with T20, T21)
  - **Blocks**: nothing
  - **Blocked By**: T19

  **References**:
  - SvelteKit server hooks docs: https://kit.svelte.dev/docs/hooks#server-hooks-handle — `handle` export signature
  - `apps/ngl-svelte/src/routes/+layout.svelte` (T7 output) — add `<svelte:head>` noindex meta

  **Acceptance Criteria**:
  - [ ] `ls apps/ngl-svelte/src/` → contains `hooks.server.ts`
  - [ ] `grep -n 'X-Frame-Options' apps/ngl-svelte/src/hooks.server.ts` → non-empty
  - [ ] `grep -n 'noindex' apps/ngl-svelte/src/routes/+layout.svelte` → non-empty
  - [ ] `bun --cwd apps/ngl-svelte run build` → exits 0

  **QA Scenarios**:

  ```
  Scenario: Security headers present in dev server response
    Tool: Bash (curl)
    Preconditions: `bun --cwd apps/ngl-svelte run dev` on port 5173
    Steps:
      1. Run: `curl -sI http://localhost:5173 | grep -i 'x-frame-options'`
      2. Assert output contains `DENY`
    Expected Result: X-Frame-Options: DENY header set
    Failure Indicators: Empty output; header missing
    Evidence: .sisyphus/evidence/task-T22-headers.txt

  Scenario: Robots noindex meta tag present
    Tool: Bash
    Preconditions: Build completed
    Steps:
      1. Run: `grep -c 'noindex' apps/ngl-svelte/.svelte-kit/output/client/_app/pages/+page.svelte*.js || grep -c 'noindex' apps/ngl-svelte/build/index.html`
      2. Assert count ≥1
    Expected Result: noindex present in built output
    Evidence: .sisyphus/evidence/task-T22-noindex.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-T22-headers.txt` — curl -I output showing security headers
  - [ ] `.sisyphus/evidence/task-T22-noindex.txt` — noindex meta in built output

  **Commit**: YES (groups with T22)
  - Message: `feat(ngl-svelte): add security headers and noindex meta`
  - Files: `apps/ngl-svelte/src/hooks.server.ts`, `apps/ngl-svelte/src/routes/+layout.svelte`
  - Pre-commit: `bun --cwd apps/ngl-svelte run build`

---

- [x] T23. **Root Monorepo: Update Dev/Build Scripts** — `quick` | Wave 6 | Depends on: T20, T21, T22 | Blocks: T24

  **What to do**:
  1. Open `package.json` at monorepo root; update the `scripts` section:
     - `"dev:public"`: change `--filter public` → `--filter public-astro`
     - `"dev:links"`: change `--filter links` → `--filter links-astro`
     - `"dev:ngl"`: change `--filter ngl` → `--filter ngl-svelte`
     - `"build:public"`: change `--filter public` → `--filter public-astro`
     - `"build:links"`: change `--filter links` → `--filter links-astro`
     - `"build:ngl"`: change `--filter ngl` → `--filter ngl-svelte`
     - If a root-level `dev` or `build` script runs `--filter public` or similar, update all occurrences
  2. Check `pnpm-workspace.yaml` (or `package.json#workspaces`) — add `apps/public-astro`, `apps/links-astro`, `apps/ngl-svelte` to workspace list if not already present
  3. Run `pnpm install` at root to refresh workspace — confirm all 3 new apps recognized (they should already be since previous tasks ran `bun install`)
  4. Run `pnpm --filter public-astro build` → verify resolves correctly
  5. Run `pnpm --filter links-astro build` → verify resolves correctly
  6. Run `pnpm --filter ngl-svelte build` → verify resolves correctly

  **Must NOT do**:
  - Do NOT delete old `apps/public`, `apps/links`, `apps/ngl` entries yet (T24 handles that)
  - Do NOT break existing admin or rag-service scripts
  - Do NOT import from `@naufalrf/*`

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: JSON config edits only — 3 filter replacements in package.json
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - All skills: Not applicable for JSON script edits

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 6 (sequential after T20–T22)
  - **Blocks**: T24
  - **Blocked By**: T20, T21, T22

  **References**:
  - `package.json` — root monorepo scripts section
  - `pnpm-workspace.yaml` — workspace packages list

  **Acceptance Criteria**:
  - [ ] `grep -n 'public-astro' package.json` → non-empty (new filter in scripts)
  - [ ] `pnpm --filter public-astro build` → exits 0
  - [ ] `pnpm --filter links-astro build` → exits 0
  - [ ] `pnpm --filter ngl-svelte build` → exits 0

  **QA Scenarios**:

  ```
  Scenario: All three new apps build via pnpm filter
    Tool: Bash
    Preconditions: `pnpm install` run at root
    Steps:
      1. Run: `pnpm --filter public-astro build`
      2. Assert exit 0
      3. Run: `pnpm --filter links-astro build`
      4. Assert exit 0
      5. Run: `pnpm --filter ngl-svelte build`
      6. Assert exit 0
    Expected Result: All 3 builds succeed via pnpm filter
    Failure Indicators: `Package not found` error; non-zero exit for any app
    Evidence: .sisyphus/evidence/task-T23-builds.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-T23-builds.txt` — stdout of all 3 pnpm build commands

  **Commit**: YES (groups with T23)
  - Message: `chore(root): update monorepo scripts to point to new Astro/SvelteKit apps`
  - Files: `package.json`, `pnpm-workspace.yaml`
  - Pre-commit: `pnpm --filter public-astro build && pnpm --filter links-astro build && pnpm --filter ngl-svelte build`

---

- [x] T24. **Cleanup: Delete Deprecated Next.js Apps** — `quick` | Wave 6 | Depends on: T23 | Blocks: T25

  **What to do**:
  1. **Pre-deletion verification** — run ALL of the following and confirm all pass:
     - `pnpm --filter public-astro build` → exits 0
     - `pnpm --filter links-astro build` → exits 0
     - `pnpm --filter ngl-svelte build` → exits 0
  2. Delete `apps/public/` directory entirely: `rm -rf apps/public`
  3. Delete `apps/links/` directory entirely: `rm -rf apps/links`
  4. Delete `apps/ngl/` directory entirely: `rm -rf apps/ngl`
  5. Confirm old apps no longer appear in `pnpm-workspace.yaml` (workspace should now list only admin, rag-service, public-astro, links-astro, ngl-svelte)
  6. Run `pnpm install` at monorepo root — regenerate lockfile without old apps
  7. Run full monorepo build: `pnpm build` → verify admin and rag-service still build successfully alongside new apps

  **Must NOT do**:
  - Do NOT delete `apps/admin`, `apps/rag-service`, or any `packages/*` (package deletion is T25)
  - Do NOT delete before ALL 3 new app builds pass (step 1 is a hard gate)
  - Do NOT delete `.sisyphus/`, `AGENTS.md`, `TASKS.md`, or any planning/docs files

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Directory removal + lockfile regeneration — pure filesystem and package manager commands
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - All skills: Not applicable for directory deletion and package manager commands

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 6 (sequential, after T23)
  - **Blocks**: T25
  - **Blocked By**: T23

  **References**:
  - `pnpm-workspace.yaml` — update to remove `apps/public`, `apps/links`, `apps/ngl` entries after deletion
  - AGENTS.md#Git Workflow — commit and cleanup pattern

  **Acceptance Criteria**:
  - [ ] `ls apps/` → does NOT contain `public`, `links`, or `ngl` directories
  - [ ] `pnpm build` (full monorepo) → exits 0 (admin + rag-service + 3 new apps)
  - [ ] No `packages/*` touched (that's T25's job)

  **QA Scenarios**:

  ```
  Scenario: Old app directories are gone
    Tool: Bash
    Preconditions: Deletion commands run
    Steps:
      1. Run: `ls apps/`
      2. Assert output does NOT contain `public `, `links `, `ngl `
      3. Assert output DOES contain `admin`, `rag-service`, `public-astro`, `links-astro`, `ngl-svelte`
    Expected Result: Only new apps and unchanged apps remain
    Failure Indicators: Old directories still present
    Evidence: .sisyphus/evidence/task-T24-ls-apps.txt

  Scenario: Full monorepo build succeeds post-cleanup
    Tool: Bash
    Preconditions: `pnpm install` run after deletion
    Steps:
      1. Run: `pnpm build`
      2. Assert exit code 0
      3. Save stdout to evidence file
    Expected Result: All remaining apps build successfully
    Failure Indicators: Non-zero exit; missing workspace reference errors
    Evidence: .sisyphus/evidence/task-T24-full-build.txt
  ```

  **Evidence to Capture**:
  - [ ] `.sisyphus/evidence/task-T24-ls-apps.txt` — `ls apps/` output confirming old dirs gone
  - [ ] `.sisyphus/evidence/task-T24-full-build.txt` — full monorepo build stdout

  **Commit**: YES (final commit of Phase 2)
  - Message: `chore(cleanup): remove deprecated Next.js apps after successful Astro/SvelteKit migration`
  - Files: removed `apps/public/`, `apps/links/`, `apps/ngl/`; updated `pnpm-workspace.yaml`
  - Pre-commit: `pnpm build`

- [x] T25. **Delete ALL `packages/*` Workspace Packages + Clean Dead Dependencies** — `quick` | Wave 6 | Depends on: T24 | Blocks: F1–F4

  **What to do**:
  1. Remove ALL `@naufalrf/*` entries from `apps/admin/package.json` (dead deps: `@naufalrf/auth`, `@naufalrf/config`, `@naufalrf/sdk`, `@naufalrf/types`, `@naufalrf/ui`)
  2. Remove ALL `@naufalrf/*` entries from `apps/rag-service/package.json` (dead deps: `@naufalrf/sdk`, `@naufalrf/types`)
  3. Delete all 6 package directories: `packages/analytics/`, `packages/auth/`, `packages/config/`, `packages/sdk/`, `packages/types/`, `packages/ui/`
  4. Remove `- packages/*` line from `pnpm-workspace.yaml` (keep `- apps/*` only)
  5. Run `pnpm install` to regenerate lockfile without workspace packages
  6. Verify `pnpm build` succeeds (all apps including admin and rag-service)
  7. Verify `pnpm dev` starts without errors for admin and rag-service

  **Must NOT do**:
  - Do NOT modify any source code (`.ts`, `.tsx`) in `apps/admin/` or `apps/rag-service/` — only `package.json` cleanup
  - Do NOT delete `packages/` directory itself if pnpm-workspace still references it — remove workspace entry FIRST
  - Do NOT add any new dependencies to replace the removed packages

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Mechanical deletion + JSON editing, no logic required
  - **Skills**: []
    - No skills needed — file deletion and JSON editing only

  **Parallelization**:
  - **Can Run In Parallel**: NO (sequential after T24)
  - **Parallel Group**: Wave 6 (after T24)
  - **Blocks**: F1–F4
  - **Blocked By**: T24

  **References**:

  **Files to modify**:
  - `apps/admin/package.json` — remove 5 `@naufalrf/*` deps from `dependencies` or `devDependencies`
  - `apps/rag-service/package.json` — remove 2 `@naufalrf/*` deps from `dependencies` or `devDependencies`
  - `pnpm-workspace.yaml` — remove `- packages/*` line

  **Directories to delete (all 6)**:
  - `packages/analytics/` — unused analytics wrapper
  - `packages/auth/` — unused auth package
  - `packages/config/` — unused shared config
  - `packages/sdk/` — unused API SDK
  - `packages/types/` — unused shared types
  - `packages/ui/` — unused shared UI components

  **Evidence that packages are dead** (verified via grep):
  - `grep -r "@naufalrf/" apps/admin/src/` returns 0 matches
  - `grep -r "@naufalrf/" apps/rag-service/src/` returns 0 matches
  - All 3 new apps (public-astro, links-astro, ngl-svelte) never import `@naufalrf/*`

  **Acceptance Criteria**:
  - [ ] Zero `@naufalrf/*` entries in `apps/admin/package.json`
  - [ ] Zero `@naufalrf/*` entries in `apps/rag-service/package.json`
  - [ ] `packages/` directory does not exist OR is empty
  - [ ] `pnpm-workspace.yaml` has NO `packages/*` entry
  - [ ] `pnpm install` completes without errors (exit 0)
  - [ ] `pnpm build` completes without errors (exit 0) — ALL apps build
  - [ ] No source code changes in `apps/admin/src/` or `apps/rag-service/src/`

  **QA Scenarios:**

  ```
  Scenario: All packages deleted and workspace cleaned
    Tool: Bash
    Preconditions: T24 complete, old Next.js apps already deleted
    Steps:
      1. Run: test -d packages/analytics && echo 'FAIL: analytics exists' || echo 'PASS'
      2. Run: test -d packages/auth && echo 'FAIL: auth exists' || echo 'PASS'
      3. Run: test -d packages/config && echo 'FAIL: config exists' || echo 'PASS'
      4. Run: test -d packages/sdk && echo 'FAIL: sdk exists' || echo 'PASS'
      5. Run: test -d packages/types && echo 'FAIL: types exists' || echo 'PASS'
      6. Run: test -d packages/ui && echo 'FAIL: ui exists' || echo 'PASS'
      7. Run: grep -c '@naufalrf' apps/admin/package.json (expect: 0)
      8. Run: grep -c '@naufalrf' apps/rag-service/package.json (expect: 0)
      9. Run: grep 'packages' pnpm-workspace.yaml (expect: no output)
    Expected Result: All 9 checks pass — zero packages remain, zero dead deps
    Failure Indicators: Any 'FAIL' output, non-zero grep count, 'packages' in workspace yaml
    Evidence: .sisyphus/evidence/task-T25-packages-deleted.txt

  Scenario: Full monorepo build after package deletion
    Tool: Bash
    Preconditions: Packages deleted, lockfile regenerated
    Steps:
      1. Run: pnpm install (expect: exit 0, no unresolved workspace deps)
      2. Run: pnpm build (expect: exit 0, all apps build)
      3. Run: pnpm --filter admin build (expect: exit 0)
      4. Run: pnpm --filter rag-service build (expect: exit 0)
    Expected Result: All builds succeed without workspace package dependencies
    Failure Indicators: 'Cannot find module @naufalrf/*', build errors, unresolved deps
    Evidence: .sisyphus/evidence/task-T25-full-build.txt

  Scenario: No source code modifications in admin or rag-service
    Tool: Bash
    Preconditions: T25 complete
    Steps:
      1. Run: git diff --name-only apps/admin/src/ (expect: empty — no source changes)
      2. Run: git diff --name-only apps/rag-service/src/ (expect: empty — no source changes)
    Expected Result: Zero source file modifications in admin or rag-service
    Failure Indicators: Any file listed in diff output
    Evidence: .sisyphus/evidence/task-T25-no-source-changes.txt
  ```

  **Commit**: YES (final workspace cleanup)
  - Message: `chore(packages): delete all workspace packages and clean dead dependencies`
  - Files: removed `packages/*/`; updated `apps/admin/package.json`, `apps/rag-service/package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`
  - Pre-commit: `pnpm build`

---

## Final Verification Wave

> 4 review agents run in PARALLEL. ALL must APPROVE. Rejection → fix → re-run.

- [x] F1. **Plan Compliance Audit** — `oracle`
      Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, curl endpoint, run build). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in `.sisyphus/evidence/`. Confirm old apps deleted. Compare deliverables against plan.
      Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [x] F2. **Code Quality Review** — `unspecified-high`
      Run `bun --cwd apps/public-astro run build`, `bun --cwd apps/links-astro run build`, `bun --cwd apps/ngl-svelte run build`. Check all new app source files for: hardcoded API URLs, missing error handling on SDK calls, console.log left in, broken imports. Check no `next/` imports remain anywhere. Verify `.env.example` files exist and are complete.
      Output: `Build [PASS/FAIL per app] | Lint [PASS/FAIL] | Issues [N] | VERDICT`

- [x] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
      Start each app dev server (`bun --cwd apps/public-astro run dev &`, ports 3000/3002/3003). Execute EVERY QA scenario from EVERY task using Playwright — navigate to each page, assert key DOM content, capture screenshots. Test SDK data loads (projects, links visible). Test form presence in ngl-svelte. Save to `.sisyphus/evidence/final-qa/`.
      Output: `Pages [N/N pass] | Scenarios [N/N] | Screenshots saved | VERDICT`

- [x] F4. **Scope Fidelity Check** — `deep`
      For each task: compare "What to do" against actual implementation. Verify 1:1 — everything specified was built, nothing extra was added. Check: no auth added, no new features, no business logic rewritten. Confirm old apps are deleted. Confirm ALL packages deleted. Confirm root scripts updated. Flag any unaccounted files.
      Output: `Tasks [N/N compliant] | No-creep [PASS/FAIL] | Old apps [deleted/present] | Packages [deleted/present] | VERDICT`

---

## Commit Strategy

- **T1–T4**: `chore(infra): pre-migration audit and app scaffolding`
- **T5–T7**: `style(apps): port neumorphism design system to astro+svelte apps`
- **T8–T10**: `feat(api): add direct API clients to all 3 new apps`
- **T11–T19**: `feat(public-astro): implement all portfolio pages with React islands` / `feat(links-astro): implement links hub page` / `feat(ngl-svelte): implement message form page`
- **T20–T22**: `feat(seo): add metadata, sitemap, and security headers`
- **T23–T24**: `chore(infra): remove deprecated Next.js apps, update workspace scripts`
- **T25**: `chore(packages): delete all workspace packages and clean dead dependencies`

---

## Success Criteria

### Verification Commands

```bash
# All 3 apps build
bun --cwd apps/public-astro run build && echo "public-astro: ✅"
bun --cwd apps/links-astro run build && echo "links-astro: ✅"
bun --cwd apps/ngl-svelte run build && echo "ngl-svelte: ✅"

# Old apps gone
! test -d apps/public && echo "apps/public deleted: ✅"
! test -d apps/links && echo "apps/links deleted: ✅"
! test -d apps/ngl && echo "apps/ngl deleted: ✅"

# Root workspace build still works
pnpm build && echo "monorepo build: ✅"

# No Next.js imports in new apps
! grep -r "from 'next" apps/public-astro/src/ && echo "No next/ imports in public-astro: ✅"
! grep -r "from 'next" apps/links-astro/src/ && echo "No next/ imports in links-astro: ✅"
```

# All packages deleted

! test -d packages/analytics && ! test -d packages/auth && ! test -d packages/config && ! test -d packages/sdk && ! test -d packages/types && ! test -d packages/ui && echo "all packages deleted: ✅"

# No dead @naufalrf/\* deps in admin/rag-service

! grep -q '@naufalrf' apps/admin/package.json && echo "admin clean: ✅"
! grep -q '@naufalrf' apps/rag-service/package.json && echo "rag-service clean: ✅"

# No packages/\* in workspace

! grep -q 'packages' pnpm-workspace.yaml && echo "workspace clean: ✅"

### Final Checklist

- [ ] All 3 new apps build (exit 0)
- [ ] All 7 public-astro pages return HTTP 200
- [ ] links-astro home page returns HTTP 200
- [ ] ngl-svelte home page returns HTTP 200
- [ ] Neumorphism design system applied in all apps
- [ ] Direct API client integrated, data fetches have error fallback
- [ ] SEO metadata present on all public-astro pages
- [ ] `.env.example` in all 3 apps
- [ ] Old apps deleted
- [ ] Root pnpm build passes
- [ ] No `next/` imports in new apps
- [ ] All 6 `packages/*` directories deleted
- [ ] Zero `@naufalrf/*` in admin/rag-service `package.json`
- [ ] `pnpm-workspace.yaml` has no `packages/*` reference
- [ ] No source code changes in `apps/admin/src/` or `apps/rag-service/src/`
