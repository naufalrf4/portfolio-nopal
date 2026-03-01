# Plan 0: Prisma → Drizzle ORM Migration

## TL;DR

> **Quick Summary**: Replace Prisma ORM with Drizzle ORM across the entire admin app and auth package — 22 models, 4 enums, 72 API routes, 18 service files, auth adapter, seed script. Zero behavior changes.
>
> **Deliverables**:
>
> - Drizzle schema (schema.ts + relations.ts) matching all 22 Prisma models exactly
> - Drizzle DB client (index.ts) with postgres.js driver for Neon serverless
> - drizzle.config.ts + updated db:\* scripts
> - Decoupled packages/auth using @auth/drizzle-adapter
> - All 18 service files migrated to Drizzle query API
> - All 13 route files with direct Prisma calls migrated
> - Seed script rewritten for Drizzle
> - Validation schemas updated (enum imports)
> - All Prisma artifacts removed
>
> **Estimated Effort**: Large
> **Parallel Execution**: YES — 6 waves
> **Critical Path**: T1→T2→T3→T5→T8→T12→T18→T19→T20

---

## Context

### Original Request

Migrate from Prisma ORM to Drizzle ORM as Plan 0 of a 6-plan sequential migration (MASTER_PLAN.md). This is a pure infrastructure swap — zero behavior changes, zero schema changes, zero new features. The migration must preserve exact API response shapes, query ordering, transaction semantics, and error handling.

### Interview Summary

**Key Discussions**:

- User chose sequential plan generation: Plan 0 first, then Plans 1–5 after each completes
- User directed: "proceed without asking for permission" and "do not stop until all tasks are done"
- Previous session already committed `4860b05` updating all `.context/` and `docs/` to reflect the migration target stack

**Research Findings**:

- Complete Prisma schema mapped: 22 models, 4 enums, all relations, JSON columns (5), array columns (5), composite uniques (4), varchar limits (AnalyticsEvent)
- 41 files import Prisma across two sources: `@/lib/db/prisma` (38 files) and `@/prisma/generated/client/client` (15 files for enums/types)
- 5 files use `$transaction`: 4 batch reorder operations + 1 booking interactive transaction
- packages/auth has tight Prisma coupling: relative import to admin's prisma.ts, PrismaAdapter, prisma.user.upsert/findUnique in callbacks
- packages/types has NO Prisma dependency (safe, no changes needed)
- No test infrastructure exists (no jest/vitest configured)
- No Prisma middleware ($use/$extends), no connectOrCreate, no relation filters (some/every/none), no views, single generator
- Feature services (bookingDetail.ts, contactDetail.ts) use fetch NOT Prisma — no migration needed
- Drizzle patterns researched: @auth/drizzle-adapter table expectations, cuid2 $defaultFn, $onUpdate, jsonb, pgEnum, relations(), db.transaction()

### Metis Review

**Identified Gaps** (addressed):

- **Rollback strategy**: Keep prisma schema archived (not deleted) for emergency rollback
- **Implicit ordering**: Prisma returns insertion order by default; Drizzle has no implicit ordering → must add explicit `.orderBy()` to all queries
- **Transaction isolation**: Booking slot reservation needs `serializable` isolation level for race condition safety
- **Array column defaults**: Prisma `@default([])` → Drizzle `.default(sql\`'{}'\`)` (not null, empty array)
- **Enum value ordering**: Must match Prisma enum value order exactly in pgEnum definitions
- **Date serialization**: Drizzle returns native Date objects → ensure JSON.stringify produces same format
- **updatedAt auto-update**: Must verify $onUpdate works correctly after migration
- **Connection pooling**: postgres.js config must match serverless requirements (max connections, timeouts)
- **Count query pattern**: Prisma `.count()` → Drizzle `select({ count: count() }).from(table)`
- **Seed idempotency**: Seed script must handle "run twice" gracefully with ON CONFLICT

---

## Work Objectives

### Core Objective

Replace Prisma ORM with Drizzle ORM across `apps/admin` and `packages/auth`, preserving 100% API behavior equivalence with zero schema changes.

### Concrete Deliverables

- `apps/admin/src/lib/db/schema.ts` — 22 pgTable definitions + 4 pgEnum definitions
- `apps/admin/src/lib/db/relations.ts` — All Drizzle relation definitions
- `apps/admin/src/lib/db/index.ts` — Drizzle client with postgres.js
- `apps/admin/drizzle.config.ts` — drizzle-kit configuration
- `packages/auth/src/config.ts` — Refactored to use DrizzleAdapter
- `packages/auth/src/auth.ts` — Decoupled from admin's prisma.ts
- 18 migrated service files in `apps/admin/src/lib/api/handlers/`
- 13 migrated route files with direct DB calls
- Updated validation schemas (enum imports)
- Rewritten `apps/admin/prisma/seed.ts` for Drizzle
- Updated `apps/admin/package.json` (deps + scripts)
- Updated `packages/auth/package.json` (deps)

### Definition of Done

- [ ] `pnpm --filter admin typecheck` passes with zero errors
- [ ] `pnpm --filter admin build` succeeds
- [ ] Dev server starts and responds to requests
- [ ] All public API endpoints return identical response shapes
- [ ] Auth flow (Google OAuth sign-in) works end-to-end
- [ ] Transaction-based operations (booking, reorder) work correctly
- [ ] Seed script runs successfully (idempotent — can run twice)
- [ ] No Prisma imports remain anywhere in codebase
- [ ] `drizzle-kit studio` connects and shows all 22 tables

### Must Have

- Exact 1:1 schema equivalence (same tables, columns, types, constraints, indexes)
- All API response shapes preserved (field names, types, nesting)
- Transaction semantics preserved (especially booking slot reservation)
- Auth flow preserved (Google OAuth, session creation, JWT callbacks)
- Enum values in exact same order as Prisma schema
- Explicit `.orderBy()` on all queries (prevent implicit ordering changes)
- `updatedAt` auto-update via Drizzle's `$onUpdate`
- Connection pooling configured for Neon serverless

### Must NOT Have (Guardrails)

- **NO behavior changes** — API responses must be byte-for-byte equivalent (modulo date serialization precision)
- **NO schema changes** — no column renames, no new indexes, no type changes, no constraint additions
- **NO query optimizations** — make it WORK first; optimize in separate task
- **NO auth flow changes** — only replace the DB adapter, preserve callback logic
- **NO validation schema refactors** — change ONLY the enum import line
- **NO test infrastructure** — no jest/vitest setup during migration
- **NO scope creep** — no pagination improvements, no caching, no logging additions
- **NO `any` types** — strict TypeScript throughout, use Drizzle's type inference
- **NO new dependencies** beyond what MASTER_PLAN.md specifies (drizzle-orm, drizzle-kit, @auth/drizzle-adapter, postgres, @paralleldrive/cuid2)

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.
> Acceptance criteria requiring "user manually tests/confirms" are FORBIDDEN.

### Test Decision

- **Infrastructure exists**: NO
- **Automated tests**: None — no test framework configured
- **Framework**: N/A
- **QA approach**: Agent-Executed QA Scenarios exclusively (Playwright for auth UI, curl for APIs, Bash for build/typecheck)

### QA Policy

Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **API endpoints**: Use Bash (curl) — Send requests, assert status + response fields
- **Auth flow**: Use Playwright (playwright skill) — Navigate OAuth flow, verify session
- **Build/Type checks**: Use Bash — Run commands, assert exit codes
- **Database verification**: Use Bash (psql or drizzle-kit) — Query tables, verify structure

---

## Execution Strategy

### Parallel Execution Waves

> Maximize throughput by grouping independent tasks into parallel waves.
> Each wave completes before the next begins.

```
Wave 1 (Foundation — deps + schema + config):
├── Task 1: Install Drizzle deps, remove Prisma deps [quick]
├── Task 2: Write Drizzle schema (schema.ts — 22 models, 4 enums) [deep]
├── Task 3: Write Drizzle relations (relations.ts) [quick]
└── Task 4: Create drizzle.config.ts + update db:* scripts [quick]

Wave 2 (DB Client + Auth — depends on Wave 1):
├── Task 5: Replace DB client (prisma.ts → index.ts with postgres.js) [quick]
├── Task 6: Decouple packages/auth from Prisma [deep]
└── Task 7: Push schema to DB + verify table/enum counts [quick]

Wave 3 (Service Migration — Batch 1, depends on Wave 2):
├── Task 8: Migrate simple services (about, achievements, profile-links, blog-links, contact-settings) [unspecified-high]
├── Task 9: Migrate moderate services (projects, project-contexts, guestbook, knowledge-docs) [unspecified-high]
└── Task 10: Migrate moderate services (contacts, chat-logs, anonymous-messages, content-export) [unspecified-high]

Wave 4 (Service Migration — Batch 2 + Routes Batch 1, depends on Wave 3):
├── Task 11: Migrate complex services (bookings, booking-slots, booking-availability, booking-settings) [deep]
├── Task 12: Migrate complex service (analytics — groupBy + aggregations) [deep]
├── Task 13: Migrate public route files with direct Prisma calls [unspecified-high]
└── Task 14: Migrate admin route files with direct Prisma calls (stats, messages, fix-content, images) [unspecified-high]

Wave 5 (Remaining + Seed + Validation schemas):
├── Task 15: Migrate internal route files + cron job [quick]
├── Task 16: Update validation schemas (enum imports) [quick]
├── Task 17: Rewrite seed.ts for Drizzle [unspecified-high]
└── Task 18: Full typecheck + build verification [quick]

Wave 6 (Cleanup + Final Verification):
├── Task 19: Cleanup Prisma artifacts + update package.json [quick]
└── Task 20: Update .context/ files + TASKS/PROGRESS.md [quick]

Wave FINAL (After ALL tasks — independent review, 4 parallel):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Real manual QA — API equivalence testing (unspecified-high)
└── Task F4: Scope fidelity check (deep)

Critical Path: T1→T2→T5→T8→T11→T12→T18→T19→F1-F4
Parallel Speedup: ~60% faster than sequential
Max Concurrent: 4 (Waves 1, 3, 4)
```

### Dependency Matrix

| Task | Depends On       | Blocks           | Wave  |
| ---- | ---------------- | ---------------- | ----- |
| 1    | —                | 2, 3, 4, 5, 6    | 1     |
| 2    | 1                | 3, 5, 6, 7, 8-17 | 1     |
| 3    | 2                | 5, 8-17          | 1     |
| 4    | 1                | 7                | 1     |
| 5    | 2, 3             | 6, 7, 8-17       | 2     |
| 6    | 5                | 18               | 2     |
| 7    | 4, 5             | 17               | 2     |
| 8    | 5                | 18               | 3     |
| 9    | 5                | 18               | 3     |
| 10   | 5                | 18               | 3     |
| 11   | 5                | 18               | 4     |
| 12   | 5                | 18               | 4     |
| 13   | 8, 9, 10         | 18               | 4     |
| 14   | 8, 9, 10, 11, 12 | 18               | 4     |
| 15   | 5                | 18               | 5     |
| 16   | 2                | 18               | 5     |
| 17   | 5, 7             | 18               | 5     |
| 18   | 6-17             | 19               | 5     |
| 19   | 18               | 20               | 6     |
| 20   | 19               | F1-F4            | 6     |
| F1   | 20               | —                | FINAL |
| F2   | 20               | —                | FINAL |
| F3   | 20               | —                | FINAL |
| F4   | 20               | —                | FINAL |

### Agent Dispatch Summary

| Wave  | Tasks | Categories                                                             |
| ----- | ----- | ---------------------------------------------------------------------- |
| 1     | 4     | T1→`quick`, T2→`deep`, T3→`quick`, T4→`quick`                          |
| 2     | 3     | T5→`quick`, T6→`deep`, T7→`quick`                                      |
| 3     | 3     | T8→`unspecified-high`, T9→`unspecified-high`, T10→`unspecified-high`   |
| 4     | 4     | T11→`deep`, T12→`deep`, T13→`unspecified-high`, T14→`unspecified-high` |
| 5     | 4     | T15→`quick`, T16→`quick`, T17→`unspecified-high`, T18→`quick`          |
| 6     | 2     | T19→`quick`, T20→`quick`                                               |
| FINAL | 4     | F1→`oracle`, F2→`unspecified-high`, F3→`unspecified-high`, F4→`deep`   |

---

## TODOs

> Implementation tasks follow. EVERY task has: Recommended Agent Profile + Parallelization + QA Scenarios.
> **A task WITHOUT QA Scenarios is INCOMPLETE. No exceptions.**

