# AGENTS.md

Authoritative AI control contract for this repository.

## 1. Project Context

- **Name:** `apps/admin`
- **Purpose:** provide the admin dashboard plus the primary public, admin, and internal API authority for the portfolio ecosystem
- **Architecture:** Next.js 16 app-router application with server-side database access and dashboard route groups
- **Execution Model:** runs independently from `apps/admin`; serves dashboard UI and HTTP APIs to other apps
- **Critical Domains:** content management, auth gating, direct Neon/Postgres access, Admin-to-RAG service coordination

## 2. Technology Baseline

- **Framework:** Next.js 16.1.1
- **Runtime:** Bun for local scripts and the Next.js runtime for app execution
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4, Radix UI, dark-first design tokens from `@naufalrf/design-tokens`
- **Package Manager:** Bun via `bun.lock`
- **Version Policy:** use versions resolved from `package.json` and `bun.lock`; never guess from memory
- **State Management:** server components, route handlers, and app-local client state only
- **Database / ORM:** centralized Neon/Postgres through Drizzle ORM and `postgres`
- **Testing Stack:** `bun run typecheck`, `bun run build`, `bun run lint`; no dedicated automated test script currently exists

## 3. Architecture and Structure Rules

- Keep Admin as the primary content and API authority for the whole portfolio ecosystem.
- Preserve public, admin, and internal API namespace boundaries rather than collapsing them into one route surface.
- Keep direct database access in server-side code only.
- Preserve the simplified dark-first dashboard shell; legacy phase2 neumorphic design vocabulary was removed in the shared tokens migration, and the `neu-*` naming layer was renamed to behavior-based utilities (`surface-raised`, `surface-sunken`, `shape-container`, `motion-base`, `panel-card`, `card-inset`, `field-input`, `icon-btn`, `badge-pill`, `skeleton-shimmer`, ...). Do not reintroduce `neu-*` names.
- Light mode is attribute-driven: `globals.css` must keep `@custom-variant light (&:is([data-theme='light'] *))` to match the `data-theme` attribute written by `ThemeToggler`, and `<html>` keeps `suppressHydrationWarning` for the anti-FOUC script.

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

- Read this file, `../../AGENTS.md`, `../../PROGRESS.md`, and relevant `../../.context/` files before planning or coding.
- Do not guess missing auth, API, or database rules that are not evidenced in repo files.
- Keep changes scoped to this app unless an API contract or shared rule explicitly requires a cross-app update.
- Preserve existing behavior unless the user asks for a change or a documented contradiction must be repaired.
- Update `../../.context/` and this file when a task reveals durable admin-specific knowledge.
- Append a factual entry to `../../PROGRESS.md` after meaningful milestones, decisions, or discoveries.
- Do not add co-author trailers, assistant attribution, or alternate authorship metadata on the user's behalf.
- Run `bun run typecheck` and `bun run build` after meaningful code changes; also run `bun run lint` when touching linted TS/JS files.

## 7. Authority Order

1. this file
2. `../../AGENTS.md`
3. `../../.context/`
4. explicit user instruction that does not contradict verified project truth
5. repository code, manifests, env examples, and configs in this app

## 8. Self-Learn and Learned Rules

