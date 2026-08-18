# Legacy Phase2 UI Baseline

The unfinished apps in this repository should follow the design and page structure of `../naufalrf-portfolio-phase2` unless the user gives a newer design direction.

## Visual language

- Light-mode neumorphism is the baseline.
- Primary palette evidenced in legacy and partially mirrored now:
  - background/surface: `#E0E5EC`
  - primary accent: `#3B82F6`
  - primary text: `#3D4852`
- Fonts evidenced in legacy docs: Plus Jakarta Sans, DM Sans, and JetBrains Mono.
- Motion should stay soft and utility-driven: fade, slide, zoom, shimmer, and reveal transitions.

## Shared primitives to preserve

- `NeuButton`
- `NeuCard`
- `NeuBadge`
- `Section`
- Navbar / Footer / Mobile navigation patterns
- Floating background shapes or similarly soft depth cues where already part of the design language

## Public-app page baseline

Legacy public app evidence shows these pages and sections as the baseline:

- `/` homepage with hero, technical expertise, featured projects, latest articles, and guestbook
- `/projects` list and `/projects/[slug]` detail pages
- `/about`
- `/blogs`
- `/contact`
- `/ai-chatbot`
- auth error/sign-in pages and 404 states

## Admin baseline

- Dashboard layout with sidebar, sticky header, bottom nav, and responsive content shell
- Route-group-based admin pages for projects, messages, settings, analytics, and content operations
- Consistent loading/error/empty-state handling per page

## Current carryover already visible in this repo

- `apps/public-astro/src/components/shared/NeuButton.tsx`
- `apps/public-astro/src/pages/index.astro`
- `apps/links-astro/src/pages/index.astro`
- `apps/ngl-svelte/src/routes/+page.svelte`
- `apps/admin/src/app/(dashboard)/layout.tsx`

## Rules for future UI work

- Prefer extending the existing `Neu*` vocabulary over introducing a second visual language.
- Keep light neumorphic surfaces, rounded corners, and soft shadow depth consistent across apps.
- Match legacy page coverage and section sequencing before inventing new layouts.
- Preserve mobile navigation and responsive spacing patterns from the legacy baseline.
