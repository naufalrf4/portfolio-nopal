## [2026-03-01T14:30:00] Task T1: Pre-migration audit + env setup

### Component Audit Findings

- **Total components**: 63 `.tsx` files in `apps/public/src/features/`
- **Next.js dependencies**: 15 files (24%) use Next.js APIs
  - `next/image`: 11 files → Replace with Astro `<Image>` or `<img>`
  - `next/link`: 9 files → Replace with standard `<a href="">`
  - `next/navigation` (usePathname): 2 files → Use Astro.url.pathname or client-side router
- **Ready for direct port**: 48 files (76%) — no Next.js imports, portable as React islands

### Key Migration Insights

1. **Shared components are clean** — 11/11 shared components have zero Next.js deps
2. **Navigation components need client state** — Navbar + MobileBottomNav use usePathname for active link detection
3. **Image usage is heavy** — 11 components use next/image, will need systematic replacement strategy
4. **Client vs Server split is clear** — Most components are already stateless/server-compatible

### Environment Setup

- All 3 stub apps have scaffolds in place (astro.config.mjs, svelte.config.js)
- `.env.example` files created for all 3 apps with ADMIN_SERVICE_URL, ADMIN_SERVICE_TOKEN
- Deleted stray `package-lock.json` from links-astro (npm artifact)

### Next Steps for T5 (Design System)

- Port shared components first (NeuButton, NeuCard, etc.) — they're framework-agnostic
- Create Astro-specific wrappers for Image/Link where needed
- Pass Astro.url.pathname to client components for active state detection

## [2026-03-01T22:25:00] T2: public-astro integrations

### Packages Installed

**Integrations:**

- `@astrojs/react@^4.4.2` — React SSR support
- `@astrojs/tailwind@^6.0.2` — Tailwind CSS integration
- `@astrojs/node@^9.5.4` — Node.js SSR adapter (standalone mode)
- `@astrojs/sitemap@^3.7.0` — Automatic sitemap generation

**Dependencies:**

- `react@^19.2.4` + `react-dom@^19.2.4`
- `framer-motion@^12.34.3` — Animations
- `lucide-react@^0.575.0` — Icons

**Dev Dependencies:**

- `@types/react@^19.2.14`
- `@types/react-dom@^19.2.3`
- `typescript@^5.9.3`

### Build Result

✅ **PASS** — Build exits 0 in 2.2s

- Server mode enabled with Node.js adapter
- Client bundle: 194.63 kB (gzip: 60.99 kB)
- Sitemap generated successfully

### Configuration Created

1. **astro.config.mjs** — SSR + integrations
2. **tailwind.config.mjs** — Neuromorphic design tokens (shadows, colors, fonts)
3. **tsconfig.json** — Path aliases (`@/*`)

### Directory Structure Created

All target directories exist:

- `src/components/{layout,shared,home,projects,about,blogs,contact,chatbot}`
- `src/{layouts,lib,types,styles,pages/projects}`

### Issues Encountered

None — smooth setup with bun.

### T5 Ready

Design system migration can begin immediately. All integrations verified working.

## [2026-03-01] T4: ngl-svelte integrations

- Tailwind v4 via @tailwindcss/vite installed
- Build result: pass
- Any issues: svelte-check and build succeed, LSP diagnostics timed out (tool error)

## [2026-03-01] T3: links-astro integrations

- Build result: PASS (bun build exits 0 via @astrojs/node server build)
- Any issues: LSP diagnostics timed out (language server initializing). Build succeeded and configs verified manually.

## 2026-03-01T15:48:38Z Task: T6

- Created `apps/links-astro/src/styles/globals.css` with OKLCH variables and neumorphic utilities.
- Created `apps/links-astro/src/layouts/BaseLayout.astro` with Google Fonts and metadata support.
- Updated `apps/links-astro/src/pages/index.astro` to use `BaseLayout`.
- Removed default `Layout.astro`.
- Verified build with `bun run build` (success).
- Validated Tailwind configuration handles standard directives.

## ## 2026-03-01T15:49:05Z Task: T7

<findings>
- Created apps/ngl-svelte/src/app.css with Neumorphic Dark Theme (OKLCH) and utilities.
- Created apps/ngl-svelte/src/routes/+layout.svelte with Svelte 5 syntax and ngl-root wrapper.
- Created apps/ngl-svelte/src/routes/+layout.ts with prerender = false.
- Build and Check passed.
- Note: Tailwind 4 @import warning persists but is non-fatal.
</findings>