- Self-learn: add a short factual rule here when a task reveals a recurring admin-specific quirk, boundary, command caveat, or security constraint.
- `src/lib/auth-security.ts` enforces the admin email allowlist from `ADMIN_EMAILS`.
- `src/lib/services/ragIngest.ts` is a key Admin -> RAG integration point and uses `X-Service-Token`.
- `src/app/api/v1/public/about/route.ts` must normalize stored Admin `aboutMe` data into the frontend-facing public contract for skills, experience, and social links.
- Local seed/reset flow is Drizzle-based in `scripts/reset-db.ts` and `scripts/seed.ts`; do not reintroduce Prisma-named seed entrypoints.
- Remove stale Prisma config/runtime references when touched, but keep `_prisma_migrations` compatibility history unless the migration strategy is intentionally changed end to end.
- RAG seeding must go through Admin content exports plus `POST /ingest` with `type: all`; do not bypass Admin by pushing raw files directly into RAG.
- Public API CORS is request-scoped from `ADMIN_PUBLIC_API_ALLOWED_ORIGINS` in `src/proxy.ts`; keep the allowlist explicit and do not reintroduce wildcard browser origins.
- `src/lib/api/middleware/auth.ts` should prefer `ADMIN_INTERNAL_API_TOKEN` for internal service auth, while `src/lib/services/ragIngest.ts` and `scripts/seed.ts` should prefer `RAG_INGEST_SERVICE_TOKEN`; `ADMIN_SERVICE_TOKEN` is legacy fallback only.
- Anonymous public POST routes (`contact`, `messages`, `guestbook`, `bookings`, `auth/sync`, and `analytics`) should keep aligned in-memory rate limiting; do not leave one write surface unthrottled while hardening another.
- Guestbook posting authority must come from the signed token minted in `src/app/api/v1/public/auth/complete/route.ts` and verified in `src/app/api/v1/public/guestbook/route.ts`; do not fall back to trusting client-stored email identity.
- Project contexts are retired; project detail authority now lives in `projects.summary`, `projects.description`, `projects.content`, and `project_images`, with migration/backfill handled in Drizzle SQL before schema drops.
- Use `node --env-file=.env.local .next/standalone/server.js` for production-like local starts; standalone public routes can fail with DB env `ECONNREFUSED` if `.env.local` is not loaded explicitly.
- Local standalone Admin starts must copy `.next/static` (and `public/` when present) into `.next/standalone` before boot, otherwise sign-in/dashboard pages can 404 `_next/static/*` assets even when the build itself succeeded.
- Admin date/time presentation should stay anchored to `Asia/Jakarta` via `src/lib/utils/date.ts`; keep storage in UTC, but do not format admin dashboard times with raw runtime-local `Date` behavior.
- Admin sign-in and public guestbook sign-in now share Auth.js but must stay as separate entry flows: `/auth/signin` is admin-only, while `/public-auth/signin` remains the public guestbook bridge.
- Google Calendar / Meet admin connection is surfaced in Contact → Settings, but the encrypted refresh token and selected calendar authority live in `booking_settings` and are consumed by `src/app/api/v1/admin/bookings/[id]/status/route.ts`; do not move that OAuth state into `contact_settings`.
- `src/lib/email/config.ts` now uses pooled Nodemailer SMTP with only `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, and `EMAIL_FROM`; keep transactional email templates concise and reuse `src/lib/email/templates/partials.ts` plus `helper.ts` instead of duplicating markup.
- GA4 backend reporting now depends on `GA_PROPERTY_ID` plus `GA_SERVICE_ACCOUNT`; if live `runReport` returns property-level `PERMISSION_DENIED`, fix GA Admin property access for the service account before changing repo code.
- All `public.*` timestamp columns are `timestamptz` as of migration `0013_timestamptz_utc_normalization`; declare new ones as `timestamp({ precision: 3, withTimezone: true, mode: 'string' })`. Never reintroduce a naive `timestamp` column: Drizzle `mode: 'string'` returns it without an offset, and `new Date(thatString)` then resolves against the process TZ, which silently skews by -7h on a GMT+7 deploy.
- When drizzle-kit generates a `SET DATA TYPE ... with time zone` statement, it omits the `USING` clause and the conversion becomes session-TimeZone dependent. Always hand-edit it to `USING "col" AT TIME ZONE 'UTC'` before applying, otherwise existing UTC values are reinterpreted as local and the stored instant is corrupted permanently.
- Booking date/time math must go through the Jakarta primitives in `src/lib/utils/date.ts` (`jakartaWallClockToInstant`, `instantToJakartaWallClock`, `getJakartaDateKey`, `addDaysToDateKey`, `toDateKey`, `diffInDaysBetweenKeys`, `formatJakartaDateKeyLabel`). `booking_slots.date` + `time` are host wall-clock in WIB, not UTC and not the booker's zone. Three patterns are forbidden because they are deploy-TZ dependent: `new Date(new Date().toLocaleString('en-US', { timeZone }))`, `new Date(dateKey + 'T00:00:00')`, and `someDate.toISOString().split('T')[0]`.
- Google Calendar events must send `dateTime` as a bare local wall clock with no `Z` suffix plus an explicit `timeZone` (from `settings.timezone`). Sending `toISOString()` makes the offset authoritative and reduces `timeZone` to a display label, which is what previously pushed every event +7h. Event timezone authority is the host setting, never the booker's browser timezone.
- `src/lib/utils/date.ts` is the ONLY date/time authority in this app. `features/bookings/utils/dateUtils.ts`, `features/shared/utils/index.ts`, and `features/about/utils/formatters.ts` all delegate to it — do not reintroduce local copies of `formatDateISO`, `getWeekDates`, `isToday`, or month helpers, and never reintroduce the fake-local `getServerDate()` pattern (`now.getTime() + now.getTimezoneOffset()*60000 + 7*3600*1000`).
- Week boundaries must be computed in Jakarta date-key space (`getWeekStartKey` + `addDaysToDateKey`), never with `setDate`/`setHours`. `end.setHours(23,59,59,999)` on a UTC server is 06:59 WIB the NEXT day, which silently makes a "week" span 7 days instead of 6.
- Values produced by `jakartaWallClockToInstant` are instants at Jakarta midnight (= 17:00Z the previous day). Never read local calendar fields off them: use `getWeekdayIndex`/`getDayOfMonth` from `features/bookings/utils/dateUtils.ts`, not `date.getDay()`/`date.getDate()`.
- Distinguish three kinds of temporal values. Instants (`createdAt`, `timestamp`) → format with `formatDate`/`formatDateTime`/`formatJakartaTime`. Date-keys (`YYYY-MM-DD` strings from analytics buckets or `booking_slots.date`) → format with `formatDateKeyShort`/`formatJakartaDateKeyLabel`; `new Date('2026-08-27')` is UTC midnight and renders as the previous day west of UTC. Pure calendar dates (`YYYY-MM` experience months) → use `monthKeyToCalendarDate`/`calendarDateToMonthKey`, which are intentionally local-`Date` based because `date-picker.tsx` (date-fns) reads local fields; converting them to instants renders the wrong month.
- Rolling cutoffs use `subtractDaysFromNow` (elapsed-ms), not `setDate(getDate() - n)`. Daily analytics buckets use `getJakartaDateKey`, not `toISOString().split('T')[0]`.
- The drizzle client pins `connection: { timezone: 'Asia/Jakarta' }`, so `timestamptz` columns come back rendered as `+07`. Absolute instants are unaffected. This is only safe because no SQL in this app does date arithmetic (`date_trunc`, `CURRENT_DATE`, `::date`, `AT TIME ZONE`, `EXTRACT`); if you add any, re-check that assumption first.
