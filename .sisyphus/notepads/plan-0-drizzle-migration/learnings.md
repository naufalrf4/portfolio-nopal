# Learnings: plan-0-drizzle-migration

This file captures conventions, patterns, and accumulated wisdom from task execution.

## [2026-02-22T12:33:12Z] Session Start

- Session ID: ses_37aa91247ffeRWEJmf55UK1GLN
- Plan: Prisma → Drizzle ORM Migration (22 models, 4 enums, 72 API routes, 18 service files)
- Critical constraints: Zero behavior changes, no comments in code, never commit Sisyphus files or AI agent docs
- Resolved dependency version issues by pinning to latest published releases (postgres@3.4.8, drizzle-orm@0.45.1, drizzle-kit@0.31.9, @auth/drizzle-adapter@1.11.1).
- pnpm install emitted warnings for deprecated subdependencies but completed successfully with the new Drizzle stack.

## [2026-02-22T13:25:00Z] Task 3: Relations Created

### File Created

- apps/admin/src/lib/db/relations.ts (72 lines)

### Relations Defined

- 9 relations() exports: users, accounts, sessions, guestbookEntries, projects, projectContexts, projectImages, bookingSlots, bookings
- 5 many() calls: users→accounts/sessions/guestbook, projects→contexts/images
- 7 one() calls: accounts→user, sessions→user, guestbook→user, contexts→project, images→project, bookings→slot, slots→booking

### Pattern Applied

- Parent side: relations(table, ({ many }) => ({ rel: many(childTable) }))
- Child side: relations(table, ({ one }) => ({ rel: one(parentTable, { fields: [...], references: [...] }) }))
- Both sides defined for every relation (bidirectional)
- One-to-one: bookingSlots ↔ bookings (unique slotId in bookings table)

### Critical Learnings

- **SCOPE VIOLATION INCIDENT**: Initial subagent attempt modified 127 files across entire monorepo including forbidden files (AGENTS.md, .sisyphus/plans/\*.md)
- **Resolution**: Orchestrator reverted all changes via `git reset --hard HEAD`, manually re-created ONLY relations.ts
- **Root Cause**: Subagent ignored single-task constraint and touched out-of-scope files
- **Prevention**: More explicit scope boundaries in future delegation prompts

### TypeScript Status

- relations.ts: Clean (zero errors)
- Preexisting errors in ContextManager.tsx and ProjectForm.tsx (unrelated, exist in main branch)
- These errors do NOT block Task 3 completion (not introduced by this task)

## Sun Feb 22 2026 22:42:38 GMT+0000 (Coordinated Universal Time) Task 5: DB Client Created

- File created: apps/admin/src/lib/db/index.ts
- File deleted: apps/admin/src/lib/db/prisma.ts
- Driver: postgres.js (NOT pg pool)
- Connection config: max 10, idle_timeout 20, connect_timeout 10
- Schema passed to drizzle() config: { ...schema, ...relations }
- Issues/Notes: LSP diagnostics timed out during initialization but manual verification shows no syntax errors

## [2026-02-22] Task 6: Auth Decoupled from Prisma

- Modified files: packages/auth/src/{config.ts, auth.ts, index.ts}
- Created file: apps/admin/src/lib/auth.ts (rewrote existing file)
- Adapter: DrizzleAdapter (replaced PrismaAdapter), cast as `any` due to missing `emailVerified` column
- Callback pattern: AuthDbCallbacks interface with getUserByEmail + upsertUser
- DB queries: Drizzle `select().from().where()` and `insert().onConflictDoUpdate()`
- Schema table names: 'users', 'accounts', 'sessions', 'verification_tokens' (not Auth.js defaults)
- DrizzleAdapter accepts 2nd arg for custom table refs: `{ usersTable, accountsTable, sessionsTable, verificationTokensTable }`
- Used `DrizzleAdapter(db) as any` in config.ts because our users table lacks `emailVerified` column
- The `role` column uses pgEnum('UserRole', ['ADMIN', 'USER']) — Drizzle returns it as string union, compatible with AuthDbCallbacks interface
- packages/auth/src/auth.ts changed from Prisma-coupled initializer to simple re-export shim
- packages/auth/src/index.ts exports: createAuthConfig, isAdminEmail, AuthDbCallbacks type, Session type
- Removed: auth, signIn, signOut exports from @naufalrf/auth (moved to apps/admin/src/lib/auth.ts)
- KNOWN IMPACT: 9 files in apps/admin still import `auth` from '@naufalrf/auth' — will break until Task 18 updates them to `@/lib/auth`
- Pre-existing errors: many files still import from '@/lib/db/prisma' (other migration tasks will handle)
- Evidence files saved: task-6-auth-no-prisma.txt, task-6-auth-decoupled.txt, task-6-auth-typecheck.txt

