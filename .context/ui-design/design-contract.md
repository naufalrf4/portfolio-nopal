# Cross-App Design Contract (DESIGN.md)

The visual authority is root `DESIGN.md` — the single source of truth for all four frontend apps (`public-astro`, `links-astro`, `ngl-svelte`, `admin`). It replaced the legacy `../naufalrf-portfolio-phase2` neumorphic baseline; the user explicitly directed the migration (commits `f70d51b`, `a61a7e9`, `cfaf77c`).

## Token system

- One canonical CSS token source: `packages/design-tokens/tokens.css` (package `@naufalrf/design-tokens`).
- All apps import it via `@import '@naufalrf/design-tokens';` in their entry CSS. No app-local color tokens; no hardcoded hex in UI.
- **Dark-first.** Dark is the default; light is an optional `[data-theme='light']` toggle. Both pass WCAG AA.
- Key tokens: `--bg` `#0f1115` / `--bg-elevated` / `--bg-card`, `--border` `#1c2029`, `--text-primary` `#e8eaed`, `--teal` `#3ed9c4` (primary accent), `--amber` `#f2a64c` (secondary accent), `--green` (availability dots), `--error`.
- Typography: Space Grotesk (display), Inter (body), JetBrains Mono (meta/code) — mapped to `--font-display`, `--font-sans`, `--font-mono`.
- Radii: `--radius-container` 16px, `--radius-card`/`--radius-base` 12px, `--radius-inner` 8px.
- Shadows are flat dark-first (e.g. `0 2px 8px -2px rgba(0,0,0,0.3)`). No light neumorphic dual shadows (`rgba(163,177,198)` etc.).

## Per-app direction

| App | Direction |
|---|---|
| `public-astro` | Cinematic portfolio narrative, persistent WebGL scene (Track E), asymmetric editorial grids |
| `links-astro` | Compact identity transmission panel, lightweight ambience |
| `ngl-svelte` | Anonymous message terminal, restrained radar/signal field |
| `admin` | Operational dashboard: persistent left nav, compact header, dense tables/forms. **NO WebGL, NO cinematic animation** |

## Motion rules

- `transform`/`opacity`/`filter` only — never animate layout properties.
- `prefers-reduced-motion: reduce` collapses all motion to static.
- No `window.addEventListener('scroll')`; use `useScroll()`/ScrollTrigger. Marquee max 1 per page.
- Admin: instant hover border-color 150ms, skeleton shimmer (`neu-skeleton`), modal 200/150ms scale+fade. No scroll reveals, no parallax, no magnetic physics.

## Neu-naming debt (accepted, do not "fix")

- `neu-*` utility class names persist in `admin` (and links/ngl markup) as a backwards-compatible naming layer, but the values resolve flat dark-first tokens, not neumorphism. Renaming 100+ admin class references is deferred low-risk cosmetic debt.
- `public-astro` renamed components NeuCard→Card, NeuButton→Button, NeuBadge→Badge, NeuInput→Input, NeuTextarea→Textarea; zero `neu` references remain there.
- `graphify-out/` may contain stale `neumorphic_styles` node labels; they self-update on next `graphify update`.

## Functional preservation (non-negotiable during any visual work)

- Routing, all API routes/proxies, form submissions (contact/booking/guestbook/anonymous), Google sign-in, AI chat, analytics, SEO/structured data.
- Admin RBAC and all CRUD/form/table flows.
- Public/Links/NGL stay API-only consumers; Admin keeps API authority.

## Rules for future UI work

- Extend the shared token vocabulary; never introduce a second visual language or app-local colors.
- Track E (persistent WebGL scene in `public-astro`) is not yet implemented — current hero uses section-local effects; DESIGN.md section 8 lists it as accepted visual debt.
- Verify token parity with `grep -E '^\s+--(bg|border|text|teal|amber|radius)' packages/design-tokens/tokens.css` before changing UI values.