- [x] 1. Install Drizzle Dependencies, Remove Prisma Dependencies

  **What to do**:
  - In `apps/admin/package.json`:
    - Remove dependencies: `@prisma/client`, `@prisma/adapter-pg`, `pg` (only if not used elsewhere)
    - Remove devDependencies: `prisma`
    - Add dependencies: `drizzle-orm`, `postgres` (Postgres.js driver), `@paralleldrive/cuid2`
    - Add devDependencies: `drizzle-kit`
    - Remove any `postinstall` script referencing `prisma generate`
  - In `packages/auth/package.json`:
    - Remove dependencies: `@auth/prisma-adapter`, `@prisma/client`
    - Add dependencies: `@auth/drizzle-adapter`
    - Add peerDependencies: `drizzle-orm`
  - Run `pnpm install` from monorepo root to update lockfile
  - Verify install succeeds with no peer dependency warnings

  **Must NOT do**:
  - Do NOT remove `pg` types if `@types/pg` is used elsewhere
  - Do NOT add any deps not listed above
  - Do NOT modify any source files — deps only

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple package.json edits + pnpm install
  - **Skills**: []
    - No specialized skills needed

  **Parallelization**:
  - **Can Run In Parallel**: NO — must complete first
  - **Parallel Group**: Wave 1 (starts first, blocks all others)
  - **Blocks**: Tasks 2, 3, 4, 5, 6
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `apps/admin/package.json` — Current deps to modify (has `@prisma/client`, `@prisma/adapter-pg`, `pg`, devDep `prisma`)
  - `packages/auth/package.json` — Current deps to modify (has `@auth/prisma-adapter: ^2.11.1`, `@prisma/client: ^7.2.0`)

  **External References**:
  - MASTER_PLAN.md Task 0.1 — Exact dependency list to install/remove

  **WHY Each Reference Matters**:
  - `apps/admin/package.json` — Contains the Prisma deps to remove and is where Drizzle deps get added
  - `packages/auth/package.json` — Contains the auth-specific Prisma adapter dep to swap
  - MASTER_PLAN.md Task 0.1 — Canonical source of which specific packages to add/remove

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Dependencies installed successfully
    Tool: Bash
    Preconditions: Clean monorepo state
    Steps:
      1. Run `pnpm install` from monorepo root
      2. Run `pnpm ls drizzle-orm --filter admin` — assert drizzle-orm is listed
      3. Run `pnpm ls postgres --filter admin` — assert postgres is listed
      4. Run `pnpm ls drizzle-kit --filter admin --dev` — assert drizzle-kit is listed
      5. Run `pnpm ls @paralleldrive/cuid2 --filter admin` — assert listed
      6. Run `pnpm ls @auth/drizzle-adapter --filter @naufalrf/auth` — assert listed
    Expected Result: All 5 new deps present, zero peer dependency errors
    Failure Indicators: pnpm install fails, any dep missing from ls output
    Evidence: .sisyphus/evidence/task-1-deps-installed.txt

  Scenario: Prisma deps removed
    Tool: Bash
    Preconditions: After pnpm install
    Steps:
      1. Run `cat apps/admin/package.json | grep -c '"prisma"\|"@prisma"'` — assert 0
      2. Run `cat packages/auth/package.json | grep -c '"@auth/prisma-adapter"\|"@prisma/client"'` — assert 0
      3. Run `cat apps/admin/package.json | grep -c 'postinstall'` — assert 0 (or no prisma reference)
    Expected Result: Zero Prisma references in either package.json
    Failure Indicators: Any grep returns > 0
    Evidence: .sisyphus/evidence/task-1-prisma-removed.txt
  ```

  **Commit**: YES (group alone)
  - Message: `chore(admin): install drizzle deps, remove prisma deps`
  - Files: `apps/admin/package.json`, `packages/auth/package.json`, `pnpm-lock.yaml`
  - Pre-commit: `pnpm install` succeeds

- [ ] 2. Write Drizzle Schema (schema.ts — 22 Models, 4 Enums)

  **What to do**:
  - Create `apps/admin/src/lib/db/schema.ts` with ALL 22 pgTable definitions and 4 pgEnum definitions
  - Translate EVERY model from `apps/admin/prisma/schema.prisma` to Drizzle pgTable syntax:
    - `@id @default(cuid())` → `text('id').primaryKey().$defaultFn(() => createId())`
    - `@updatedAt` → `timestamp('updated_at').$onUpdate(() => new Date())`
    - `DateTime @default(now())` → `timestamp('created_at').defaultNow().notNull()`
    - `String[]` → `text('column').array()` with `.default(sql\`'{}'\`)`for`@default([])`
    - `Json` → `jsonb('column')`
    - `Int @default(0)` → `integer('column').default(0).notNull()`
    - `Boolean @default(false)` → `boolean('column').default(false).notNull()`
    - `@db.VarChar(N)` → `varchar('column', { length: N })`
    - `@db.Text` → `text('column')`
    - `@db.Date` → `date('column')` (NOT timestamp — BookingSlot.date)
    - `@unique` → `.unique()`
    - `@@unique([field1, field2])` → add to pgTable 3rd arg: `(table) => ({ unq: unique().on(table.field1, table.field2) })`
    - `@@index([field])` → add to pgTable 3rd arg: `(table) => ({ idx: index().on(table.field) })`
    - `@@map("table_name")` → use as first arg to pgTable: `pgTable('table_name', {...})`
  - Define 4 pgEnums in EXACT Prisma value order:
    - `userRoleEnum = pgEnum('UserRole', ['ADMIN', 'USER'])` — note: Prisma has ADMIN first
    - `projectContextTypeEnum = pgEnum('ProjectContextType', ['CODE', 'LIVE_DEMO', 'FIGMA', 'BEHANCE', 'MEDIUM', 'YOUTUBE', 'OTHER_LINK', 'DOCUMENTATION'])`
    - `bookingStatusEnum = pgEnum('BookingStatus', ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'])`
    - `slotStatusEnum = pgEnum('SlotStatus', ['AVAILABLE', 'BOOKED', 'BLOCKED'])`
  - Foreign keys: `.references(() => parentTable.id, { onDelete: 'cascade' })` where Prisma has `onDelete: Cascade`
  - Table name mapping: Use Prisma's `@@map` value as pgTable first arg. For tables WITHOUT `@@map` (BlogLink, AboutMe), use the model name as-is ("BlogLink", "AboutMe") — check actual DB table names
  - Export ALL tables and enums as named exports
  - Import `createId` from `@paralleldrive/cuid2`
  - Import helpers from `drizzle-orm/pg-core`: pgTable, pgEnum, text, varchar, integer, boolean, timestamp, date, jsonb, uniqueIndex, index, unique
  - Import `sql` from `drizzle-orm` for array defaults
  - Add vector column placeholder for KnowledgeDoc: `// TODO: Plan 4 — add vector(1536) column for embeddings`
  - Models to define (in dependency order): User, Account, Session, VerificationToken, Project, ProjectContext, ProjectImage, BlogLink, GuestbookEntry, AnalyticsEvent, AnonymousMessage, ChatLog, ProfileLink, KnowledgeDoc, ContactForm, ContactSettings, BookingSlot, Booking, BookingSettings, BookingAvailability, AboutMe, Achievement

  **CRITICAL DETAILS FROM PRISMA SCHEMA**:
  - VerificationToken has NO `id` field — composite PK on `[identifier, token]`
  - VerificationToken, AnalyticsEvent, ProjectImage have NO `updatedAt`
  - AnalyticsEvent has specific varchar limits: page(100), entityType(50), eventType(20), ipAddress(45), countryCode(2), city(100)
  - BookingSlot.date uses `@db.Date` (date type, NOT timestamp)
  - AboutMe.bio uses `@db.Text`
  - Composite uniques: Account[provider, providerAccountId], VerificationToken[identifier, token], BookingSlot[date, time], BookingAvailability[dayOfWeek, startTime, endTime]
  - JSON columns: GuestbookEntry.reactions, AnalyticsEvent.data, ChatLog.messages, AboutMe.experience, AboutMe.socialLinks
  - Array columns: Project.techStack, Project.tags, BlogLink.tags, ContactSettings.blockedKeywords, AboutMe.roles, AboutMe.skills, Achievement.photos
  - Booking has unique constraint on `slotId` (1:1 with BookingSlot)

  **Must NOT do**:
  - Do NOT add columns not in Prisma schema
  - Do NOT change column types
  - Do NOT add indexes not in Prisma schema
  - Do NOT change enum value order
  - Do NOT rename any table or column (keep exact snake_case from @@map)

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Complex schema translation requiring exact precision for 22 models with edge cases (composite PKs, varchar limits, date vs timestamp, array defaults)
  - **Skills**: []
    - No specialized skills needed — pure TypeScript file creation

  **Parallelization**:
  - **Can Run In Parallel**: YES (after Task 1)
  - **Parallel Group**: Wave 1 (with Tasks 3, 4 — but 3 depends on 2)
  - **Blocks**: Tasks 3, 5, 6, 7, 8-17
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `apps/admin/prisma/schema.prisma` — THE source of truth for all 22 models, 4 enums, all constraints, all defaults. Read this ENTIRE file line by line.

  **API/Type References**:
  - `packages/types/index.ts` — Hand-written interfaces for reference (field names, but Prisma schema takes priority for DB-level details)

  **External References**:
  - Drizzle ORM docs: pgTable, pgEnum, column types — https://orm.drizzle.team/docs/column-types/pg
  - @paralleldrive/cuid2 — https://github.com/paralleldrive/cuid2
  - MASTER_PLAN.md Task 0.2 — Schema translation specifications

  **WHY Each Reference Matters**:
  - `schema.prisma` — ONLY source for exact column types, constraints, defaults, relations, indexes, composite uniques. Every line matters.
  - MASTER_PLAN.md Task 0.2 — Contains specific Prisma→Drizzle mapping rules and dependency order

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Schema file has all 22 tables
    Tool: Bash
    Preconditions: schema.ts file created
    Steps:
      1. Run `grep -c 'pgTable(' apps/admin/src/lib/db/schema.ts` — assert 22
      2. Run `grep -c 'pgEnum(' apps/admin/src/lib/db/schema.ts` — assert 4
      3. Run `grep 'export const.*pgTable' apps/admin/src/lib/db/schema.ts | wc -l` — assert 22
      4. Run `grep 'export const.*pgEnum' apps/admin/src/lib/db/schema.ts | wc -l` — assert 4
    Expected Result: 22 pgTable exports + 4 pgEnum exports
    Failure Indicators: Counts don't match
    Evidence: .sisyphus/evidence/task-2-table-count.txt

  Scenario: Critical schema details preserved
    Tool: Bash
    Preconditions: schema.ts file created
    Steps:
      1. Verify VerificationToken has NO 'id' column and has composite PK — grep for primaryKey pattern
      2. Verify AnalyticsEvent has varchar limits — grep for `varchar.*length: 100`, `length: 50`, `length: 20`, `length: 45`, `length: 2`
      3. Verify BookingSlot.date uses `date(` not `timestamp(` — grep for `date('date')`
      4. Verify array columns use `.array()` — grep for `.array()` count ≥ 7 (techStack, tags x3, blockedKeywords, roles, skills, photos)
      5. Verify JSON columns use `jsonb(` — grep count ≥ 5
      6. Verify composite uniques exist — grep for `unique().on` count ≥ 4
      7. Verify cascade deletes — grep for `onDelete: 'cascade'` count matches Prisma relations with cascade
    Expected Result: All critical schema details preserved exactly
    Failure Indicators: Any count mismatch
    Evidence: .sisyphus/evidence/task-2-schema-details.txt

  Scenario: TypeScript compiles
    Tool: Bash
    Preconditions: schema.ts created, drizzle-orm installed
    Steps:
      1. Run `pnpm --filter admin typecheck` (may have errors in OTHER files due to missing db client — that's expected)
      2. Verify schema.ts specifically has no errors — run lsp_diagnostics on the file
    Expected Result: schema.ts has zero TypeScript errors
    Failure Indicators: Type errors in schema.ts
    Evidence: .sisyphus/evidence/task-2-typecheck.txt
  ```

  **Commit**: YES (group with Task 3)
  - Message: `feat(admin): add drizzle schema and relations`
  - Files: `apps/admin/src/lib/db/schema.ts`, `apps/admin/src/lib/db/relations.ts`
  - Pre-commit: `pnpm --filter admin typecheck` (schema files only — other files may have errors)

- [ ] 3. Write Drizzle Relations (relations.ts)

  **What to do**:
  - Create `apps/admin/src/lib/db/relations.ts`
  - Define Drizzle `relations()` for ALL tables that have Prisma `@relation`:
    - User → Account (one-to-many), Session (one-to-many), GuestbookEntry (one-to-many)
    - Project → ProjectContext (one-to-many), ProjectImage (one-to-many)
    - BookingSlot → Booking (one-to-one, unique slotId)
  - Import all tables from `./schema`
  - Import `relations` from `drizzle-orm`
  - Use `one()` for belongsTo, `many()` for hasMany
  - Define BOTH sides of each relation (parent and child)
  - Export all relation definitions

  **Must NOT do**:
  - Do NOT add relations not in Prisma schema
  - Do NOT create circular relation imports

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Straightforward relation definitions following schema.ts structure
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on Task 2)
  - **Parallel Group**: Wave 1 (sequential after Task 2)
  - **Blocks**: Task 5
  - **Blocked By**: Task 2

  **References**:

  **Pattern References**:
  - `apps/admin/prisma/schema.prisma` — All `@relation` definitions, cascade rules
  - `apps/admin/src/lib/db/schema.ts` — Table exports to import (created in Task 2)

  **External References**:
  - Drizzle relations docs: https://orm.drizzle.team/docs/rqb
  - MASTER_PLAN.md Task 0.2 — Relations translation spec

  **WHY Each Reference Matters**:
  - `schema.prisma` — Defines WHICH relations exist and their cascade behavior
  - `schema.ts` — Need exact export names to import for relation definitions

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: All relations defined
    Tool: Bash
    Preconditions: relations.ts created
    Steps:
      1. Run `grep -c 'relations(' apps/admin/src/lib/db/relations.ts` — assert ≥ 8 (User, Account, Session, Project, ProjectContext, ProjectImage, BookingSlot, Booking, GuestbookEntry, plus any others)
      2. Run `grep -c 'many(' apps/admin/src/lib/db/relations.ts` — assert ≥ 5 (User→accounts/sessions/guestbook, Project→contexts/images)
      3. Run `grep -c 'one(' apps/admin/src/lib/db/relations.ts` — assert ≥ 5 (Account→user, Session→user, GuestbookEntry→user, ProjectContext→project, ProjectImage→project, Booking→slot)
      4. Run lsp_diagnostics on relations.ts — assert zero errors
    Expected Result: All Prisma relations mapped, zero TS errors
    Failure Indicators: Missing relations, type errors
    Evidence: .sisyphus/evidence/task-3-relations.txt
  ```

  **Commit**: YES (group with Task 2)
  - Message: `feat(admin): add drizzle schema and relations`
  - Files: `apps/admin/src/lib/db/relations.ts`
  - Pre-commit: lsp_diagnostics on relations.ts

- [ ] 4. Create drizzle.config.ts + Update db:\* Scripts

  **What to do**:
  - Create `apps/admin/drizzle.config.ts`:

    ```typescript
    import { defineConfig } from 'drizzle-kit';

    export default defineConfig({
      schema: './src/lib/db/schema.ts',
      out: './drizzle',
      dialect: 'postgresql',
      dbCredentials: {
        url: process.env.DATABASE_URL!,
      },
    });
    ```

  - Update `apps/admin/package.json` scripts:
    - `"db:generate": "drizzle-kit generate"` (was `prisma migrate dev`)
    - `"db:migrate": "drizzle-kit migrate"` (was `prisma migrate deploy`)
    - `"db:push": "drizzle-kit push"` (was `prisma db push`)
    - `"db:studio": "drizzle-kit studio"` (was `prisma studio`)
    - `"db:pull": "drizzle-kit introspect"` (was `prisma db pull`)
    - `"db:seed": "tsx prisma/seed.ts"` (keep, but will be updated in Task 17)
    - Remove any `"postinstall": "prisma generate"` script
  - Create `apps/admin/drizzle/` directory for migration output

  **Must NOT do**:
  - Do NOT change non-db scripts
  - Do NOT modify drizzle.config beyond what's specified

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Config file creation + script updates
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (after Task 1, independent of Tasks 2-3)
  - **Parallel Group**: Wave 1 (with Tasks 2, 3)
  - **Blocks**: Task 7
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `apps/admin/package.json` — Current db:\* scripts to replace
  - `apps/admin/prisma/` — Current Prisma output dir (migrations go to `drizzle/` instead)

  **External References**:
  - Drizzle Kit config: https://orm.drizzle.team/kit-docs/config-reference
  - MASTER_PLAN.md Task 0.4 — Config and script specifications

  **WHY Each Reference Matters**:
  - `package.json` — Need to see current script names to preserve them while changing implementations
  - MASTER_PLAN.md Task 0.4 — Specifies exact script mappings

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Drizzle config is valid
    Tool: Bash
    Preconditions: drizzle.config.ts created
    Steps:
      1. Verify file exists: `test -f apps/admin/drizzle.config.ts && echo PASS`
      2. Verify schema path is correct: `grep -q './src/lib/db/schema.ts' apps/admin/drizzle.config.ts && echo PASS`
      3. Verify dialect is postgresql: `grep -q "dialect: 'postgresql'" apps/admin/drizzle.config.ts && echo PASS`
    Expected Result: Config file exists with correct settings
    Failure Indicators: File missing, wrong schema path, wrong dialect
    Evidence: .sisyphus/evidence/task-4-config.txt

  Scenario: db:* scripts updated
    Tool: Bash
    Preconditions: package.json updated
    Steps:
      1. Run `cat apps/admin/package.json | jq '.scripts["db:generate"]'` — assert contains "drizzle-kit generate"
      2. Run `cat apps/admin/package.json | jq '.scripts["db:migrate"]'` — assert contains "drizzle-kit migrate"
      3. Run `cat apps/admin/package.json | jq '.scripts["db:push"]'` — assert contains "drizzle-kit push"
      4. Run `cat apps/admin/package.json | jq '.scripts["db:studio"]'` — assert contains "drizzle-kit studio"
      5. Run `cat apps/admin/package.json | jq '.scripts["db:pull"]'` — assert contains "drizzle-kit introspect"
      6. Verify no prisma references in scripts: `cat apps/admin/package.json | jq '.scripts' | grep -c prisma` — assert 0
    Expected Result: All db scripts point to drizzle-kit, zero prisma references
    Failure Indicators: Any script still references prisma
    Evidence: .sisyphus/evidence/task-4-scripts.txt
  ```

  **Commit**: YES (group with Task 5)
  - Message: `feat(admin): add drizzle config and db client`
  - Files: `apps/admin/drizzle.config.ts`, `apps/admin/package.json`
  - Pre-commit: File exists, scripts correct

- [ ] 5. Replace DB Client (prisma.ts → index.ts with postgres.js)

  **What to do**:
  - Create `apps/admin/src/lib/db/index.ts` with Drizzle client:

    ```typescript
    import { drizzle } from 'drizzle-orm/postgres-js';
    import postgres from 'postgres';
    import * as schema from './schema';
    import * as relations from './relations';

    const client = postgres(process.env.DATABASE_URL!, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    });

    export const db = drizzle(client, { schema: { ...schema, ...relations } });
    ```

  - Export `db` as the single database client
  - Configure postgres.js for Neon serverless (connection limits, timeouts)
  - Delete `apps/admin/src/lib/db/prisma.ts` (the old Prisma client)
  - Ensure the old `prisma.ts` export path (`import { prisma } from '@/lib/db/prisma'`) no longer exists — this will create import errors in all consuming files (expected, fixed in subsequent tasks)

  **Must NOT do**:
  - Do NOT migrate any service/route files yet — just the client
  - Do NOT add query logging or middleware
  - Do NOT add multiple database connections

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple file creation + deletion
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on Tasks 2, 3)
  - **Parallel Group**: Wave 2
  - **Blocks**: Tasks 6, 7, 8-17
  - **Blocked By**: Tasks 2, 3

  **References**:

  **Pattern References**:
  - `apps/admin/src/lib/db/prisma.ts` — Current DB client to replace (PrismaClient + PrismaPg adapter + pg.Pool singleton via globalThis)
  - `apps/admin/src/lib/db/schema.ts` — Schema created in Task 2 (import target)
  - `apps/admin/src/lib/db/relations.ts` — Relations created in Task 3 (import target)

  **External References**:
  - Drizzle postgres.js setup: https://orm.drizzle.team/docs/get-started-postgresql#postgresjs
  - MASTER_PLAN.md Task 0.3 — DB client specification

  **WHY Each Reference Matters**:
  - `prisma.ts` — Understand current singleton pattern and globalThis caching (Drizzle's postgres.js handles pooling natively)
  - Schema/relations imports — Need correct import paths for the drizzle() config

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: DB client file created correctly
    Tool: Bash
    Preconditions: schema.ts and relations.ts exist from Tasks 2-3
    Steps:
      1. Verify file exists: `test -f apps/admin/src/lib/db/index.ts && echo PASS`
      2. Verify exports db: `grep -q 'export const db' apps/admin/src/lib/db/index.ts && echo PASS`
      3. Verify imports postgres: `grep -q "from 'postgres'" apps/admin/src/lib/db/index.ts && echo PASS`
      4. Verify imports schema: `grep -q "from './schema'" apps/admin/src/lib/db/index.ts && echo PASS`
      5. Verify connection config has max: `grep -q 'max:' apps/admin/src/lib/db/index.ts && echo PASS`
    Expected Result: All checks pass
    Failure Indicators: Missing file, missing exports, missing config
    Evidence: .sisyphus/evidence/task-5-db-client.txt

  Scenario: Old Prisma client removed
    Tool: Bash
    Preconditions: index.ts created
    Steps:
      1. Verify prisma.ts deleted: `test ! -f apps/admin/src/lib/db/prisma.ts && echo PASS`
      2. Verify no prisma.ts backup left: `ls apps/admin/src/lib/db/ | grep -v 'index\|schema\|relations'` — should be empty or only expected files
    Expected Result: prisma.ts no longer exists
    Failure Indicators: prisma.ts still present
    Evidence: .sisyphus/evidence/task-5-prisma-removed.txt
  ```

  **Commit**: YES (group with Task 4)
  - Message: `feat(admin): add drizzle config and db client`
  - Files: `apps/admin/src/lib/db/index.ts`, deleted `apps/admin/src/lib/db/prisma.ts`
  - Pre-commit: File structure correct

- [ ] 6. Decouple packages/auth from Prisma

  **What to do**:
  - Update `packages/auth/src/config.ts`:
    - Replace `import { PrismaAdapter } from '@auth/prisma-adapter'` → `import { DrizzleAdapter } from '@auth/drizzle-adapter'`
    - Change function signature: `createAuthConfig(prisma: any)` → `createAuthConfig(db: any, authCallbacks: AuthDbCallbacks)`
    - Define `AuthDbCallbacks` interface:
      ```typescript
      interface AuthDbCallbacks {
        getUserByEmail(email: string): Promise<{ id: string; role: string } | null>;
        upsertUser(data: { email: string; name?: string; image?: string }): Promise<void>;
      }
      ```
    - Replace `adapter: PrismaAdapter(prisma)` → `adapter: DrizzleAdapter(db)`
    - Replace `prisma.user.upsert(...)` in signIn callback → `authCallbacks.upsertUser(...)`
    - Replace `prisma.user.findUnique(...)` in jwt callback → `authCallbacks.getUserByEmail(...)`
  - Update `packages/auth/src/auth.ts`:
    - Remove `import { prisma } from '../../../apps/admin/src/lib/db/prisma'` (the tight coupling)
    - This file will need to import from admin's new db client — but since packages shouldn't import from apps, restructure:
      - Option: Move auth initialization INTO `apps/admin` and have packages/auth export only the config factory
      - OR: Accept the db instance as a parameter and initialize in admin
    - Export `createAuth(db, callbacks)` function instead of pre-initialized auth
  - Update `packages/auth/src/index.ts` — adjust exports
  - Create `apps/admin/src/lib/auth.ts` — initialize auth with Drizzle db:

    ```typescript
    import { createAuthConfig } from '@naufalrf/auth';
    import { db } from '@/lib/db';
    import { eq } from 'drizzle-orm';
    import { users } from '@/lib/db/schema';

    const authCallbacks = {
      async getUserByEmail(email: string) {
        return db.query.users.findFirst({ where: eq(users.email, email) });
      },
      async upsertUser({ email, name, image }) {
        await db
          .insert(users)
          .values({ email, name, image, role: 'ADMIN' })
          .onConflictDoUpdate({ target: users.email, set: { name, image, role: 'ADMIN' } });
      },
    };

    export const { auth, signIn, signOut, handlers } = createAuthConfig(db, authCallbacks);
    ```

  - Update ALL admin files that import from `packages/auth` to import from the new `@/lib/auth.ts` if they need `auth`, `signIn`, `signOut`
  - Verify `@auth/drizzle-adapter` table name expectations match our schema (it expects `user`, `account`, `session`, `verificationToken` tables — check if our `@@map` names match)

  **Must NOT do**:
  - Do NOT change NextAuth v5 config structure
  - Do NOT add new auth providers
  - Do NOT change session strategy
  - Do NOT modify auth callback logic beyond DB adapter swap

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Complex decoupling requiring understanding of NextAuth internals, adapter patterns, and cross-package imports
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on Task 5)
  - **Parallel Group**: Wave 2 (after Task 5)
  - **Blocks**: Task 18
  - **Blocked By**: Task 5

  **References**:

  **Pattern References**:
  - `packages/auth/src/config.ts` — Current auth config: `createAuthConfig(prisma)`, PrismaAdapter usage, signIn/jwt callbacks with prisma.user.upsert/findUnique
  - `packages/auth/src/auth.ts` — Current tight coupling: `import { prisma } from '../../../apps/admin/src/lib/db/prisma'`, exports auth/signIn/signOut
  - `packages/auth/src/index.ts` — Current package exports
  - `packages/auth/src/types.ts` — Auth types (Session extension)
  - `packages/auth/package.json` — Current deps
  - `apps/admin/src/lib/api/middleware/auth.ts` — withAuth/withAdminAuth HOFs that use auth() from packages/auth

  **External References**:
  - @auth/drizzle-adapter docs: https://authjs.dev/getting-started/adapters/drizzle
  - @auth/drizzle-adapter expected table structure — need user, account, session, verificationToken tables
  - MASTER_PLAN.md Task 0.5 — Auth decoupling specification

  **WHY Each Reference Matters**:
  - `config.ts` — Contains the exact prisma calls to replace (upsert in signIn, findUnique in jwt)
  - `auth.ts` — Contains the tight coupling that MUST be broken (relative path import)
  - `middleware/auth.ts` — Consumes auth() — need to verify import path still works after refactor
  - @auth/drizzle-adapter — Need to verify table name expectations vs our schema

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: No Prisma imports in auth package
    Tool: Bash
    Preconditions: Auth package refactored
    Steps:
      1. Run `rg "from.*prisma" packages/auth/src/` — assert zero matches
      2. Run `rg "from.*@prisma" packages/auth/src/` — assert zero matches
      3. Run `rg "PrismaAdapter" packages/auth/src/` — assert zero matches
      4. Run `cat packages/auth/package.json | grep -c '@prisma'` — assert 0
    Expected Result: Zero Prisma references in entire auth package
    Failure Indicators: Any Prisma import found
    Evidence: .sisyphus/evidence/task-6-auth-no-prisma.txt

  Scenario: No relative import to admin app
    Tool: Bash
    Preconditions: Auth package refactored
    Steps:
      1. Run `rg '\.\./' packages/auth/src/` — assert no relative imports pointing to apps/
      2. Run `rg 'apps/admin' packages/auth/src/` — assert zero matches
    Expected Result: Auth package has no coupling to admin app file paths
    Failure Indicators: Any relative path to admin
    Evidence: .sisyphus/evidence/task-6-auth-decoupled.txt

  Scenario: TypeScript compiles
    Tool: Bash
    Preconditions: Auth refactored, admin auth.ts created
    Steps:
      1. Run lsp_diagnostics on packages/auth/src/config.ts — assert zero errors
      2. Run lsp_diagnostics on packages/auth/src/auth.ts — assert zero errors
      3. Run lsp_diagnostics on apps/admin/src/lib/auth.ts — assert zero errors
    Expected Result: All auth files compile without errors
    Failure Indicators: Type errors
    Evidence: .sisyphus/evidence/task-6-auth-typecheck.txt
  ```

  **Commit**: YES (alone)
  - Message: `refactor(auth): decouple from prisma, use drizzle adapter`
  - Files: `packages/auth/src/config.ts`, `packages/auth/src/auth.ts`, `packages/auth/src/index.ts`, `packages/auth/package.json`, `apps/admin/src/lib/auth.ts`
  - Pre-commit: `pnpm --filter admin typecheck`

- [x] 7. Push Schema to DB + Verify Table/Enum Counts

  **What to do**:
  - Run `pnpm --filter admin db:push` to push Drizzle schema to the database
  - This should be a NO-OP since the DB already has these tables from Prisma
  - If drizzle-kit reports differences, investigate BEFORE applying — the schema should match exactly
  - Verify all 22 tables exist in the database
  - Verify all 4 enums exist in the database
  - If using `db:push`, it will compare Drizzle schema against live DB and report any drift

  **Must NOT do**:
  - Do NOT force-push if there are differences (investigate first)
  - Do NOT drop and recreate tables
  - Do NOT modify existing data

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single command execution + verification
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on Tasks 4, 5)
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 17
  - **Blocked By**: Tasks 4, 5

  **References**:

  **Pattern References**:
  - `apps/admin/src/lib/db/schema.ts` — Schema to push
  - `apps/admin/drizzle.config.ts` — Config for drizzle-kit

  **External References**:
  - Drizzle Kit push: https://orm.drizzle.team/kit-docs/commands#prototyping-with-db-push
  - MASTER_PLAN.md Task 0.8 — Migration specification

  **WHY Each Reference Matters**:
  - schema.ts — The exact schema being pushed; any mismatch means schema.ts needs fixing
  - drizzle.config.ts — Must point to correct schema path and DATABASE_URL

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Schema push succeeds (or is no-op)
    Tool: Bash
    Preconditions: DB client configured, schema.ts complete, DATABASE_URL set
    Steps:
      1. Run `pnpm --filter admin db:push` — capture output
      2. If output says "No changes detected" or "Already in sync" → PASS
      3. If output shows changes → INVESTIGATE: diff the changes, determine if they're expected
      4. If changes are safe (e.g., adding comments) → allow; if destructive → FAIL and fix schema.ts
    Expected Result: Push succeeds, zero destructive changes
    Failure Indicators: Push fails, or reports DROP/ALTER that would lose data
    Evidence: .sisyphus/evidence/task-7-db-push.txt

  Scenario: All tables and enums exist
    Tool: Bash
    Preconditions: Schema pushed
    Steps:
      1. Verify table count — run a query via the admin API or drizzle-kit studio
      2. Start dev server briefly, hit a simple endpoint like `/api/v1/public/about` to verify DB connectivity
    Expected Result: Dev server connects to DB, endpoint returns data
    Failure Indicators: Connection refused, query errors, table not found
    Evidence: .sisyphus/evidence/task-7-db-verify.txt
  ```

  **Commit**: YES (alone)
  - Message: `chore(admin): push drizzle schema to database`
  - Files: Any migration files generated in `apps/admin/drizzle/`
  - Pre-commit: `pnpm --filter admin db:push` succeeds

