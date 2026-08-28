# DESIGN.md — naufalrf.net Cross-App Design Contract

> **Authoritative.** This document is the single source of truth for visual decisions across all four frontend apps: `public-astro`, `links-astro`, `ngl-svelte`, and `admin`. Every color, font, spacing value, and motion rule traces back to a token in `@naufalrf/design-tokens`. If a value is not in this document or in `tokens.css`, it does not belong in the UI.

---

## 0. Source of Truth

| Artifact | Path | Role |
|---|---|---|
| Design tokens (CSS) | `packages/design-tokens/tokens.css` | Canonical custom properties + Tailwind 4 `@theme` map |
| Package | `@naufalrf/design-tokens` | Workspace package imported by all 4 apps' `globals.css` / `app.css` |
| This document | `DESIGN.md` (root) | Cross-app visual contract: principles, scene map, layout grammar, motion budgets, accessibility |

All four apps import tokens via `@import '@naufalrf/design-tokens';` at the top of their entry CSS. No app defines its own color tokens. The `neu-*` utility class names persist in admin as a backwards-compatible naming layer, but their values are flat dark-first shadows defined in admin `globals.css`.

---

## 1. Design Principles

1. **Dark-first.** Dark mode is the default across all apps. Light mode is an optional toggle via `[data-theme='light']`. Both modes must pass WCAG AA contrast.
2. **Technical, not generic SaaS.** Every visual element should feel connected to a builder identity (IoT, web, AI, automation). No template portfolio look.
3. **Proof, not placeholder.** Real screenshots, real data, real achievements. No empty states that look unfinished.
4. **Motion with purpose.** Animation serves navigation, hierarchy, or feedback. No decorative infinite loops on non-interactive elements.
5. **One token system.** `@naufalrf/design-tokens` is the only source. No app-local color definitions, no hardcoded hex values in components.

---

## 2. Design Tokens

### 2.1 Color

| Token | Dark (default) | Light (`[data-theme='light']`) | Function |
|---|---|---|---|
| `--bg` | `#0b0d10` | `#faf8f4` | Main background |
| `--bg-elevated` | `#14171b` | `#f2eee6` | Panel, sidebar, elevated surface |
| `--bg-card` | `#171b1f` | `#ffffff` | Card background |
| `--border` | `#262b31` | `#e4dfd5` | Divider, card border |
| `--border-hover` | `#3a434d` | `#d2caba` | Hover border state |
| `--text-primary` | `#e8eaed` | `#211c15` | Headings, primary body text |
| `--text-secondary` | `#8b93a1` | `#6b6558` | Descriptions, meta text |
| `--text-tertiary` | `#565e68` | `#9a9384` | Small labels, timestamps |
| `--teal` (primary accent) | `#3ed9c4` | `#0f8577` | Links, CTAs, "live" status |
| `--amber` (secondary accent) | `#f2a64c` | `#b5701e` | Achievement highlight, badge |
| `--teal-glow` | `rgba(62,217,196,0.14)` | `rgba(15,133,119,0.12)` | Accent glow overlay |
| `--teal-soft` | `rgba(62,217,196,0.08)` | `rgba(15,133,119,0.07)` | Subtle accent tint |
| `--amber-soft` | `rgba(242,166,76,0.1)` | `rgba(181,112,30,0.1)` | Subtle amber tint |
| `--error` (light only) | — | `#c2413d` | Error state |

### 2.2 Typography

| Role | Font | Tailwind Token |
|---|---|---|
| Display / Heading | `Space Grotesk` | `--font-display` |
| Body | `Inter` | `--font-sans` |
| Mono (tag, URL, date, code) | `JetBrains Mono` | `--font-mono` |

### 2.3 Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-container` | `16px` | Large containers, modals |
| `--radius-card` / `--radius-base` | `12px` | Cards, buttons, inputs |
| `--radius-inner` | `8px` | Inner elements |

### 2.4 Tailwind 4 `@theme` Mappings

The `@theme` block in `tokens.css` maps all CSS custom properties to Tailwind color utilities:

```
--color-bg → var(--bg)
--color-bg-elevated → var(--bg-elevated)
--color-bg-card → var(--bg-card)
--color-line → var(--border)
--color-line-hover → var(--border-hover)
--color-text-primary → var(--text-primary)
--color-text-secondary → var(--text-secondary)
--color-text-tertiary → var(--text-tertiary)
--color-teal → var(--teal)
--color-amber → var(--amber)
```

Admin additionally maps semantic Tailwind colors (`--color-background`, `--color-foreground`, `--color-card`, `--color-primary`, `--color-accent`, `--color-border`, `--color-muted`, etc.) to the same shared tokens so shadcn/ui and Radix components resolve correctly.

---

## 3. Cross-App Scope