## [2026-02-22 15:45] Task 7: Push Schema to DB + Verify

### Critical Discovery: Introspected Schema vs Hand-Written Schema

**Issue**: Hand-written schema in `src/lib/db/schema.ts` did not match actual database schema from Prisma migrations.

**Root Cause**:

- Hand-written schema used `.unique()` on columns (e.g., `sessionId: text('sessionId').notNull().unique()`)
- Database has `uniqueIndex` constraints from Prisma with different names (e.g., `chat_logs_sessionId_key`)
- drizzle-kit `db:push` detected schema drift and prompted to add new constraints

**Resolution**:

1. Ran `pnpm drizzle-kit introspect` to generate schema directly from database
2. Replaced hand-written `src/lib/db/schema.ts` with introspected `drizzle/schema.ts`
3. Introspected schema uses `uniqueIndex()` in table's 3rd argument, not `.unique()` on columns
4. After replacement, `pnpm db:push` returned "[i] No changes detected" (expected NO-OP)

**Key Pattern - Unique Constraints in Drizzle**:

```typescript
export const chatLogs = pgTable(
  'chat_logs',
  {
    sessionId: text('sessionId').notNull(),
  },
  (table) => [uniqueIndex('chat_logs_sessionId_key').on(table.sessionId)]
);
```

**Lesson**: For migrations from Prisma → Drizzle, ALWAYS use `drizzle-kit introspect` as source of truth rather than hand-writing schema. Introspected schema guarantees exact database match, ensuring `db:push` is a NO-OP as intended.

**Database Verification**:

- ✅ 22 tables exist (excluding \_prisma_migrations)
- ✅ 4 enums exist (BookingStatus, ProjectContextType, SlotStatus, UserRole)
- ✅ Schema sync confirmed: `db:push` reports "No changes detected"

**Files**:

- Evidence: `.sisyphus/evidence/task-7-db-push.txt`, `.sisyphus/evidence/task-7-db-verify.txt`
- Backup: `src/lib/db/schema.ts.backup` (original hand-written schema)
- Active: `src/lib/db/schema.ts` (introspected schema from `drizzle/schema.ts`)

## [2026-02-22] Task 8: Migrate 5 Simple Services to Drizzle

### Files Migrated

1. **about.service.ts**: Singleton pattern (findFirst → limit(1)), upsert logic, JSON column handling
2. **achievements.service.ts**: CRUD + reorder transaction + toggleVisibility
3. **profile-links.service.ts**: CRUD + reorder transaction
4. **blog-links.service.ts**: CRUD + reorder + toggleVisibility + max(order) aggregation
5. **contact-settings.service.ts**: Simplest service (get with auto-create + update)

### Key Patterns Applied

#### ID and Timestamp Generation

- **Problem**: Introspected schema lacks `.defaultRandom()` for `id` and `.defaultNow()` for `updatedAt`
- **Solution**: Manually provide `id: createId()` and `updatedAt: new Date().toISOString()` in all inserts/updates
- **Library**: `@paralleldrive/cuid2` (already in package.json)
- **Pattern**: Every insert needs `{ id: createId(), updatedAt: new Date().toISOString(), ...data }`
- **Pattern**: Every update needs `{ ...data, updatedAt: new Date().toISOString() }`

#### Query Patterns

- `prisma.model.findFirst()` → `db.select().from(table).limit(1)` + `result[0] || null`
- `prisma.model.findMany({ where, orderBy })` → `db.select().from(table).where(conditions).orderBy(asc(table.column))`
- `prisma.model.findUnique({ where: { id } })` → `db.select().from(table).where(eq(table.id, id)).limit(1)` + `result[0] || null`
- `prisma.model.create({ data })` → `db.insert(table).values({ id: createId(), updatedAt: ISO, ...data }).returning()` + destructure `[created]`
- `prisma.model.update({ where: { id }, data })` → `db.update(table).set({ ...data, updatedAt: ISO }).where(eq(table.id, id)).returning()` + destructure `[updated]`
- `prisma.model.delete({ where: { id } })` → `db.delete(table).where(eq(table.id, id))`

#### Conditional WHERE Clauses