- [x] 8. Migrate Simple Services to Drizzle

  **What to do**:
  - Migrate 5 service files from Prisma to Drizzle query syntax:
    - `about.service.ts` — Replace `prisma.aboutMe.findFirst/create/update` with Drizzle `db.select().from(aboutMe)`, `db.insert(aboutMe)`, `db.update(aboutMe).set().where()`. Handle `Prisma.DbNull` → Drizzle `sql\`null\`` for JSON columns (experience, socialLinks). Convert upsert pattern to findFirst+create/update conditional.
    - `achievements.service.ts` — Replace findMany/findUnique/create/update/delete. Convert `$transaction` reorder to `db.transaction(async (tx) => { ... })`. Replace `Prisma.AchievementWhereInput` with inline Drizzle `where` clauses using `eq()`, `and()`. Replace toggleVisibility find+negate pattern.
    - `profile-links.service.ts` — Same CRUD+reorder pattern as achievements. Convert `$transaction` reorder. Replace `Prisma.ProfileLinkWhereInput/CreateInput/UpdateInput` with direct Drizzle operations.
    - `blog-links.service.ts` — Replace `aggregate({ _max: { order: true } })` with `db.select({ maxOrder: max(blogLinks.order) }).from(blogLinks)`. Convert `$transaction` reorder. Handle date parsing in create. Replace `Prisma.BlogLinkWhereInput/UpdateInput`.
    - `contact-settings.service.ts` — Replace findFirst/create/update. Simplest service — no Prisma type imports, just query conversion.
  - Replace ALL import statements:
    - `import { prisma } from '@/lib/db/prisma'` → `import { db } from '@/lib/db'`
    - `import { Prisma } from '@/prisma/generated/client/client'` → Remove entirely (Drizzle doesn't use namespace types)
  - Add Drizzle imports: `import { eq, and, asc, desc, sql, max } from 'drizzle-orm'` as needed
  - Add schema imports: `import { aboutMe, achievements, profileLinks, blogLinks, contactSettings } from '@/lib/db/schema'`
  - Convert ALL `.orderBy()` calls — Prisma implicit ordering → Drizzle explicit `orderBy(asc(table.column))`
  - Ensure array column defaults use `sql\`'{}'\`` where needed
  - Handle the reorder `$transaction` pattern consistently: `db.transaction(async (tx) => { for (const [index, id] of items.entries()) { await tx.update(table).set({ order: index }).where(eq(table.id, id)); } })`

  **Must NOT do**:
  - Do NOT change any service method signatures (same params, same return shapes)
  - Do NOT change any business logic or validation
  - Do NOT add comments explaining Drizzle syntax
  - Do NOT import from `drizzle-orm/pg-core` in service files (schema imports come from `@/lib/db/schema`)
  - Do NOT use `as any` for type conversions

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: ORM migration requiring careful query translation across 5 files with consistent patterns
  - **Skills**: []
    - No specialized skills needed — standard TypeScript + Drizzle query building
  - **Skills Evaluated but Omitted**:
    - `frontend-design`: Not UI work
    - `playwright`: No browser testing needed

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 9, 10)
  - **Blocks**: Tasks 13, 14, 18 (routes that delegate to these services; final typecheck)
  - **Blocked By**: Tasks 2, 3, 4, 5 (schema, relations, config, DB client must exist)

  **References**:

  **Pattern References** (existing code to follow):
  - `apps/admin/src/lib/api/handlers/about.service.ts` — Full file: findFirst/create/update patterns, JSON field handling with `Prisma.DbNull`, upsert-via-conditional
  - `apps/admin/src/lib/api/handlers/achievements.service.ts` — Full file: CRUD + `$transaction` reorder + toggleVisibility pattern
  - `apps/admin/src/lib/api/handlers/profile-links.service.ts` — Full file: CRUD + `$transaction` reorder with RevalidateService calls
  - `apps/admin/src/lib/api/handlers/blog-links.service.ts` — Full file: aggregate `_max` for auto-order, `$transaction` reorder, date parsing
  - `apps/admin/src/lib/api/handlers/contact-settings.service.ts` — Full file: simplest service, findFirst+create-default+update

  **API/Type References** (contracts to implement against):
  - `apps/admin/src/lib/db/schema.ts` (Task 2 output) — Table definitions for aboutMe, achievements, profileLinks, blogLinks, contactSettings
  - `apps/admin/src/lib/db/index.ts` (Task 5 output) — `db` export and `db.transaction()` API

  **External References**:
  - Drizzle CRUD: https://orm.drizzle.team/docs/insert, /update, /delete, /select
  - Drizzle transactions: https://orm.drizzle.team/docs/transactions
  - Drizzle aggregations: https://orm.drizzle.team/docs/select#aggregations (for `max()`)

  **WHY Each Reference Matters**:
  - Service files show the EXACT Prisma patterns to translate — each method must produce identical query semantics
  - Schema file provides table/column names for Drizzle query builder
  - Transaction docs show the `db.transaction(async (tx) => {})` API that replaces `prisma.$transaction`

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: TypeScript compilation of migrated services
    Tool: Bash
    Preconditions: Tasks 1-5 complete, schema/relations/config/db client exist
    Steps:
      1. Run `pnpm --filter admin exec tsc --noEmit --pretty 2>&1 | grep -E "(about|achievements|profile-links|blog-links|contact-settings)\.service\.ts"` — should return empty (no errors)
      2. Run `grep -r "from '@/lib/db/prisma'" apps/admin/src/lib/api/handlers/{about,achievements,profile-links,blog-links,contact-settings}.service.ts` — should return empty
      3. Run `grep -r "from '@/prisma/generated" apps/admin/src/lib/api/handlers/{about,achievements,profile-links,blog-links,contact-settings}.service.ts` — should return empty
    Expected Result: Zero type errors in these 5 files, zero Prisma imports remaining
    Failure Indicators: tsc errors mentioning these files, grep returning matches
    Evidence: .sisyphus/evidence/task-8-typecheck.txt

  Scenario: Verify service method signatures unchanged
    Tool: Bash
    Preconditions: Migration complete
    Steps:
      1. For each service file, run `grep -E "(async |static )" apps/admin/src/lib/api/handlers/{about,achievements,profile-links,blog-links,contact-settings}.service.ts` and compare method names with pre-migration
      2. Verify export pattern is unchanged (singleton class instance)
    Expected Result: Same method names, same export patterns
    Failure Indicators: Missing methods, changed signatures
    Evidence: .sisyphus/evidence/task-8-signatures.txt

  Scenario: Verify Drizzle import patterns
    Tool: Bash
    Preconditions: Migration complete
    Steps:
      1. Run `grep -E "import.*from '@/lib/db'" apps/admin/src/lib/api/handlers/{about,achievements,profile-links,blog-links,contact-settings}.service.ts` — all 5 should import from `@/lib/db`
      2. Run `grep -E "import.*from 'drizzle-orm'" apps/admin/src/lib/api/handlers/{about,achievements,profile-links,blog-links,contact-settings}.service.ts` — all 5 should import operators
      3. Run `grep -E "import.*from '@/lib/db/schema'" apps/admin/src/lib/api/handlers/{about,achievements,profile-links,blog-links,contact-settings}.service.ts` — all 5 should import table definitions
    Expected Result: Consistent Drizzle import pattern across all 5 files
    Failure Indicators: Missing imports, mixed import sources
    Evidence: .sisyphus/evidence/task-8-imports.txt
  ```

  **Commit**: YES (groups with Tasks 9, 10)
  - Message: `refactor(admin): migrate all services from prisma to drizzle`
  - Files: `apps/admin/src/lib/api/handlers/{about,achievements,profile-links,blog-links,contact-settings}.service.ts`
  - Pre-commit: `pnpm --filter admin exec tsc --noEmit` passes for these files

- [x] 9. Migrate Moderate Services (Projects, Contexts, Guestbook, Knowledge) to Drizzle

  **What to do**:
  - Migrate 4 service files with moderate complexity:
    - `projects.service.ts` — Replace pagination pattern: `prisma.project.findMany({ skip, take, where, include })` → `db.select().from(projects).where().limit().offset()` + separate relation query or leftJoin for contexts. Convert OR search with `mode: 'insensitive'` → Drizzle `ilike()` operator across title/summary/description using `or(ilike(projects.title, pattern), ilike(...))`. Replace `prisma.project.count()` → `db.select({ count: count() }).from(projects).where()`. Handle `include: { contexts: true }` via Drizzle relations query `db.query.projects.findFirst({ with: { contexts: true } })` or manual join.
    - `project-contexts.service.ts` — Replace `Prisma.ProjectContextWhereInput` with Drizzle `and(eq(), eq())` filters. Convert `include: { project: { select: { id, title, slug } } }` → leftJoin or relations query. Convert `$transaction` reorder. Handle project-existence check (`prisma.project.findUnique`) → `db.select().from(projects).where(eq(projects.id, projectId)).limit(1)`.
    - `guestbook.service.ts` — Replace `include: { user: { select: { name, image } } }` → leftJoin with users table or relations query. Convert JSON reactions manipulation (read JSON, modify in JS, write back). Handle toggleVisibility pattern.
    - `knowledge-docs.service.ts` — Replace pagination (skip/take → limit/offset), Promise.all pattern for [findMany, count]. Convert `findUnique` by filename → `db.select().from(knowledgeDocs).where(eq(knowledgeDocs.filename, filename)).limit(1)`. Handle markIndexed update.
  - Replace ALL Prisma imports as in Task 8
  - Add schema imports for: `projects, projectContexts, guestbookEntries, users, knowledgeDocs`
  - For `include` patterns, use Drizzle Relational Queries API (`db.query.tableName.findFirst/findMany({ with: { relation: true } })`) — this requires relations from Task 3 to be properly defined
  - Convert insensitive search: `mode: 'insensitive'` → `ilike(column, `%${search}%`)`

  **Must NOT do**:
  - Do NOT change service method signatures or return value shapes
  - Do NOT change the guestbook reactions JSON manipulation logic (only the read/write queries)
  - Do NOT add new indexes or schema changes
  - Do NOT use raw SQL where Drizzle query builder suffices
  - Do NOT modify the RevalidateService calls

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Moderate complexity — pagination, relation includes, search filters, and JSON handling
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `frontend-design`: Not UI work

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 8, 10)
  - **Blocks**: Tasks 13, 14, 18
  - **Blocked By**: Tasks 2, 3, 4, 5

  **References**:

  **Pattern References**:
  - `apps/admin/src/lib/api/handlers/projects.service.ts` — Full file: pagination, OR search with insensitive mode, count, include contexts
  - `apps/admin/src/lib/api/handlers/project-contexts.service.ts` — Full file: include project select, $transaction reorder, project existence check
  - `apps/admin/src/lib/api/handlers/guestbook.service.ts` — Full file: include user select, JSON reactions manipulation, toggleVisibility
  - `apps/admin/src/lib/api/handlers/knowledge-docs.service.ts` — Full file: pagination, findUnique by filename, markIndexed

  **API/Type References**:
  - `apps/admin/src/lib/db/schema.ts` (Task 2) — Table definitions
  - `apps/admin/src/lib/db/relations.ts` (Task 3) — Relations for `with:` queries

  **External References**:
  - Drizzle Relational Queries: https://orm.drizzle.team/docs/rqb (for `db.query.X.findMany({ with: {} })`)
  - Drizzle `ilike`: https://orm.drizzle.team/docs/operators#ilike
  - Drizzle pagination: https://orm.drizzle.team/docs/select#limit--offset

  **WHY Each Reference Matters**:
  - Service files define exact Prisma patterns to translate — especially `include` with nested `select` which maps to Drizzle relational queries
  - Relations file is CRITICAL — `db.query.X.findFirst({ with: { relation: true } })` depends on defined relations
  - `ilike` docs show how to replace Prisma's `mode: 'insensitive'` search

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: TypeScript compilation of migrated services
    Tool: Bash
    Preconditions: Tasks 1-5 complete
    Steps:
      1. Run `pnpm --filter admin exec tsc --noEmit --pretty 2>&1 | grep -E "(projects|project-contexts|guestbook|knowledge-docs)\.service\.ts"` — should return empty
      2. Run `grep -r "from '@/lib/db/prisma'" apps/admin/src/lib/api/handlers/{projects,project-contexts,guestbook,knowledge-docs}.service.ts` — should return empty
      3. Run `grep -r "from '@/prisma/generated" apps/admin/src/lib/api/handlers/{projects,project-contexts,guestbook,knowledge-docs}.service.ts` — should return empty
    Expected Result: Zero type errors, zero Prisma imports
    Failure Indicators: tsc errors, prisma import matches
    Evidence: .sisyphus/evidence/task-9-typecheck.txt

  Scenario: Verify relational query patterns
    Tool: Bash
    Preconditions: Migration complete
    Steps:
      1. Run `grep -E "db\.query\.|leftJoin|innerJoin" apps/admin/src/lib/api/handlers/{projects,project-contexts,guestbook}.service.ts` — verify relation queries exist
      2. Run `grep -E "ilike" apps/admin/src/lib/api/handlers/projects.service.ts` — verify insensitive search uses ilike
    Expected Result: Relational queries present, ilike used for search
    Failure Indicators: Missing relation handling, raw string comparison instead of ilike
    Evidence: .sisyphus/evidence/task-9-relations.txt

  Scenario: Verify pagination pattern
    Tool: Bash
    Preconditions: Migration complete
    Steps:
      1. Run `grep -E "\.(limit|offset)\(" apps/admin/src/lib/api/handlers/{projects,knowledge-docs}.service.ts` — verify limit/offset usage
      2. Run `grep -E "count\(\)" apps/admin/src/lib/api/handlers/{projects,knowledge-docs}.service.ts` — verify count queries
    Expected Result: limit/offset for pagination, count() for totals
    Failure Indicators: skip/take (Prisma syntax), missing count
    Evidence: .sisyphus/evidence/task-9-pagination.txt
  ```

  **Commit**: YES (groups with Tasks 8, 10)
  - Message: `refactor(admin): migrate all services from prisma to drizzle`
  - Files: `apps/admin/src/lib/api/handlers/{projects,project-contexts,guestbook,knowledge-docs}.service.ts`
  - Pre-commit: `pnpm --filter admin exec tsc --noEmit` passes for these files