| App | Theme | Tokens imported | Key visual direction |
|---|---|---|---|
| `public-astro` | Dark-first | `@naufalrf/design-tokens` in `globals.css` | Cinematic portfolio narrative, persistent WebGL scene (Track E), asymmetric editorial grids |
| `links-astro` | Dark-first | `@naufalrf/design-tokens` in `globals.css` | Compact identity transmission panel, lightweight ambience |
| `ngl-svelte` | Dark-first | `@naufalrf/design-tokens` in `app.css` | Anonymous message terminal, restrained radar/signal field |
| `admin` | Dark-first | `@naufalrf/design-tokens` in `globals.css` | Operational dashboard: persistent left nav, compact header, dense tables/forms, NO WebGL, NO cinematic animation |

---

## 4. Visual Blueprint — Scene & Layout Contract

### 4.1 Persistent Global Scene (public-astro only, Track E)

One WebGL canvas mounted from `BaseLayout.astro`, surviving Astro ClientRouter navigation. The canvas is `aria-hidden`, never contains essential content, and pauses when hidden.

**Scene-state map:**

| Route / Section | Scene state | Visual |
|---|---|---|
| Home hero | `terrain` | Particle terrain rising from lower viewport, pointer ripples, scroll flies camera |
| Home credibility | `circuit` | Terrain morphs into circuit traces routing toward domain labels |
| Home selected work | `circuit` (accent shift) | Active project chapter drives accent color |
| Home capability map | `circuit` | Interactive system diagram highlight |
| Home writing | `flow` | Flow-field lines, slower and lower contrast |
| Home guestbook | `signal` | Messages as radar pings around composer |
| Home contact | `signal` | Circuit traces converge into signal beacon |
| About | `circuit` | 3D circuit spine, milestone pulses |
| Projects archive | `circuit` | Architectural circuit paths framing active project |
| Project detail | `circuit` (chapter-aware) | Camera/material shift per chapter |
| Blogs | `flow` | Slow, low-contrast flow field for reading |
| Contact | `signal` | Reacts to submission progress only |
| AI assistant | `signal` (restrained) | Empty-state visualization, no WebGL competing with chat |

**Links-astro and NGL:** lightweight CSS/SVG ambience matching the terrain/circuit language. No full WebGL canvas.

**Admin:** no WebGL. Static CSS grid/circuit motifs only.

### 4.2 Layout Grammar

| Page | Layout family |
|---|---|
| Home hero | Asymmetric editorial: 7-8 col headline left, narrow right telemetry/CTA column, WebGL in negative space |
| Home credibility | Horizontal technical readout (not card grid) |
| Home selected work | Full-height cinematic chapters: sticky media one side, editorial summary other |
| Home capability map | Interactive system diagram (not cards) |
| Home writing | Lead article + compact publication index |
| Home guestbook | Transmission/radar composition around composer |
| Home contact | Large closing statement, one primary action |
| About | Split-screen: sticky identity rail + narrative canvas |
| Projects archive | Full-width project rows, year/domain index |
| Project detail | Full-bleed proof image, sticky chapter rail |
| Blogs | Lead story + publication index |
| Services | Capability catalogue: hero + technical/talks service grids, availability status, CTA rail |
| Portfolio | Deck content rendered server-side as scrolling editorial sections (retired client-side SPA slide viewer) |
| Contact | Communication console: channel rail + form workspace |
| AI assistant | Research cockpit: conversation canvas + citation rail |
| Links | Identity transmission panel: profile top, indexed destination rows |
| NGL | Message terminal: single prompt, focused field, telemetry |
| Admin | Persistent left sidebar + compact command header + content area (max-w-7xl) |

### 4.3 Page Transition Grammar

- Current scene dissolves into particles, camera shifts, next route's scene reforms.
- Respect Astro ClientRouter and `astro:page-load`; no full-canvas restart.
- Transform/opacity/filter only. No layout-property animation.
- Links/NGL: simple fade/slide transitions, no scene morphing.
- Admin: no page transition animation. Instant route changes.

### 4.4 Responsive Fallbacks

| Breakpoint | Behavior |
|---|---|
| Desktop >= 1024px | Full persistent WebGL, asymmetric grids, sticky chapters |
| Tablet 768-1023px | Reduced geometry count, shorter camera travel, no long pinned sections |
| Mobile < 768px | Static CSS/SVG scene snapshots, all content linear, no pointer-only info, no WebGL requirement |
| Reduced motion / low-power / WebGL failure | Static branded scene, immediate content, no feature loss |

---

## 5. Motion Budgets

### 5.1 Public-astro

| Element | Motion | Trigger |
|---|---|---|
| Hero entry | Fade + translateY | Page load |
| Section reveal | Fade + translateY, staggered | IntersectionObserver, once |
| CTA hover | Scale 0.98 active, brightness 1.1 hover | Pointer |
| Scroll-linked scene | Camera/material morph | Scroll progress (GSAP ScrollTrigger) |
| Ghost heading drift | Subtle translateX/opacity | Scroll progress |
| Project chapter | Sticky pin + progress | ScrollTrigger |