- **Prisma**: Build `Prisma.ModelWhereInput` object with conditional spreads
- **Drizzle**: Build `conditions[]` array, use `and(...conditions)` if length > 0
- Example (blog-links with 2 optional filters):
  ```typescript
  const conditions = [];
  if (query?.source) conditions.push(eq(blogLink.source, query.source));
  if (query?.visible !== undefined) conditions.push(eq(blogLink.visible, query.visible));
  if (conditions.length > 0) queryBuilder = queryBuilder.where(and(...conditions));
  ```

#### Aggregation (max)

- **Prisma**: `prisma.model.aggregate({ _max: { order: true } })` → `maxOrder._max.order ?? -1`
- **Drizzle**: `db.select({ maxOrder: max(table.order) }).from(table)` → `result[0]?.maxOrder ?? -1`
- **Import**: Need `max` from `drizzle-orm`

#### Transaction (reorder)

- **Prisma**: `prisma.$transaction(items.map((id, i) => prisma.model.update(...)))`
- **Drizzle**:
  ```typescript
  await db.transaction(async (tx) => {
    for (const [index, id] of items.entries()) {
      await tx.update(table).set({ order: index, updatedAt: ISO }).where(eq(table.id, id));
    }
  });
  ```
- **Critical**: Transactions are callback-based, NOT promise-array-based

#### Type Handling

- **Issue**: Introspected schema has strict types; spread operators with `Record<string, any>` cause type errors
- **Solution**: Use `as any` assertion on `.values()` and `.set()` when using spread with dynamic objects
- **Pattern**: `db.insert(table).values({ ...data } as any).returning()`
- **Rationale**: Better than fighting TypeScript inference on 15+ optional fields

### Edge Cases Handled

- **Optional fields**: Filter `undefined` values before spread to avoid Drizzle type errors (about.service.ts)
- **JSON columns**: Prisma.DbNull → `null` in Drizzle (experience, socialLinks in aboutMe)
- **Singleton pattern**: findFirst + auto-create if not exists (aboutMe, contactSettings)
- **Ordering**: Explicit `.orderBy(asc(table.column))` (achievements, profileLinks, blogLinks)
- **Returning clause**: Always use `.returning()` + destructure `[result]` for insert/update

### Verification

**Evidence Files Created**:

- `task-8-typecheck.txt`: ✓ Zero TypeScript errors, zero Prisma imports
- `task-8-signatures.txt`: ✓ All method signatures preserved (same params, same return types)
- `task-8-imports.txt`: ✓ All files import from `@/lib/db`, `@/lib/db/schema`, `drizzle-orm`, `@paralleldrive/cuid2`

**TypeScript Status**: Clean (no errors in 5 migrated files)

**Imports Replaced**:

- ✗ `import { Prisma } from '@/prisma/generated/client/client'`
- ✗ `import { prisma } from '@/lib/db/prisma'`
- ✓ `import { db } from '@/lib/db'`
- ✓ `import { table } from '@/lib/db/schema'`
- ✓ `import { eq, asc, and, max } from 'drizzle-orm'`
- ✓ `import { createId } from '@paralleldrive/cuid2'`

### Lessons Learned

1. **Introspected schemas don't include default generators**: Must manually provide `id` and `updatedAt` in ALL inserts/updates
2. **TypeScript strictness**: Use `as any` on `.values()` and `.set()` when spreading dynamic objects to avoid fighting inference
3. **Transaction syntax difference**: Drizzle uses callback pattern `db.transaction(async (tx) => {...})`, NOT promise arrays
4. **Aggregations**: Import `max` from `drizzle-orm`, use `db.select({ alias: max(col) }).from(table)`
5. **Optional WHERE clauses**: Build `conditions[]` array, use `and(...conditions)` only if length > 0
6. **Returning pattern**: Always destructure `[result]` after `.returning()` calls

### Next Steps

- Remaining 13 service files need migration
- More complex patterns ahead: projects with relations, bookings with complex transactions
- Consider creating utility helpers for common patterns (e.g., `withTimestamps({ ...data })`)

## [2026-02-22] Task 9: Migrate 4 Service Files with Relations

### Files Migrated

1. **projects.service.ts** (161 lines): getAll (pagination + search + filters), getById, getBySlug, create, update, delete, checkSlugExists
2. **project-contexts.service.ts** (153 lines): getAll (filters), getById, create (with validation), update, delete, reorder (transaction)
3. **guestbook.service.ts** (220 lines): getAll (filters), getById, create (with location data), update, delete, toggleVisibility, updateReactions, addReaction
4. **knowledge-docs.service.ts** (113 lines): getAll (pagination), getById, getByFilename, create, update, delete, markIndexed, getAllForExport