- [ ] 10. Migrate Moderate Services (Contacts, Chat-Logs, Messages, Content-Export) to Drizzle

  **What to do**:
  - Migrate 4 service files:
    - `contacts.service.ts` — Replace pagination (skip/take → limit/offset), OR search with `mode: 'insensitive'` → `ilike()`. Convert bulk operations: `prisma.contactForm.updateMany({ where: { id: { in: ids } } })` → `db.update(contactForms).set({ read: true }).where(inArray(contactForms.id, ids))`. Same for bulkDelete → `db.delete(contactForms).where(inArray(contactForms.id, ids))`.
    - `chat-logs.service.ts` — Replace `prisma.chatLog.upsert({ where: { sessionId }, create, update })` → manual findFirst + insert/update conditional (Drizzle has no built-in upsert for arbitrary unique columns; use `db.insert().onConflictDoUpdate()` on sessionId). Replace `Prisma.InputJsonValue` cast → Drizzle `sql` or direct JSON value. Convert deleteExpired with date comparison → `lt(chatLogs.updatedAt, cutoffDate)`. Post-processing to extract messageCount/lastMessageAt from JSON stays in JS.
    - `anonymous-messages.service.ts` — Replace simple CRUD + count. Convert `prisma.anonymousMessage.count({ where: { read: false } })` → `db.select({ count: count() }).from(anonymousMessages).where(eq(anonymousMessages.read, false))`.
    - `content-export.service.ts` — Replace findFirst/findMany across aboutMe, projects (with contexts include), knowledgeDocs. Convert `include: { contexts: true }` → relational query. Local ExperienceItem interface stays unchanged.
  - Replace ALL Prisma imports
  - Add schema imports for: `contactForms, chatLogs, anonymousMessages, aboutMe, projects, projectContexts, knowledgeDocs`
  - Use `inArray()` from `drizzle-orm` for bulk operations with `id: { in: ids }` patterns
  - Handle `onConflictDoUpdate` for chat-logs upsert: `db.insert(chatLogs).values({...}).onConflictDoUpdate({ target: chatLogs.sessionId, set: { messages, model, updatedAt } })`

  **Must NOT do**:
  - Do NOT change service method signatures or return shapes
  - Do NOT modify the JSON post-processing logic in chat-logs (messageCount/lastMessageAt extraction)
  - Do NOT change the content-export output structure
  - Do NOT add runtime type assertions

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Moderate complexity — bulk operations, upsert, JSON handling, cross-table export
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `frontend-design`: Not UI work

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 8, 9)
  - **Blocks**: Tasks 13, 14, 15, 18
  - **Blocked By**: Tasks 2, 3, 4, 5

  **References**:

  **Pattern References**:
  - `apps/admin/src/lib/api/handlers/contacts.service.ts` — Full file: pagination+search, bulk updateMany/deleteMany with `in` array
  - `apps/admin/src/lib/api/handlers/chat-logs.service.ts` — Full file: upsert on sessionId, Prisma.InputJsonValue, deleteExpired with date comparison
  - `apps/admin/src/lib/api/handlers/anonymous-messages.service.ts` — Full file: simple CRUD + count queries
  - `apps/admin/src/lib/api/handlers/content-export.service.ts` — Full file: multi-table export with includes and JSON casting

  **API/Type References**:
  - `apps/admin/src/lib/db/schema.ts` (Task 2) — Table definitions
  - `apps/admin/src/lib/db/relations.ts` (Task 3) — Relations for content-export includes

  **External References**:
  - Drizzle `inArray`: https://orm.drizzle.team/docs/operators#inarray
  - Drizzle `onConflictDoUpdate`: https://orm.drizzle.team/docs/insert#on-conflict-do-update
  - Drizzle date comparisons: https://orm.drizzle.team/docs/operators#lt--le--gt--ge

  **WHY Each Reference Matters**:
  - contacts.service.ts bulk ops are the key pattern for `inArray()` usage
  - chat-logs upsert is the most complex conversion — `onConflictDoUpdate` requires specifying conflict target
  - content-export crosses multiple tables with includes — must use relational queries

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: TypeScript compilation of migrated services
    Tool: Bash
    Preconditions: Tasks 1-5 complete
    Steps:
      1. Run `pnpm --filter admin exec tsc --noEmit --pretty 2>&1 | grep -E "(contacts|chat-logs|anonymous-messages|content-export)\.service\.ts"` — should return empty
      2. Run `grep -r "from '@/lib/db/prisma'" apps/admin/src/lib/api/handlers/{contacts,chat-logs,anonymous-messages,content-export}.service.ts` — should return empty
      3. Run `grep -r "from '@/prisma/generated" apps/admin/src/lib/api/handlers/{contacts,chat-logs,anonymous-messages,content-export}.service.ts` — should return empty
    Expected Result: Zero type errors, zero Prisma imports
    Failure Indicators: tsc errors, prisma import matches
    Evidence: .sisyphus/evidence/task-10-typecheck.txt

  Scenario: Verify bulk operation patterns
    Tool: Bash
    Preconditions: Migration complete
    Steps:
      1. Run `grep -E "inArray" apps/admin/src/lib/api/handlers/contacts.service.ts` — verify inArray usage for bulk ops
      2. Run `grep -E "onConflictDoUpdate" apps/admin/src/lib/api/handlers/chat-logs.service.ts` — verify upsert pattern
    Expected Result: inArray for bulk, onConflictDoUpdate for upsert
    Failure Indicators: Prisma-style `in:` syntax, manual upsert without onConflict
    Evidence: .sisyphus/evidence/task-10-patterns.txt
  ```

  **Commit**: YES (groups with Tasks 8, 9)
  - Message: `refactor(admin): migrate all services from prisma to drizzle`
  - Files: `apps/admin/src/lib/api/handlers/{contacts,chat-logs,anonymous-messages,content-export}.service.ts`
  - Pre-commit: `pnpm --filter admin exec tsc --noEmit` passes for these files

- [ ] 11. Migrate Booking Complex Services to Drizzle

  **What to do**:
  - Migrate `bookings.service.ts` — Replace all Prisma calls with Drizzle equivalents:
    - `prisma.booking.findMany` with nested `include: { slot: true }` → `db.select().from(bookings).innerJoin(bookingSlots, eq(bookings.slotId, bookingSlots.id)).where(...).limit().offset()`
    - **Nested relation filter** `where: { slot: { date: { gte, lte } } }` → Use inner join with date conditions on the joined `bookingSlots` table
    - Pagination: `prisma.booking.count()` → `db.select({ count: count() }).from(bookings).where(...)`
    - Create flow (slot + booking): wrap in `db.transaction(async (tx) => { ... })` — insert slot first, then booking with slotId
    - Delete flow (booking + slot): wrap in `db.transaction(async (tx) => { ... })` — delete booking, then delete slot
    - `getCalendarView`: join + date filter, JS grouping stays
    - Replace `Prisma.BookingWhereInput` with inline Drizzle `where` conditions using `and()`, `or()`, `eq()`, `gte()`, `lte()`
    - Replace `Prisma.DateTimeFilter` usage with Drizzle comparison operators
  - Migrate `booking-slots.service.ts` — Replace all Prisma calls:
    - `findMany` with date range + include booking → `db.select().from(bookingSlots).leftJoin(bookings, eq(...)).where(and(gte(bookingSlots.date, start), lte(bookingSlots.date, end))).orderBy(asc(bookingSlots.date), asc(bookingSlots.time))`
    - **Composite unique lookup** `findUnique({ where: { date_time: { date, time } } })` → `db.select().from(bookingSlots).where(and(eq(bookingSlots.date, date), eq(bookingSlots.time, time))).limit(1)`
    - `createBulkSlots`: individual creates in loop (keep existing pattern)
    - `copyFromWeek`: source query → mapped inserts with date offset
    - Replace `SlotStatus` enum import from `@/prisma/generated/client/client` → import from `@/lib/db/schema`
    - Replace `Prisma.BookingSlotUpdateInput` with explicit field objects
  - Migrate `booking-availability.service.ts` — Replace all Prisma calls:
    - `findMany` with dayOfWeek/enabled filter → `db.select().from(bookingAvailability).where(...).orderBy(asc(bookingAvailability.dayOfWeek), asc(bookingAvailability.startTime))`
    - Overlap check: `findMany` same dayOfWeek excluding self → Drizzle `and(eq(...), ne(bookingAvailability.id, excludeId))`
    - `bulkUpdate`: `prisma.bookingAvailability.updateMany({ where: { dayOfWeek }, data: { enabled } })` → `db.update(bookingAvailability).set({ enabled }).where(eq(bookingAvailability.dayOfWeek, dayOfWeek))`
    - Group-by-day JS reduce logic stays unchanged
  - Migrate `booking-settings.service.ts` — Replace Prisma calls:
    - `findFirst` → `db.select().from(bookingSettings).limit(1)`
    - `create` / `update` → `db.insert(bookingSettings).values(...)` / `db.update(bookingSettings).set(...).where(eq(bookingSettings.id, id))`
  - Replace ALL `import { prisma }` with `import { db }` from `@/lib/db`
  - Replace ALL `import { Prisma, SlotStatus }` from generated client with Drizzle schema imports
  - Add explicit `.orderBy()` to every query that previously relied on Prisma default ordering
  - Ensure booking create uses transaction with serializable isolation: `db.transaction(async (tx) => { ... }, { isolationLevel: 'serializable' })`

  **Must NOT do**:
  - Change any business logic, validation rules, or response shapes
  - Remove or modify the `calculateEndTime` helper or date offset logic in booking-slots
  - Change the booking flow (create slot → create booking → link)
  - Use raw SQL unless absolutely necessary
  - Add comments explaining the migration

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Complex transaction patterns, nested relation filters, composite unique lookups, and isolation level requirements need careful autonomous problem-solving
  - **Skills**: []
    - No external skills needed — pure ORM migration using Drizzle docs
  - **Skills Evaluated but Omitted**:
    - `playwright`: No UI testing in this task
    - `webapp-testing`: Backend-only service migration

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 12, 13, 14)
  - **Blocks**: Task 18 (Full typecheck)
  - **Blocked By**: Tasks 2, 3, 4, 5 (schema + relations + config + db client must exist)

  **References**:

  **Pattern References** (existing code to follow):
  - `apps/admin/src/lib/api/handlers/bookings.service.ts` — Current Prisma implementation with nested slot filter, pagination, create/delete flows
  - `apps/admin/src/lib/api/handlers/booking-slots.service.ts` — Composite unique lookups (`date_time`), bulk create, copy-from-week logic, SlotStatus enum usage
  - `apps/admin/src/lib/api/handlers/booking-availability.service.ts` — Overlap detection with time math, bulkUpdate pattern, group-by-day reduce
  - `apps/admin/src/lib/api/handlers/booking-settings.service.ts` — Simple findFirst/create-if-null/update pattern

  **API/Type References** (contracts to implement against):
  - `apps/admin/src/lib/db/schema.ts` (Task 2 output) — `bookings`, `bookingSlots`, `bookingAvailability`, `bookingSettings` tables, `bookingStatusEnum`, `slotStatusEnum`
  - `apps/admin/src/lib/db/relations.ts` (Task 3 output) — Booking↔BookingSlot relation definition

  **External References**:
  - Drizzle transactions: `https://orm.drizzle.team/docs/transactions` — Transaction API with isolation levels
  - Drizzle joins: `https://orm.drizzle.team/docs/joins` — innerJoin/leftJoin syntax for relation queries
  - Drizzle operators: `https://orm.drizzle.team/docs/operators` — eq, ne, and, or, gte, lte, inArray

  **WHY Each Reference Matters**:
  - bookings.service.ts: Contains the nested relation filter pattern (`where: { slot: { date } }`) which CANNOT be directly translated — must use join + where conditions on the joined table instead
  - booking-slots.service.ts: Has composite unique lookup (`date_time`) that needs Drizzle compound where clause instead of Prisma's composite unique syntax
  - Drizzle transactions doc: Must use `{ isolationLevel: 'serializable' }` for booking creation to prevent double-booking race conditions

  **Acceptance Criteria**:

  ```
  Scenario: Booking CRUD operations work with Drizzle
    Tool: Bash (curl)
    Preconditions: Dev server running on port 3001, valid admin auth cookie, at least one booking slot exists
    Steps:
      1. curl -s http://localhost:3001/api/v1/admin/bookings?page=1&limit=10 -H "Cookie: $AUTH_COOKIE" | jq '.data | length'
      2. Assert response has `.data` array and `.pagination` object with totalItems/totalPages
      3. curl -s http://localhost:3001/api/v1/admin/bookings/calendar?startDate=2025-01-01&endDate=2025-12-31 -H "Cookie: $AUTH_COOKIE" | jq 'keys | length'
      4. Assert response is object with date keys containing booking arrays
    Expected Result: All booking endpoints return data matching existing response shapes
    Failure Indicators: 500 errors, missing `.slot` nested data in booking objects, pagination math errors
    Evidence: .sisyphus/evidence/task-11-booking-crud.json

  Scenario: Booking slot composite unique constraint enforced
    Tool: Bash (curl)
    Preconditions: Dev server running, admin auth
    Steps:
      1. Create a slot: curl -X POST http://localhost:3001/api/v1/admin/booking-slots -H "Cookie: $AUTH_COOKIE" -H "Content-Type: application/json" -d '{"date":"2025-06-15","time":"10:00","duration":60}' | jq '.id'
      2. Attempt duplicate: curl -X POST http://localhost:3001/api/v1/admin/booking-slots -H "Cookie: $AUTH_COOKIE" -H "Content-Type: application/json" -d '{"date":"2025-06-15","time":"10:00","duration":60}'
      3. Assert second call returns 4xx error with duplicate message
    Expected Result: First creates successfully, second returns error about existing slot at that date/time
    Failure Indicators: Second create succeeds (duplicate allowed) or returns 500 instead of business error
    Evidence: .sisyphus/evidence/task-11-slot-unique.json

  Scenario: Booking availability overlap detection works
    Tool: Bash (curl)
    Preconditions: Dev server running, admin auth
    Steps:
      1. Create availability: curl -X POST http://localhost:3001/api/v1/admin/booking-availability -H "Cookie: $AUTH_COOKIE" -H "Content-Type: application/json" -d '{"dayOfWeek":1,"startTime":"09:00","endTime":"10:00","enabled":true}'
      2. Create overlapping: curl -X POST http://localhost:3001/api/v1/admin/booking-availability -H "Cookie: $AUTH_COOKIE" -H "Content-Type: application/json" -d '{"dayOfWeek":1,"startTime":"09:30","endTime":"10:30","enabled":true}'
      3. Assert second returns overlap error
    Expected Result: Overlap detection correctly identifies time conflict
    Failure Indicators: Overlapping availability created without error
    Evidence: .sisyphus/evidence/task-11-availability-overlap.json
  ```

  **Evidence to Capture:**
  - [ ] task-11-booking-crud.json — Full booking list + calendar response
  - [ ] task-11-slot-unique.json — Duplicate slot rejection
  - [ ] task-11-availability-overlap.json — Overlap detection

  **Commit**: YES (groups with Task 12)
  - Message: `refactor(admin): migrate booking services from Prisma to Drizzle`
  - Files: `apps/admin/src/lib/api/handlers/bookings.service.ts`, `apps/admin/src/lib/api/handlers/booking-slots.service.ts`, `apps/admin/src/lib/api/handlers/booking-availability.service.ts`, `apps/admin/src/lib/api/handlers/booking-settings.service.ts`
  - Pre-commit: `pnpm --filter admin typecheck`