**Rules:**
- `transform` + `opacity` + `filter` only. Never animate `top`/`left`/`width`/`height`.
- `prefers-reduced-motion: reduce` collapses all motion to static.
- No `window.addEventListener('scroll')`. Use Motion `useScroll()` or GSAP `ScrollTrigger`.
- Marquee max 1 per page.

### 5.2 Links-astro / NGL-svelte

- Entry fade/slide on load.
- Hover brightness/border-color on interactive elements.
- NGL submission success: single meaningful pulse.
- `prefers-reduced-motion` fully static.

### 5.3 Admin

- **NO cinematic animation. NO WebGL.**
- Instant hover: `border-color` transition 150ms.
- Instant focus: `outline` ring 2px, `border-color` to accent.
- Loading: skeleton shimmer (existing `neu-skeleton` utility).
- Modal in/out: 200ms / 150ms scale+fade (existing `modal-in`/`modal-out` keyframes).
- No scroll-triggered reveals, no parallax, no magnetic physics.

---

## 6. Accessibility

- **Contrast:** WCAG AA minimum (4.5:1 body, 3:1 large text). Dark mode: `--text-primary` on `--bg` = 14.8:1. Light mode: `--text-primary` on `--bg` = 15.2:1.
- **Focus visibility:** `:focus-visible` → `outline: 2px solid var(--color-ring)` with `outline-offset: 2px`.
- **Keyboard nav:** all interactive elements reachable via Tab. No pointer-only information.
- **Reduced motion:** `prefers-reduced-motion: reduce` collapses all animation to static across all apps.
- **Semantic landmarks:** `<nav>`, `<main>`, `<aside>`, `<footer>` used correctly.
- **Canvas:** WebGL canvas is `aria-hidden="true"`, `pointer-events: none` when not interactive.
- **Color is not the only signal:** status indicators use text + icon + color, not color alone.

---

## 7. Admin Shell Contract

The admin shell is intentionally less cinematic. It prioritizes information density and operational clarity.

- **Persistent left sidebar** (`AppSidebar`): navigation, collapsible on desktop, hidden on mobile (replaced by `BottomNav`).
- **Compact command header**: sticky, `h-16`, backdrop-blur, system status indicator.
- **Content area**: `max-w-7xl mx-auto`, padding `p-4 md:p-6 lg:p-8`.
- **Tables/forms**: clear hierarchy with `border` dividers, not heavy shadows.
- **Shadows**: flat dark-first (`0 2px 8px -2px rgba(0,0,0,0.3)`). No light-neumorphic dual shadows.
- **No neu remnants**: the `neu-*` utility class names persist but map to flat dark-first values. No `rgba(163,177,198)` or `rgba(255,255,255,0.5)` light neumorphic shadows anywhere in admin source.

---

## 8. Accepted Visual Debt

- Admin `neu-*` utility class names are retained as a backwards-compatible naming layer. Their values are flat dark-first shadows, not neumorphic. Renaming all class references across 100+ files is deferred as low-risk cosmetic debt.
- Links-astro and NGL retain `neu-*` class names in component markup; values resolve to shared dark-first tokens.
- Public-astro Track E (persistent WebGL scene) is implemented in `apps/public-astro/src/components/shared/GlobalScene.tsx` and mounted from `BaseLayout.astro` with `transition:persist`. Scene state is driven by `[data-scene]` sections via IntersectionObserver, with a static CSS `.scene-fallback` for mobile, reduced motion, save-data, slow connections, and WebGL failure.
- Public-astro homepage sections duplicate their own `<section>` + eyebrow + heading markup instead of using the shared `Section` / `SectionHeader` primitives. `SectionHeader` currently has no consumers. Consolidating the section rhythm into the shared primitives is deferred until the next homepage layout pass.
- `graphify-out/` contains stale references to `neumorphic_styles` node labels from pre-migration code. These are generated artifacts and will self-update on the next `graphify update`.

---

## 9. Functional Preservation

The following must not change regardless of visual redesign:

- Routing, all API routes/proxies, form submissions (contact/booking/guestbook/anonymous)
- Google sign-in flow, AI chat logic, analytics, SEO/structured data
- Admin RBAC, all CRUD/form/table flows, all routes
- Public/links/ngl stay API-only consumers; no database access in shared packages
- Admin keeps API authority

---

## 10. Token Verification

All values in Section 2.1 match `packages/design-tokens/tokens.css` exactly. Run this check to verify:

```bash
grep -E '^\s+--(bg|border|text|teal|amber|radius)' packages/design-tokens/tokens.css
```

No legacy aliases (`--background`, `--surface`, `--foreground`, `--accent` as standalone custom properties) exist in the canonical tokens file. Admin maps these as Tailwind `@theme` color aliases pointing to shared tokens, which is the correct pattern.