### Key Patterns Applied Successfully

#### Relations with db.query API

- **Prisma**: `include: { relation: true }` or `include: { relation: { orderBy, select } }`
- **Drizzle**: `db.query.table.findMany({ with: { relation: true } })` or `with: { relation: { orderBy: [asc(col)], columns: { ... } } }`
- **Critical**: Relation names from `relations.ts` MUST match (e.g., `projectContexts` not `contexts`, `projectImages` not `images`)
- **Nested select**: Use `columns: { id: true, title: true, slug: true }` inside `with` to select specific fields

#### Pagination Pattern

- **Prisma**: `skip/take` auto-calculated, separate `count` query
- **Drizzle**:
  ```typescript
  const offset = (page - 1) * limit;
  const [items, [{ total }]] = await Promise.all([
    db.select().from(table).offset(offset).limit(limit).orderBy(...),
    db.select({ total: count() }).from(table).where(whereClause),
  ]);
  return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  ```
- **Import**: Need `count` from `drizzle-orm`

#### Search with ILIKE

- **Prisma**: `contains: 'search'` (case-insensitive)
- **Drizzle**: `ilike(table.column, '%${search}%')`
- **Multi-column search**: Use `or(ilike(col1, pattern), ilike(col2, pattern), ilike(col3, pattern))`
- **Import**: Need `ilike, or` from `drizzle-orm`

#### Conditional WHERE Building

- **Pattern**:
  ```typescript
  const conditions = [];
  if (filter1) conditions.push(eq(table.col1, filter1));
  if (filter2 !== undefined) conditions.push(eq(table.col2, filter2));
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  ```
- **Critical**: For optional WHERE clauses, pass `undefined` (not `true`) if no conditions

#### Transaction with Validation

- **Project-contexts reorder**:
  ```typescript
  await db.transaction(async (tx) => {
    for (const [index, id] of contextIds.entries()) {
      await tx.update(table).set({ order: index, updatedAt: ISO }).where(eq(table.id, id));
    }
  });
  ```
- **Validation**: Query all IDs first, check length matches input before transaction

#### Dynamic Update with Timestamp Handling

- **Projects service** handles optional date fields:
  ```typescript
  const updateData: Record<string, unknown> = { ...rest, updatedAt: new Date().toISOString() };
  if (startDate !== undefined) {
    updateData.startDate = startDate ? new Date(startDate).toISOString() : null;
  }
  if (endDate !== undefined) {
    updateData.endDate = endDate ? new Date(endDate).toISOString() : null;
  }
  await db.update(table).set(updateData as any).where(...).returning();
  ```

#### Guestbook Reactions (JSONB Array)

- **Type**: `reactions: jsonb('reactions').notNull().default('[]')` in schema
- **Runtime**: Cast as `Array<{ userId: string; emoji: string }>`
- **Update**:
  ```typescript
  const reactions = (entry.reactions as Array<{ userId: string; emoji: string }>) || [];
  reactions.push({ userId, emoji }); // or splice to remove
  await db.update(table).set({ reactions: reactions as any, updatedAt: ISO });
  ```

### Edge Cases Handled

- **Missing closing braces**: All 4 files initially had syntax errors (missing `}` after last method)
- **Ordering relations**: Use `orderBy: [asc(relatedTable.order)]` inside `with` for nested relations
- **Location data handling**: Guestbook service with optional ipAddress, countryCode, country, city, region
- **Boolean toggles**: toggleVisibility reads current state, inverts, updates
- **Reactions add/remove**: findIndex to check if reaction exists, splice to remove, push to add

### TypeScript Status

**✓ All 4 migrated files have ZERO TypeScript errors**

- Verified with `pnpm --filter admin exec tsc --noEmit`
- Pre-existing errors in other files (still using Prisma imports)
- No errors introduced by this migration

### Evidence Files Created

- `.sisyphus/evidence/task-9-typecheck.txt`: Full typecheck output (no errors in migrated files)
- `.sisyphus/evidence/task-9-relations.txt`: All `db.query` and `with:` patterns (42 occurrences)
- `.sisyphus/evidence/task-9-pagination.txt`: All `offset`, `limit`, `count()` patterns (18 occurrences)

### Imports Replaced

- ✗ `import { Prisma } from '@/prisma/generated/client/client'`
- ✗ `import { prisma } from '@/lib/db/prisma'`
- ✓ `import { db } from '@/lib/db'`
- ✓ `import { projects, projectContexts, projectImages, guestbookEntries, users, knowledgeDocs } from '@/lib/db/schema'`
- ✓ `import { eq, and, or, ilike, asc, desc, count, inArray } from 'drizzle-orm'`
- ✓ `import { createId } from '@paralleldrive/cuid2'`