- [ ] 12. Migrate Analytics Service to Drizzle

  **What to do**:
  - Migrate `analytics.service.ts` — Replace all Prisma calls with Drizzle equivalents:
    - `trackEvent` (create): `db.insert(analyticsEvents).values({ ... })`
    - `getPageViews` (findMany + JS group): `db.select().from(analyticsEvents).where(and(gte(...), lte(...))).orderBy(asc(analyticsEvents.createdAt))` — JS date grouping stays
    - `getEntityStats` (findMany + JS reduce): `db.select().from(analyticsEvents).where(and(eq(analyticsEvents.eventType, 'view'), gte(...))).orderBy(...)` — JS reduce stays
    - `getCountryStats` (findMany + JS reduce): `db.select().from(analyticsEvents).where(and(isNotNull(analyticsEvents.countryCode), gte(...))).orderBy(...)` — JS reduce stays
    - `getPopularEntities` (findMany + JS reduce + sort + slice): same pattern as above
    - **CRITICAL** `getOverview` — Convert Prisma `groupBy` to Drizzle:
      - `prisma.analyticsEvent.groupBy({ by: ['userSession'] })` (unique visitors count) → `db.select({ count: countDistinct(analyticsEvents.userSession) }).from(analyticsEvents).where(...)`
      - `prisma.analyticsEvent.groupBy({ by: ['page'], _count: true, orderBy: { _count: { page: 'desc' } }, take: 10 })` (top pages) → `db.select({ page: analyticsEvents.page, count: count() }).from(analyticsEvents).where(...).groupBy(analyticsEvents.page).orderBy(desc(count())).limit(10)`
      - `prisma.analyticsEvent.count()` → `db.select({ count: count() }).from(analyticsEvents).where(...)`
    - Replace `Prisma.AnalyticsEventWhereInput` with inline Drizzle `where` conditions
    - Replace `Prisma.InputJsonValue` cast with plain object (Drizzle JSON columns accept plain objects)
    - Replace `Prisma.DateTimeFilter` with Drizzle `gte()`/`lte()` operators
    - Add explicit `.orderBy()` to every findMany query
  - Replace `import { prisma }` with `import { db }` from `@/lib/db`
  - Replace `import { Prisma }` from generated client with Drizzle operator/function imports
  - Import `count`, `countDistinct`, `eq`, `and`, `gte`, `lte`, `isNotNull`, `desc`, `asc` from `drizzle-orm`
  - Import `analyticsEvents` from `@/lib/db/schema`

  **Must NOT do**:
  - Change any JS-side grouping, reducing, or sorting logic — only replace ORM calls
  - Change response shapes or field names
  - Introduce raw SQL for the groupBy queries — Drizzle's `.groupBy()` API handles this natively
  - Add caching or performance optimizations (out of scope)
  - Add comments explaining the migration

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Prisma `groupBy` → Drizzle `groupBy` translation is non-trivial, requires understanding of aggregate functions and column references
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `playwright`: Backend analytics service, no UI

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 11, 13, 14)
  - **Blocks**: Task 18 (Full typecheck)
  - **Blocked By**: Tasks 2, 3, 4, 5 (schema + relations + config + db client)

  **References**:

  **Pattern References** (existing code to follow):
  - `apps/admin/src/lib/api/handlers/analytics.service.ts` — Current Prisma implementation with 6 methods, especially `getOverview` using `groupBy` with `_count`, `orderBy`, and `take`

  **API/Type References**:
  - `apps/admin/src/lib/db/schema.ts` (Task 2 output) — `analyticsEvents` table with varchar limits (page:100, entityType:50, eventType:20, ipAddress:45, countryCode:2, city:100)

  **External References**:
  - Drizzle aggregations: `https://orm.drizzle.team/docs/select#aggregations` — count(), countDistinct(), sum(), avg()
  - Drizzle groupBy: `https://orm.drizzle.team/docs/select#group-by` — .groupBy() with column references

  **WHY Each Reference Matters**:
  - analytics.service.ts: The `getOverview` method uses Prisma's `groupBy` API which has NO direct 1:1 equivalent — must be rewritten using Drizzle's `select().groupBy()` with aggregate functions
  - Drizzle aggregations doc: Need `countDistinct(analyticsEvents.userSession)` for unique visitor count — this is the key translation

  **Acceptance Criteria**:

  ```
  Scenario: Analytics overview returns correct aggregated data
    Tool: Bash (curl)
    Preconditions: Dev server running on port 3001, valid admin auth cookie, analytics_events table has data
    Steps:
      1. curl -s http://localhost:3001/api/v1/admin/analytics/overview?startDate=2024-01-01&endDate=2026-12-31 -H "Cookie: $AUTH_COOKIE" | jq '{uniqueVisitors: .uniqueVisitors, totalEvents: .totalEvents, topPages: (.topPages | length)}'
      2. Assert response has numeric `uniqueVisitors`, numeric `totalEvents`, array `topPages` with max 10 items
      3. Each topPage item must have `page` (string) and `count` (number) fields
    Expected Result: Overview endpoint returns aggregated analytics matching existing response shape
    Failure Indicators: 500 error, null uniqueVisitors, missing topPages, count values as strings instead of numbers
    Evidence: .sisyphus/evidence/task-12-analytics-overview.json

  Scenario: Analytics event tracking creates records
    Tool: Bash (curl)
    Preconditions: Dev server running, analytics_events table accessible
    Steps:
      1. curl -X POST http://localhost:3001/api/v1/public/analytics -H "Content-Type: application/json" -d '{"eventType":"view","page":"/test","userSession":"test-session-123"}'
      2. Assert 200/201 response
      3. curl -s http://localhost:3001/api/v1/admin/analytics/events?page=1&limit=5 -H "Cookie: $AUTH_COOKIE" | jq '.data[0].page'
      4. Assert most recent event has page "/test"
    Expected Result: Event created and retrievable via admin endpoint
    Failure Indicators: 500 on POST, event not appearing in list, field type mismatches
    Evidence: .sisyphus/evidence/task-12-analytics-tracking.json

  Scenario: Analytics groupBy queries return correct shapes
    Tool: Bash (curl)
    Preconditions: Dev server running, admin auth, some analytics data exists
    Steps:
      1. curl -s http://localhost:3001/api/v1/admin/analytics/page-views?startDate=2024-01-01&endDate=2026-12-31 -H "Cookie: $AUTH_COOKIE" | jq 'type'
      2. Assert response is array of objects with date grouping
      3. curl -s http://localhost:3001/api/v1/admin/analytics/countries?startDate=2024-01-01&endDate=2026-12-31 -H "Cookie: $AUTH_COOKIE" | jq 'type'
      4. Assert response is array of country stat objects
    Expected Result: All analytics query endpoints return correctly shaped data
    Failure Indicators: SQL errors from malformed groupBy, empty results when data exists, wrong aggregation counts
    Evidence: .sisyphus/evidence/task-12-analytics-groupby.json
  ```

  **Evidence to Capture:**
  - [ ] task-12-analytics-overview.json — Overview with aggregations
  - [ ] task-12-analytics-tracking.json — Event create + retrieve
  - [ ] task-12-analytics-groupby.json — PageViews + countries responses

  **Commit**: YES (groups with Task 11)
  - Message: `refactor(admin): migrate analytics service from Prisma to Drizzle`
  - Files: `apps/admin/src/lib/api/handlers/analytics.service.ts`
  - Pre-commit: `pnpm --filter admin typecheck`