### Lessons Learned

1. **db.query API is powerful**: Cleanly replaces `include` with `with` + `columns` for nested selects
2. **No leftJoin needed**: For these files, `db.query` API with relations was sufficient
3. **Pagination always explicit**: Must write `count()` query separately + calculate totalPages manually
4. **Search with ILIKE works well**: `ilike('%${search}%')` is straightforward, no special syntax
5. **Relation names matter**: Must use exact relation names from `relations.ts` (camelCase, plural forms)
6. **JSONB arrays**: Cast to specific type, manipulate as JS array, cast back to `any` on update
7. **Syntax check after edit**: Always verify closing braces when editing large class definitions

### Next Steps

- Remaining 9 service files to migrate
- More complex patterns: booking availability (date/time logic), analytics (aggregations), content export
- All migrated files maintain zero behavior changes (same method signatures, same return shapes)

## [2026-02-22] Task 10: Migrate Remaining Services

### Files: contacts, chat-logs, anonymous-messages, content-export

### Patterns Applied

1. **inArray for bulk operations**: Used in contacts.service for bulkMarkAsRead, bulkMarkAsUnread, bulkDelete
2. **onConflictDoUpdate for upsert**: Used in chat-logs.service for sessionId-based upsert
3. **lt() for date comparison**: Used in chat-logs.service for deleteExpired method
4. **db.query.findMany with relations**: Used in content-export.service for projects with projectContexts
5. **createId() for all inserts**: Applied in contacts and chat-logs create/upsert operations
6. **count() aggregation**: Applied in all services for pagination and unread counts
7. **returning() on mutations**: All insert/update/delete operations use .returning() and destructure first element

### Edge Cases Handled

1. **contacts.service**:
   - Dynamic WHERE conditions with conditional array building
   - OR search across multiple fields using `ilike` for case-insensitive search
   - Bulk operations with inArray (updateMany → update + inArray)
   - Proper null handling for optional fields (subject, ipAddress, etc.)

2. **chat-logs.service**:
   - Upsert with onConflictDoUpdate targeting sessionId unique constraint
   - JSON column handling (messages field remains as-is, Drizzle handles jsonb)
   - Post-query transformation for logsWithStats (messageCount, lastMessageAt)
   - Date comparison with lt() for deleteExpired

3. **anonymous-messages.service**:
   - Optional filter parameter with conditional whereClause
   - Parallel queries for messages list + unread count
   - Simple CRUD pattern with proper null returns

4. **content-export.service**:
   - Relational query with db.query.projects.findMany + with clause
   - Nested relation ordering (projectContexts by order field)
   - Type casting for JSONB experience field
   - Array field handling (skills, techStack)

### Evidence

- **TypeCheck**: PASS - Zero TypeScript errors in all 4 migrated files
- **Patterns**: All key Drizzle patterns verified in evidence file:
  - inArray: 4 usages in contacts.service
  - onConflictDoUpdate: 1 usage in chat-logs.service
  - lt(): 1 usage in chat-logs.service
  - db.query: 1 usage in content-export.service
  - createId(): 2 usages (contacts, chat-logs)
  - .returning(): 12 usages across all files

### Notes

- All Prisma imports removed successfully
- Zero unused imports detected
- All method signatures preserved (same params, same return shapes)
- Business logic unchanged (only ORM patterns replaced)
- No behavior changes - direct 1:1 translation from Prisma to Drizzle

## Task 12: Analytics Service Migration

- `analyticsEvents` table has NO `updatedAt` column — only `createdAt` with a default. Insert only needs `createdAt: now`.
- Prisma `.count()` → Drizzle `db.select({ value: count() }).from(table).where(...)` returns `[{ value: number }]`
- Prisma `.groupBy({ by: ['col'], _count: { col: true }, orderBy: { _count: { col: 'desc' } }, take: N })` → Drizzle `db.select({ col: table.col, cnt: count() }).from(table).groupBy(table.col).orderBy(desc(count())).limit(N)`
- Prisma `{ not: null }` filter → Drizzle `isNotNull(table.column)`
- JS-side aggregation (reduce) is kept identical — no need to push aggregation to DB when the original code did it client-side
- `sql` import not needed if all queries use Drizzle's built-in operators (`eq`, `gte`, `count`, `isNotNull`, etc.) — remove unused imports to pass ESLint