- [ ] 13. Migrate Public Route Files with Direct Prisma Calls

  **What to do**:
  - Migrate all 11 public API route files that import `prisma` directly
  - Replace `import { prisma } from '@/lib/db/prisma'` → `import { db } from '@/lib/db'`
  - Replace `import { SlotStatus, BookingStatus } from '@/prisma/generated/client/client'` → `import { slotStatusEnum, bookingStatusEnum } from '@/lib/db/schema'` (in bookings/route.ts, bookings/available/route.ts)
  - Convert all direct Prisma query patterns to Drizzle:
    - `prisma.X.findFirst()` → `db.select().from(X).limit(1)` then `[0]`
    - `prisma.X.findMany({where, orderBy, select})` → `db.select({fields}).from(X).where().orderBy()`
    - `prisma.X.count({where})` → `db.select({ count: count() }).from(X).where()`
    - `prisma.X.create({data})` → `db.insert(X).values(data).returning()`
    - `prisma.user.findUnique({where:{email}})` → `db.select().from(users).where(eq(users.email, email))`
  - **Files to migrate** (11 public route files):
    - `about/route.ts` — findFirst aboutMe, local JSON interface parsing
    - `achievements/route.ts` — findMany with orderBy
    - `blogs/route.ts` — findMany with source filter and orderBy
    - `bookings/route.ts` — **interactive $transaction** for slot status + booking insert. Convert to `db.transaction(async (tx) => {...})` with `isolationLevel: 'serializable'`. Replace enum value references: `SlotStatus.AVAILABLE` → use Drizzle enum value string `'AVAILABLE'`
    - `bookings/available/route.ts` — findMany with date range + SlotStatus filter. Replace enum reference
    - `contact/route.ts` — create contactForm with field mapping
    - `guestbook/route.ts` — findUnique user by email in POST, delegates to service
    - `messages/route.ts` — create anonymousMessage
    - `projects/route.ts` — findMany with include contexts, pagination
    - `projects/[slug]/route.ts` — findUnique by slug with include contexts + images
    - `auth/sync/route.ts` — findUnique or upsert user by email
    - `links/route.ts` — findMany profileLinks
  - Add explicit `.orderBy()` to every query that returns lists (Drizzle has no implicit ordering)
  - Preserve all middleware wrappers (`withPublicAuth`, rate limiting, Turnstile verification)
  - Preserve all response shapes and HTTP status codes exactly

  **Must NOT do**:
  - Change response JSON structure or HTTP status codes
  - Modify middleware or auth logic
  - Change validation schemas or Zod parsing
  - Remove or modify GeoIP/location extraction logic
  - Change Turnstile CAPTCHA verification flow
  - Add unnecessary comments explaining Drizzle syntax

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Bulk migration across 11 files with pattern matching but requires careful per-file attention to unique query patterns
  - **Skills**: []
    - No specialized skills needed — straightforward query rewriting
  - **Skills Evaluated but Omitted**:
    - `frontend-design`: No UI work
    - `playwright`: No browser testing needed

  **Parallelization**:
  - **Can Run In Parallel**: YES — with Task 14
  - **Parallel Group**: Wave 4 (with Tasks 11, 12, 14)
  - **Blocks**: Tasks 15, 18
  - **Blocked By**: Tasks 2, 3, 5 (schema, relations, db client must exist)

  **References**:

  **Pattern References** (existing code to follow):
  - `apps/admin/src/lib/db/schema.ts` (Task 2 output) — Table definitions with column names for `select()` calls
  - `apps/admin/src/lib/db/index.ts` (Task 4 output) — Import path for `db` client
  - `apps/admin/src/lib/db/schema.ts` — Enum definitions (`slotStatusEnum`, `bookingStatusEnum`) for replacing Prisma enum imports

  **API/Type References** (contracts to implement against):
  - Each route file's current response shape — preserve exactly (compare before/after JSON output)
  - `apps/admin/src/app/api/v1/public/bookings/route.ts` — The booking creation route has an interactive transaction that MUST use `db.transaction()` with serializable isolation

  **External References**:
  - Drizzle transactions: `https://orm.drizzle.team/docs/transactions`
  - Drizzle select: `https://orm.drizzle.team/docs/select`
  - Drizzle insert: `https://orm.drizzle.team/docs/insert`

  **WHY Each Reference Matters**:
  - Schema file: Needed for correct table/column references in every query
  - DB client: Needed for correct import path
  - Booking route: Most complex public route — has transaction + enum usage + nested slot creation
  - Each route's current response shape: Zero behavior change requirement means exact JSON parity

  **Acceptance Criteria**:

  ```
  Scenario: Public about endpoint returns about data
    Tool: Bash (curl)
    Preconditions: Admin app running on port 3001, aboutMe record exists in DB
    Steps:
      1. curl -s http://localhost:3001/api/v1/public/about | jq '.bio'
      2. Verify response has fields: bio, roles, skills, experience, socialLinks
      3. curl -s -o /dev/null -w '%{http_code}' http://localhost:3001/api/v1/public/about
    Expected Result: 200 status, JSON body with all AboutMe fields, arrays for roles/skills
    Failure Indicators: 500 error, missing fields, null where data expected
    Evidence: .sisyphus/evidence/task-13-public-about.txt

  Scenario: Public projects endpoint returns paginated projects
    Tool: Bash (curl)
    Preconditions: Admin app running, at least 1 visible project in DB
    Steps:
      1. curl -s 'http://localhost:3001/api/v1/public/projects?page=1&limit=10' | jq '.projects | length'
      2. curl -s 'http://localhost:3001/api/v1/public/projects?page=1&limit=10' | jq '.projects[0] | keys'
      3. Verify response shape: { projects: [...], total: N, page: N, limit: N }
    Expected Result: 200 with projects array containing objects with title, slug, summary, techStack, contexts
    Failure Indicators: Empty projects array when DB has records, missing pagination fields
    Evidence: .sisyphus/evidence/task-13-public-projects.txt

  Scenario: All 11 public route files compile without prisma imports
    Tool: Bash
    Preconditions: Tasks 2-5 completed
    Steps:
      1. grep -r "from '@/lib/db/prisma'" apps/admin/src/app/api/v1/public/ — expect 0 matches
      2. grep -r "from '@/prisma/generated" apps/admin/src/app/api/v1/public/ — expect 0 matches
      3. pnpm --filter admin exec tsc --noEmit --pretty 2>&1 | grep -c 'error TS' — expect 0
    Expected Result: Zero prisma imports remaining in public routes, zero TypeScript errors
    Failure Indicators: Any remaining prisma import, any TS error referencing old imports
    Evidence: .sisyphus/evidence/task-13-no-prisma-imports.txt
  ```

  **Commit**: YES — groups with Task 14
  - Message: `refactor(admin): migrate public+admin route files from Prisma to Drizzle`
  - Files: `apps/admin/src/app/api/v1/public/*/route.ts` (11 files)
  - Pre-commit: `grep -r "from '@/lib/db/prisma'" apps/admin/src/app/api/v1/public/`

- [ ] 14. Migrate Admin Route Files with Direct Prisma Calls

  **What to do**:
  - Migrate all admin API route files that import `prisma` directly (not via services)
  - Replace `import { prisma } from '@/lib/db/prisma'` → `import { db } from '@/lib/db'`
  - Replace `import { BookingStatus } from '@/prisma/generated/client/client'` → `import { bookingStatusEnum } from '@/lib/db/schema'` (in bookings/[id]/status/route.ts)
  - Convert all direct Prisma query patterns to Drizzle equivalents
  - **Files to migrate** (admin route files with direct prisma):
    - `stats/route.ts` — 10 parallel `prisma.X.count()` calls → `db.select({ count: count() }).from(X).where()`. Preserve Promise.all parallelism
    - `messages/route.ts` — findMany with pagination, count, orderBy
    - `messages/stats/locations/route.ts` — groupBy location aggregation
    - `bookings/[id]/status/route.ts` — update with BookingStatus enum, include slot. Replace enum import
    - `projects/fix-content/route.ts` — batch update with transaction
    - `projects/[id]/images/route.ts` — findMany projectImages by projectId
    - `projects/[id]/images/reorder/route.ts` — transaction with mapped order updates
    - `projects/[id]/images/[imageId]/route.ts` — findUnique, update, delete projectImage
    - `projects/[id]/content/route.ts` — findUnique project with contexts
  - Convert `prisma.X.count({where})` → `db.select({ count: count() }).from(X).where()`
  - Convert `prisma.$transaction([...])` → `db.transaction(async (tx) => { ... })`
  - Convert `prisma.X.groupBy({by, _count, where})` → `db.select({field, count: count()}).from(X).where().groupBy(X.field)`
  - Add explicit `.orderBy()` to every list query
  - Preserve all auth middleware (`withAdminAuth`) wrapping

  **Must NOT do**:
  - Change response JSON structure or HTTP status codes
  - Modify admin auth middleware behavior
  - Alter the stats computation logic (just change query layer)
  - Change image upload/delete logic (only migrate DB queries)
  - Add unnecessary comments

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Multiple files with varied query complexity including groupBy, transactions, and aggregations
  - **Skills**: []
    - No specialized skills needed
  - **Skills Evaluated but Omitted**:
    - `frontend-design`: No UI work

  **Parallelization**:
  - **Can Run In Parallel**: YES — with Task 13
  - **Parallel Group**: Wave 4 (with Tasks 11, 12, 13)
  - **Blocks**: Tasks 15, 18
  - **Blocked By**: Tasks 2, 3, 5 (schema, relations, db client must exist)

  **References**:

  **Pattern References**:
  - `apps/admin/src/lib/db/schema.ts` (Task 2 output) — Table + column definitions
  - `apps/admin/src/lib/db/index.ts` (Task 4 output) — `db` import path
  - Tasks 8-10 service files — follow same Prisma→Drizzle conversion patterns

  **API/Type References**:
  - `apps/admin/src/app/api/v1/admin/stats/route.ts` — 10x parallel count() pattern
  - `apps/admin/src/app/api/v1/admin/messages/stats/locations/route.ts` — groupBy aggregation

  **External References**:
  - Drizzle aggregations: `https://orm.drizzle.team/docs/select#aggregations`
  - Drizzle count: `https://orm.drizzle.team/docs/select#count`
  - Drizzle groupBy: `https://orm.drizzle.team/docs/select#group-by`

  **WHY Each Reference Matters**:
  - Stats route: Most unique pattern — 10 parallel count queries need careful conversion
  - Messages locations: groupBy pattern that maps to Drizzle's `.groupBy()` API
  - Schema file: Column reference for every query in every file

  **Acceptance Criteria**:

  ```
  Scenario: Admin stats endpoint returns entity counts
    Tool: Bash (curl)
    Preconditions: Admin app running, admin session cookie available
    Steps:
      1. curl -s -H 'Cookie: session=...' http://localhost:3001/api/v1/admin/stats | jq 'keys'
      2. Verify response has: projects, blogs, guestbook, messages, links (each with total/visible or total/unread)
      3. curl -s -o /dev/null -w '%{http_code}' -H 'Cookie: session=...' http://localhost:3001/api/v1/admin/stats
    Expected Result: 200 with JSON containing entity count breakdowns
    Failure Indicators: 500 error, incorrect counts, missing entity keys
    Evidence: .sisyphus/evidence/task-14-admin-stats.txt

  Scenario: Admin image reorder uses transaction correctly
    Tool: Bash (curl)
    Preconditions: Admin app running, project with 3+ images exists
    Steps:
      1. GET project images: curl -s -H 'Cookie: session=...' http://localhost:3001/api/v1/admin/projects/{id}/images | jq '.[].id'
      2. POST reorder with reversed IDs array
      3. GET images again, verify order field values match the new order
    Expected Result: Image order updated atomically, GET reflects new order
    Failure Indicators: Partial reorder (some images updated, others not), 500 error
    Evidence: .sisyphus/evidence/task-14-admin-image-reorder.txt

  Scenario: Zero prisma imports in admin route files
    Tool: Bash
    Preconditions: All admin route migrations complete
    Steps:
      1. grep -r "from '@/lib/db/prisma'" apps/admin/src/app/api/v1/admin/ — expect 0 matches
      2. grep -r "from '@/prisma/generated" apps/admin/src/app/api/v1/admin/ — expect 0 matches
    Expected Result: Zero prisma imports in admin routes
    Failure Indicators: Any remaining prisma import line
    Evidence: .sisyphus/evidence/task-14-no-prisma-admin.txt
  ```

  **Commit**: YES — groups with Task 13
  - Message: `refactor(admin): migrate public+admin route files from Prisma to Drizzle`
  - Files: `apps/admin/src/app/api/v1/admin/*/route.ts` (9 files)
  - Pre-commit: `grep -r "from '@/lib/db/prisma'" apps/admin/src/app/api/v1/admin/`

- [ ] 15. Migrate Internal + Cron Route Files (5 files)

  **What to do**:
  - Migrate all internal API route files from Prisma to Drizzle:
    - `apps/admin/src/app/api/v1/internal/chat-logs/route.ts` — delegates to chatLogsService; update prisma import to db if present
    - `apps/admin/src/app/api/v1/internal/knowledge/route.ts` — delegates to knowledgeDocsService; update import
    - `apps/admin/src/app/api/v1/internal/knowledge/[id]/route.ts` — delegates to knowledgeDocsService; update import
    - `apps/admin/src/app/api/v1/internal/knowledge/[id]/indexed/route.ts` — delegates to knowledgeDocsService; update import
    - `apps/admin/src/app/api/cron/cleanup-chatlogs/route.ts` — verify delegates to chatLogsService.deleteExpired(); update import
  - For each file: replace `import { prisma } from '@/lib/db/prisma'` with `import { db } from '@/lib/db'`
  - If any route has inline Prisma calls (not delegating to service), rewrite to Drizzle
  - Verify `withServiceAuth` middleware wrapper still works (it has no Prisma dependency)
  - Note: `apps/admin/src/app/api/v1/internal/content/route.ts` has NO prisma import — only delegates to contentExportService; no changes needed

  **Must NOT do**:
  - Change internal API response shapes — other services depend on exact formats
  - Modify `withServiceAuth` middleware
  - Touch `X-Service-Token` authentication logic
  - Change any URL paths or HTTP methods

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple import swap on 5 small files that mostly delegate to services. Minimal query rewriting expected.
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**:
    - `playwright`: Not UI work
    - `frontend-design`: Not UI work

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5 (with Tasks 16, 17, 18)
  - **Blocks**: Task 18
  - **Blocked By**: Tasks 10 (chat-logs, knowledge-docs, content-export services)

  **References**:

  **Pattern References**:
  - `apps/admin/src/app/api/v1/internal/content/route.ts` — Example internal route that delegates to service (no prisma import). Use as reference for expected pattern after migration.
  - `apps/admin/src/lib/api/middleware/auth.ts` — withServiceAuth middleware; verify it has no Prisma dependency

  **API/Type References**:
  - `apps/admin/src/lib/db/index.ts` (created in Task 5) — New db import source

  **External References**:
  - None needed — simple import replacement

  **WHY Each Reference Matters**:
  - Internal routes are consumed by rag-service and other apps via SDK. Response shape stability is critical.
  - content/route.ts shows the target pattern: delegate to service, no direct db calls

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: All internal routes compile after migration
    Tool: Bash
    Preconditions: Tasks 5, 10 completed (db client + services migrated)
    Steps:
      1. Run: grep -r "from '@/lib/db/prisma'" apps/admin/src/app/api/v1/internal/ apps/admin/src/app/api/cron/
      2. Assert: zero matches returned
      3. Run: grep -r "from '@/prisma/generated'" apps/admin/src/app/api/v1/internal/ apps/admin/src/app/api/cron/
      4. Assert: zero matches returned
      5. Run: pnpm --filter admin exec tsc --noEmit --pretty 2>&1 | grep -E "internal|cron" | head -20
      6. Assert: no type errors in internal/cron route files
    Expected Result: Zero Prisma imports remain in internal/cron routes, no type errors
    Failure Indicators: grep returns matches, or tsc reports errors in these files
    Evidence: .sisyphus/evidence/task-15-internal-routes-compile.txt

  Scenario: Internal content endpoint returns valid RAG data
    Tool: Bash (curl)
    Preconditions: Admin app running on port 3001, INTERNAL_SERVICE_TOKEN set
    Steps:
      1. Run: curl -s -X GET http://localhost:3001/api/v1/internal/content -H "X-Service-Token: $INTERNAL_SERVICE_TOKEN" -H "Content-Type: application/json" | head -c 2000
      2. Assert: Response is JSON with aboutMe, projects, knowledgeDocs keys
      3. Assert: HTTP status 200
    Expected Result: Valid JSON response with expected structure matching pre-migration output
    Failure Indicators: HTTP 500, missing keys, empty response
    Evidence: .sisyphus/evidence/task-15-internal-content-response.json
  ```

  **Commit**: YES — groups with Task 16
  - Message: `refactor(admin): migrate internal routes and validation schemas to drizzle`
  - Files: `apps/admin/src/app/api/v1/internal/**/*.ts`, `apps/admin/src/app/api/cron/**/*.ts`
  - Pre-commit: `grep -r "from '@/lib/db/prisma'" apps/admin/src/app/api/v1/internal/ apps/admin/src/app/api/cron/ | wc -l` → 0

- [ ] 16. Update Validation Schema Enum Imports (1 file)

  **What to do**:
  - Migrate `apps/admin/src/lib/validations/project-context.schema.ts` — the ONLY validation file importing from Prisma generated client:
    - Replace `import { ProjectContextType } from '@/prisma/generated/client/client'` with `import { projectContextTypeEnum } from '@/lib/db/schema'`
    - Update the Zod enum to use Drizzle's enum values: `z.enum(projectContextTypeEnum.enumValues)`
    - Or use the enum values array directly from the schema definition
  - Verify all 17 validation schema files have no remaining Prisma imports:
    - `project.schema.ts`, `knowledge.schema.ts`, `contact.schema.ts`, `chat-log.schema.ts`, `booking.schema.ts`, `blog-link.schema.ts`, `achievement.schema.ts`, `guestbook.schema.ts`, `project-context.schema.ts`, `profile-link.schema.ts`, `booking-availability.schema.ts`, `anonymous-message.schema.ts`, `booking-slots.schema.ts`, `analytics.schema.ts`, `contact-settings.schema.ts`, `about.schema.ts`, `booking-settings.schema.ts`

  **Must NOT do**:
  - Change validation logic or error messages
  - Modify non-enum validation rules
  - Touch schema files that don't import from Prisma

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single file change — replace one import and one enum reference. Plus a verification grep across all schemas.
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**:
    - All skills: Not applicable for a single import change

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5 (with Tasks 15, 17, 18)
  - **Blocks**: Task 18
  - **Blocked By**: Task 2 (schema file with enum definitions)

  **References**:

  **Pattern References**:
  - `apps/admin/src/lib/validations/project-context.schema.ts` — The one file to change; currently imports `ProjectContextType` from Prisma
  - `apps/admin/src/lib/db/schema.ts` (created in Task 2) — Source of `projectContextTypeEnum` export

  **API/Type References**:
  - Drizzle pgEnum exports `.enumValues` property which is a readonly tuple of string values

  **External References**:
  - Drizzle enum docs: https://orm.drizzle.team/docs/column-types/pg#enum — pgEnum exports

  **WHY Each Reference Matters**:
  - project-context.schema.ts is the only validation file with Prisma coupling. After this change, the entire validations/ directory is Prisma-free.
  - Drizzle's `.enumValues` gives us a type-safe tuple for Zod enum construction

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: No Prisma imports in validation schemas
    Tool: Bash
    Preconditions: Task 2 completed (schema file exists)
    Steps:
      1. Run: grep -r "from '@/prisma/generated'" apps/admin/src/lib/validations/
      2. Assert: zero matches returned
      3. Run: grep -r "from '@/lib/db/schema'" apps/admin/src/lib/validations/project-context.schema.ts
      4. Assert: exactly 1 match (the new import)
    Expected Result: Zero Prisma imports in validations dir, one Drizzle schema import in project-context
    Failure Indicators: grep finds Prisma imports still present
    Evidence: .sisyphus/evidence/task-16-validation-no-prisma.txt

  Scenario: Validation schema type-checks correctly
    Tool: Bash
    Preconditions: Task 2 completed
    Steps:
      1. Run: pnpm --filter admin exec tsc --noEmit --pretty 2>&1 | grep -i "validations" | head -20
      2. Assert: no type errors in validations/ directory
    Expected Result: TypeScript compiles validation schemas without errors
    Failure Indicators: Type errors mentioning validations/ files
    Evidence: .sisyphus/evidence/task-16-validation-typecheck.txt
  ```

  **Commit**: YES — groups with Task 15
  - Message: `refactor(admin): migrate internal routes and validation schemas to drizzle`
  - Files: `apps/admin/src/lib/validations/project-context.schema.ts`
  - Pre-commit: `grep -r "from '@/prisma/generated'" apps/admin/src/lib/validations/ | wc -l` → 0

- [ ] 17. Rewrite Seed Script for Drizzle (1 file)

  **What to do**:
  - Rewrite `apps/admin/prisma/seed.ts` (953 lines) to use Drizzle ORM instead of PrismaClient:
  - **Import changes**:
    - Remove: `import { PrismaClient } from './generated/client/client'`, `PrismaPg` adapter, `pg.Pool`
    - Add: `import { db } from '../src/lib/db'`, `import { sql } from 'drizzle-orm'`
    - Add: all table imports from `'../src/lib/db/schema'`
    - Add: all 4 enum imports from schema: `userRoleEnum`, `projectContextTypeEnum`, `slotStatusEnum`, `bookingStatusEnum` — use their values as string literals
  - **Query translations** (every operation in the seed):
    - `prisma.X.upsert({ where, update, create })` → `db.insert(X).values(data).onConflictDoUpdate({ target: X.uniqueCol, set: updateData })`
    - `prisma.X.createMany({ data, skipDuplicates })` → `db.insert(X).values(data).onConflictDoNothing()`
    - `prisma.X.deleteMany()` → `db.delete(X)`
    - `prisma.X.create({ data })` → `db.insert(X).values(data).returning()`
    - `prisma.X.update({ where, data })` → `db.update(X).set(data).where(eq(X.id, id))`
    - `prisma.X.count()` → `db.select({ count: count() }).from(X)` then `result[0].count`
    - `prisma.X.findMany()` → `db.select().from(X)`
    - `prisma.$disconnect()` → no-op (postgres.js handles connection lifecycle) or remove entirely
  - **Enum value changes**:
    - `UserRole.ADMIN` → `'ADMIN'` (string literal)
    - `SlotStatus.AVAILABLE` / `BOOKED` / `BLOCKED` → `'AVAILABLE'` / `'BOOKED'` / `'BLOCKED'`
    - `BookingStatus.CONFIRMED` / `PENDING` → `'CONFIRMED'` / `'PENDING'`
    - `ProjectContextType.X` → `'X'` (string literals)
  - **JSON field handling**:
    - Prisma allows direct JSON objects — Drizzle does too, no special handling needed
  - **Array field handling**:
    - Prisma `techStack: ['React', 'Next.js']` → same syntax works in Drizzle
  - **Date handling**:
    - `new Date('2024-...')` → same syntax works in Drizzle
    - Date-only fields (BookingSlot.date): use `new Date('2025-01-20')` — Drizzle pg-core date column serializes correctly
  - **Composite unique upsert** (BookingSlot):
    - `prisma.bookingSlot.create` with `skipDuplicates` → `db.insert(bookingSlots).values(data).onConflictDoNothing()`
    - Or use `onConflictDoUpdate({ target: [bookingSlots.date, bookingSlots.time], set: {...} })` if update needed
  - Move the seed file to `apps/admin/src/lib/db/seed.ts` (closer to Drizzle config) or keep at `apps/admin/prisma/seed.ts` — KEEP at same location for now, update `drizzle.config.ts` to reference it
  - Update `apps/admin/package.json` script `db:seed` to use `tsx apps/admin/prisma/seed.ts` (or update the existing command)
  - Ensure seed is idempotent: use `onConflictDoNothing()` or `onConflictDoUpdate()` for all inserts

  **Must NOT do**:
  - Change the seed data content (names, emails, dates, descriptions)
  - Add or remove seeded entities
  - Change the order of operations (some seeds depend on earlier ones)
  - Use raw SQL for seed operations — use Drizzle query builder

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: 953-line file rewrite requiring careful translation of every query. Must preserve idempotency and handle composite unique constraints. High risk of subtle bugs.
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**:
    - `playwright`: Not UI work
    - `frontend-design`: Not UI work

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5 (with Tasks 15, 16, 18)
  - **Blocks**: Task 18
  - **Blocked By**: Tasks 2, 3, 5, 7 (schema + relations + db client + schema pushed to DB)

  **References**:

  **Pattern References**:
  - `apps/admin/prisma/seed.ts` — Current seed file (953 lines). Every operation needs translation.
  - `apps/admin/src/lib/db/schema.ts` (created in Task 2) — Table definitions and enum exports
  - `apps/admin/src/lib/db/index.ts` (created in Task 5) — db client import

  **External References**:
  - Drizzle insert docs: https://orm.drizzle.team/docs/insert — insert, onConflictDoNothing, onConflictDoUpdate
  - Drizzle select docs: https://orm.drizzle.team/docs/select — select with count()

  **WHY Each Reference Matters**:
  - The current seed.ts is the exact source to translate — every Prisma call must have a Drizzle equivalent
  - Schema file provides table references and enum values
  - Drizzle insert docs are critical for onConflict patterns which replace Prisma's upsert/skipDuplicates

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Seed script compiles without errors
    Tool: Bash
    Preconditions: Tasks 2, 3, 5, 7 completed (schema, relations, db client, DB pushed)
    Steps:
      1. Run: pnpm --filter admin exec tsc --noEmit --pretty 2>&1 | grep -i "seed" | head -20
      2. Assert: no type errors in seed.ts
      3. Run: grep -r "PrismaClient\|from '@/prisma/generated'\|from './generated'" apps/admin/prisma/seed.ts
      4. Assert: zero matches (all Prisma imports removed)
    Expected Result: Seed file compiles and has zero Prisma references
    Failure Indicators: Type errors or Prisma imports found
    Evidence: .sisyphus/evidence/task-17-seed-compile.txt

  Scenario: Seed script runs successfully against database
    Tool: Bash
    Preconditions: Database accessible, schema pushed (Task 7)
    Steps:
      1. Run: pnpm --filter admin db:seed 2>&1 | tail -30
      2. Assert: output contains success message or count summaries without errors
      3. Assert: no "Error" or "FATAL" in output
      4. Run seed a second time (idempotency check): pnpm --filter admin db:seed 2>&1 | tail -30
      5. Assert: second run also succeeds without duplicate errors
    Expected Result: Seed populates database correctly, runs idempotently on second execution
    Failure Indicators: SQL errors, constraint violations, connection failures, different results on second run
    Evidence: .sisyphus/evidence/task-17-seed-run.txt

  Scenario: Seed data integrity check
    Tool: Bash
    Preconditions: Seed executed successfully
    Steps:
      1. Start admin app: pnpm --filter admin dev &
      2. Wait 10s for startup
      3. Run: curl -s http://localhost:3001/api/v1/public/projects | jq '.data | length'
      4. Assert: returns 8 (number of seeded projects)
      5. Run: curl -s http://localhost:3001/api/v1/public/about | jq '.data.displayName'
      6. Assert: returns expected name from seed data
      7. Kill dev server
    Expected Result: Seeded data accessible via API with correct counts and values
    Failure Indicators: API returns empty data, wrong counts, or 500 errors
    Evidence: .sisyphus/evidence/task-17-seed-data-integrity.json
  ```

  **Commit**: YES
  - Message: `refactor(admin): rewrite seed script for drizzle orm`
  - Files: `apps/admin/prisma/seed.ts`
  - Pre-commit: `grep -c "PrismaClient" apps/admin/prisma/seed.ts` → 0

- [ ] 18. Full TypeCheck + Build Verification (Gate)

  **What to do**:
  - Run full TypeScript compilation check across the entire admin app:
    - `pnpm --filter admin exec tsc --noEmit --pretty`
    - Fix ANY remaining type errors — this is the gate task
  - Run full lint check:
    - `pnpm --filter admin lint`
    - Fix ANY lint errors introduced by migration
  - Run full build:
    - `pnpm --filter admin build`
    - Verify build succeeds without errors
  - Run monorepo-wide checks to catch cross-package issues:
    - `pnpm typecheck` (all apps)
    - `pnpm build` (all apps)
  - Common type issues to watch for:
    - Missing `.returning()` — Prisma always returns, Drizzle needs explicit `.returning()`
    - `null` vs `undefined` — Prisma returns `null` for missing records, Drizzle returns `undefined` (empty array from select)
    - Date serialization — Prisma returns Date objects, Drizzle also returns Date objects but may differ for date-only columns
    - JSON column types — Prisma uses `JsonValue`, Drizzle infers from column definition
    - Array column types — Prisma uses `string[]`, Drizzle uses `string[]` via `.array()` — should match
    - Enum types — Prisma enums are TypeScript enums, Drizzle enums are string unions from pgEnum
  - Verify zero `import` references to old Prisma paths remain:
    - `grep -r "from '@/lib/db/prisma'" apps/admin/src/`
    - `grep -r "from '@/prisma/generated'" apps/admin/src/`
    - `grep -r "from '../../../apps/admin'" packages/auth/`
    - `grep -r "PrismaClient" apps/admin/src/` (exclude seed.ts if not yet migrated)
    - All must return zero matches

  **Must NOT do**:
  - Use `any` or `@ts-ignore` to suppress errors — fix them properly
  - Skip monorepo-wide build verification
  - Leave warnings unaddressed if they indicate migration issues

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Gate task requiring full compilation, identification of all remaining issues, and systematic fixing. May need to touch many files to resolve cascading type errors.
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**:
    - All skills: This is a verification + fix task, no specialized domain

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 5 — SEQUENTIAL after Tasks 8-17 complete
  - **Blocks**: Tasks 19, 20
  - **Blocked By**: ALL Tasks 1-17

  **References**:

  **Pattern References**:
  - Every file modified in Tasks 1-17 — this task verifies them all

  **API/Type References**:
  - `apps/admin/src/lib/db/schema.ts` (Task 2) — All table/enum type exports
  - `packages/auth/src/config.ts` (Task 6) — Auth adapter types

  **External References**:
  - Drizzle TypeScript types: https://orm.drizzle.team/docs/goodies#type-api — `InferSelectModel`, `InferInsertModel`

  **WHY Each Reference Matters**:
  - This is the final gate before cleanup. Every migration file must compile correctly.
  - The schema file's type exports are the source of truth for all table types.

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Zero Prisma imports remain
    Tool: Bash
    Preconditions: Tasks 1-17 all completed
    Steps:
      1. Run: grep -r "from '@/lib/db/prisma'" apps/admin/src/ | wc -l
      2. Assert: output is 0
      3. Run: grep -r "from '@/prisma/generated'" apps/admin/src/ | wc -l
      4. Assert: output is 0
      5. Run: grep -r "from '../../../apps/admin'" packages/auth/ | wc -l
      6. Assert: output is 0
      7. Run: grep -r "PrismaClient" apps/admin/src/ | wc -l
      8. Assert: output is 0
    Expected Result: Zero Prisma references in production code
    Failure Indicators: Any grep returns non-zero count
    Evidence: .sisyphus/evidence/task-18-zero-prisma-imports.txt

  Scenario: Full TypeScript compilation succeeds
    Tool: Bash
    Preconditions: All migrations complete
    Steps:
      1. Run: pnpm --filter admin exec tsc --noEmit --pretty 2>&1
      2. Assert: exit code 0, no "error TS" in output
      3. Run: pnpm typecheck 2>&1 | tail -20
      4. Assert: all apps pass type check
    Expected Result: Zero type errors across admin app and monorepo
    Failure Indicators: Non-zero exit code, "error TS" messages
    Evidence: .sisyphus/evidence/task-18-typecheck.txt

  Scenario: Full build succeeds
    Tool: Bash
    Preconditions: TypeScript check passes
    Steps:
      1. Run: pnpm --filter admin build 2>&1 | tail -30
      2. Assert: build completes successfully
      3. Run: pnpm build 2>&1 | tail -30
      4. Assert: all apps build successfully
    Expected Result: Admin app and full monorepo build without errors
    Failure Indicators: Build failures, missing module errors, type resolution failures
    Evidence: .sisyphus/evidence/task-18-build.txt

  Scenario: Full lint passes
    Tool: Bash
    Preconditions: Build succeeds
    Steps:
      1. Run: pnpm --filter admin lint 2>&1 | tail -20
      2. Assert: no lint errors (warnings acceptable)
    Expected Result: No lint errors in admin app
    Failure Indicators: Lint errors in migrated files
    Evidence: .sisyphus/evidence/task-18-lint.txt
  ```

  **Commit**: YES
  - Message: `refactor(admin): fix remaining type errors from drizzle migration`
  - Files: Any files with type fixes
  - Pre-commit: `pnpm --filter admin exec tsc --noEmit` → exit code 0

- [ ] 19. Remove Prisma Artifacts and Dependencies

  **What to do**:
  - Remove Prisma packages from `apps/admin/package.json`:
    - `@prisma/client`, `@prisma/adapter-pg` from dependencies
    - `prisma` from devDependencies
  - Remove Prisma packages from `packages/auth/package.json`:
    - `@auth/prisma-adapter`, `@prisma/client` from dependencies
  - Delete the old DB client file: `apps/admin/src/lib/db/prisma.ts`
  - Delete the Prisma schema directory: `apps/admin/prisma/schema.prisma` → move to `apps/admin/prisma/archived/schema.prisma` (keep for reference)
  - Delete the generated client directory: `apps/admin/prisma/generated/`
  - Remove Prisma-related scripts from `apps/admin/package.json` that reference `prisma generate`, `prisma migrate`, `prisma studio` — replace with Drizzle equivalents already added in Task 1
  - Verify NO remaining imports from `@/lib/db/prisma` or `@/prisma/generated/` exist:
    - `grep -r "from '@/lib/db/prisma'" apps/admin/src/` → 0 results
    - `grep -r "from '@/prisma/generated" apps/admin/src/` → 0 results
    - `grep -r "@prisma/client" apps/admin/src/` → 0 results
  - Remove `pg` package from `apps/admin/package.json` dependencies (Prisma's pg adapter dep; Drizzle uses postgres.js instead)
  - Run `pnpm install` from monorepo root to clean lockfile
  - Verify `pnpm --filter admin typecheck` still passes after removal

  **Must NOT do**:
  - Delete `apps/admin/prisma/migrations/` — keep migration history as archive
  - Delete `apps/admin/prisma/seed.ts` — already rewritten in Task 17
  - Remove `drizzle-orm` or `postgres` packages (those are the NEW deps)
  - Break the lockfile — run `pnpm install` after all removals

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Straightforward file deletions and package.json edits — no logic, just cleanup
  - **Skills**: []
    - No specialized skills needed for file removal
  - **Skills Evaluated but Omitted**:
    - `git-master`: Not needed — just cleanup, commit handled by convention

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 20)
  - **Parallel Group**: Wave 6 (with Task 20)
  - **Blocks**: F1-F4 (Final Verification)
  - **Blocked By**: Task 18 (must pass typecheck first before cleanup)

  **References**:

  **Pattern References**:
  - `apps/admin/package.json` — Current Prisma deps to remove: `@prisma/client`, `@prisma/adapter-pg`, `pg`, devDep `prisma`
  - `packages/auth/package.json` — Prisma deps to remove: `@auth/prisma-adapter`, `@prisma/client`
  - `apps/admin/src/lib/db/prisma.ts` — Old DB client to delete
  - `apps/admin/prisma/schema.prisma` — Move to archived/
  - `apps/admin/prisma/generated/` — Entire directory to delete

  **External References**:
  - None needed — straightforward deletion

  **WHY Each Reference Matters**:
  - package.json files: Must know exact dep names to remove without accidentally removing Drizzle deps
  - prisma.ts: Old client file — if any import still references it, removal will cause build failure (caught by grep check)
  - generated/: Large directory of auto-generated code — safe to delete after full migration

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Prisma packages fully removed from admin
    Tool: Bash
    Preconditions: All services and routes already migrated (Tasks 1-18 complete)
    Steps:
      1. Run `cat apps/admin/package.json | grep -i prisma` → expect 0 matches
      2. Run `cat packages/auth/package.json | grep -i prisma` → expect 0 matches
      3. Run `ls apps/admin/src/lib/db/prisma.ts 2>&1` → expect "No such file or directory"
      4. Run `ls apps/admin/prisma/generated/ 2>&1` → expect "No such file or directory"
      5. Run `ls apps/admin/prisma/archived/schema.prisma` → expect file exists (archived)
      6. Run `ls apps/admin/prisma/migrations/` → expect directory exists (preserved)
    Expected Result: Zero Prisma traces in deps, old files deleted, archive preserved
    Failure Indicators: Any grep match for "prisma" in package.json deps, prisma.ts still exists
    Evidence: .sisyphus/evidence/task-19-prisma-removed.txt

  Scenario: No orphan imports referencing deleted Prisma files
    Tool: Bash
    Preconditions: Files deleted
    Steps:
      1. Run `grep -r "from '@/lib/db/prisma'" apps/admin/src/` → expect 0 results
      2. Run `grep -r "from '@/prisma/generated" apps/admin/src/` → expect 0 results
      3. Run `grep -r "@prisma/client" apps/admin/src/ packages/auth/src/` → expect 0 results
      4. Run `pnpm --filter admin typecheck` → expect exit 0
      5. Run `pnpm --filter admin build` → expect exit 0
    Expected Result: All grep checks return empty, typecheck and build pass
    Failure Indicators: Any grep match means a file was missed during migration
    Evidence: .sisyphus/evidence/task-19-orphan-check.txt
  ```

  **Commit**: YES (groups with Task 20)
  - Message: `chore(admin): remove Prisma artifacts and dependencies`
  - Files: `apps/admin/package.json`, `packages/auth/package.json`, `pnpm-lock.yaml`, deleted files
  - Pre-commit: `pnpm --filter admin typecheck && pnpm --filter admin build`

- [ ] 20. Update Context Documentation Files

  **What to do**:
  - Update `.context/implementation/database-schema.yaml` if any schema details changed during migration (verify current content matches Drizzle schema)
  - Update `.context/implementation/directory-structure.yaml` to reflect:
    - New file: `apps/admin/src/lib/db/schema.ts`
    - New file: `apps/admin/src/lib/db/relations.ts`
    - New file: `apps/admin/src/lib/db/index.ts`
    - New file: `apps/admin/drizzle.config.ts`
    - Removed file: `apps/admin/src/lib/db/prisma.ts`
    - Archived: `apps/admin/prisma/schema.prisma` → `apps/admin/prisma/archived/schema.prisma`
    - Removed: `apps/admin/prisma/generated/`
  - Update `.context/base/tech-stack.yaml` to reflect:
    - ORM: Drizzle ORM (was Prisma)
    - DB driver: postgres.js (was pg + @prisma/adapter-pg)
    - Auth adapter: @auth/drizzle-adapter (was @auth/prisma-adapter)
  - Update `.context/base/architecture.md` if it references Prisma anywhere → replace with Drizzle
  - Update `TASKS.md` — mark Plan 0 tasks as completed
  - Update `TASKS/PROGRESS.md` — append Plan 0 completion entry with:
    - Status: Completed
    - Date: current date
    - Files: list of all modified files
    - Subtasks completed
    - Notes: key decisions made during migration
  - Verify ALL `.context/` files are consistent — no remaining Prisma references:
    - `grep -r "[Pp]risma" .context/` → only historical references (e.g., "migrated from Prisma") are acceptable

  **Must NOT do**:
  - Change AGENTS.md Sections 1, 2, or 4 (forbidden per AGENTS.md §10)
  - Add new requirements not in the migration scope
  - Modify actual source code — this task is docs-only
  - Rewrite .context files from scratch — update in-place

  **Recommended Agent Profile**:
  - **Category**: `writing`
    - Reason: Documentation update task — needs careful prose and YAML editing
  - **Skills**: []
    - No specialized skills needed for doc updates
  - **Skills Evaluated but Omitted**:
    - `seo-audit`: Not relevant — internal documentation, not public SEO
    - `copywriting`: Not marketing copy — technical documentation

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 19)
  - **Parallel Group**: Wave 6 (with Task 19)
  - **Blocks**: F1-F4 (Final Verification)
  - **Blocked By**: Task 18 (must confirm build passes before documenting completion)

  **References**:

  **Pattern References**:
  - `.context/implementation/database-schema.yaml` — Current schema docs to update
  - `.context/implementation/directory-structure.yaml` — File tree to update
  - `.context/base/tech-stack.yaml` — Tech stack listing to update
  - `.context/base/architecture.md` — Architecture description to update
  - `TASKS.md` — Task tracker to mark complete
  - `TASKS/PROGRESS.md` — Progress log to append

  **External References**:
  - None needed — internal documentation only

  **WHY Each Reference Matters**:
  - .context/ files: These are the primary source of truth for all AI agents — stale references to Prisma will cause future agents to make incorrect decisions
  - TASKS.md/PROGRESS.md: Required by AGENTS.md §10 after completing any task
  - architecture.md: May reference "Prisma ORM" in system component descriptions

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Context files reflect Drizzle ORM
    Tool: Bash
    Preconditions: Migration complete, all source code updated
    Steps:
      1. Run `grep -i "prisma" .context/base/tech-stack.yaml` → expect 0 matches (or only "migrated from Prisma" historical notes)
      2. Run `grep -i "prisma" .context/base/architecture.md` → expect 0 matches (or only historical context)
      3. Run `grep "drizzle" .context/base/tech-stack.yaml` → expect matches for ORM entry
      4. Run `grep "schema.ts" .context/implementation/directory-structure.yaml` → expect entry for db/schema.ts
      5. Run `grep "prisma.ts" .context/implementation/directory-structure.yaml` → expect 0 matches (removed)
      6. Run `grep "drizzle.config.ts" .context/implementation/directory-structure.yaml` → expect entry exists
    Expected Result: All .context/ files consistently reference Drizzle, no stale Prisma references
    Failure Indicators: Active Prisma references in tech-stack or architecture docs
    Evidence: .sisyphus/evidence/task-20-context-docs.txt

  Scenario: TASKS.md and PROGRESS.md updated
    Tool: Bash
    Preconditions: All Plan 0 tasks complete
    Steps:
      1. Run `grep "Plan 0" TASKS.md` → expect entry marked as completed
      2. Run `grep "Plan 0" TASKS/PROGRESS.md` → expect completion entry with date
      3. Run `grep "Drizzle" TASKS/PROGRESS.md` → expect migration notes
    Expected Result: Task tracking files reflect Plan 0 completion
    Failure Indicators: No Plan 0 entry, or entry not marked complete
    Evidence: .sisyphus/evidence/task-20-task-tracking.txt
  ```

  **Commit**: YES (groups with Task 19)
  - Message: `docs(admin): update context files for Drizzle ORM migration`
  - Files: `.context/implementation/database-schema.yaml`, `.context/implementation/directory-structure.yaml`, `.context/base/tech-stack.yaml`, `.context/base/architecture.md`, `TASKS.md`, `TASKS/PROGRESS.md`
  - Pre-commit: `grep -r "[Pp]risma" .context/ | grep -v migrated | grep -v archived` → expect 0 active references

---

## Final Verification Wave

> 4 review agents run in PARALLEL. ALL must APPROVE. Rejection → fix → re-run.

- [ ] F1. **Plan Compliance Audit** — `oracle`
      Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, curl endpoint, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
      Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
      Run `pnpm --filter admin typecheck` + `pnpm --filter admin build`. Review all changed files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names (data/result/item/temp). Verify strict TypeScript compliance per AGENTS.md Section 5.3.
      Output: `Build [PASS/FAIL] | Typecheck [PASS/FAIL] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill for auth)
      Start dev server from clean state. Execute EVERY QA scenario from EVERY task — follow exact steps, capture evidence. Test cross-task integration: auth flow → create project → list projects → guestbook → bookings. Test edge cases: empty state, invalid input. Save to `.sisyphus/evidence/final-qa/`.
      Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
      For each task: read "What to do", read actual diff (git log/diff). Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check "Must NOT do" compliance. Detect cross-task contamination. Verify NO Prisma imports remain: `rg "from ['\"]@prisma" apps/ packages/` must return zero results. Verify NO `prisma` references in package.json deps.
      Output: `Tasks [N/N compliant] | Prisma Refs [CLEAN/N found] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

| After Task(s) | Commit Message                                                 | Files                                                | Pre-commit Check                |
| ------------- | -------------------------------------------------------------- | ---------------------------------------------------- | ------------------------------- |
| 1             | `chore(admin): install drizzle deps, remove prisma deps`       | package.json files, pnpm-lock.yaml                   | `pnpm install` succeeds         |
| 2, 3          | `feat(admin): add drizzle schema and relations`                | schema.ts, relations.ts                              | `pnpm --filter admin typecheck` |
| 4, 5          | `feat(admin): add drizzle config and db client`                | drizzle.config.ts, db/index.ts, package.json scripts | `pnpm --filter admin typecheck` |
| 6             | `refactor(auth): decouple from prisma, use drizzle adapter`    | packages/auth/src/\*.ts, packages/auth/package.json  | `pnpm --filter admin typecheck` |
| 7             | `chore(admin): push drizzle schema to database`                | drizzle/ migration files                             | `pnpm --filter admin db:push`   |
| 8, 9, 10      | `refactor(admin): migrate simple+moderate services to drizzle` | 13 service files                                     | `pnpm --filter admin typecheck` |
| 11, 12        | `refactor(admin): migrate complex services to drizzle`         | 5 service files                                      | `pnpm --filter admin typecheck` |
| 13, 14, 15    | `refactor(admin): migrate api routes to drizzle`               | ~15 route files                                      | `pnpm --filter admin typecheck` |
| 16            | `refactor(admin): update validation schema enum imports`       | validation files                                     | `pnpm --filter admin typecheck` |
| 17            | `refactor(admin): rewrite seed script for drizzle`             | seed.ts                                              | `pnpm --filter admin typecheck` |
| 18            | `chore(admin): verify full typecheck and build pass`           | — (verification only)                                | `pnpm --filter admin build`     |
| 19, 20        | `chore(admin): cleanup prisma artifacts, update docs`          | prisma/, .gitignore, .context/, TASKS/               | —                               |

---

## Success Criteria

### Verification Commands

```bash
# TypeScript compilation
pnpm --filter admin typecheck  # Expected: exit code 0, zero errors

# Production build
pnpm --filter admin build  # Expected: exit code 0

# No Prisma imports remain
rg "from ['\"]@prisma" apps/ packages/  # Expected: zero matches
rg "from ['\"].*prisma" apps/admin/src/  # Expected: zero matches

# Drizzle Studio connects
pnpm --filter admin db:studio  # Expected: opens, shows 22 tables

# Seed runs idempotently
pnpm --filter admin db:seed  # Expected: exit code 0
pnpm --filter admin db:seed  # Expected: exit code 0 (second run)
```

### Final Checklist

- [ ] All "Must Have" items present and verified
- [ ] All "Must NOT Have" items absent (searched and confirmed)
- [ ] TypeScript strict mode passes with zero errors
- [ ] Build succeeds
- [ ] Dev server starts and responds
- [ ] Auth flow works (Google OAuth sign-in)
- [ ] All public API endpoints return correct data
- [ ] All admin API endpoints return correct data
- [ ] Transaction operations work (booking, reorder)
- [ ] Seed script is idempotent
- [ ] No Prisma imports remain anywhere
- [ ] `.context/` files updated to reflect completed migration
- [ ] `TASKS/PROGRESS.md` updated
