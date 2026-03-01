# Issues: plan-0-drizzle-migration

This file captures problems, gotchas, and blockers encountered.

## [2026-02-22T12:33:12Z] Session Start

- No issues yet

## [2026-02-22T12:40:00Z] pnpm install failure

- `pnpm install` failed because `apps/admin` depends on workspace package `@repo/logger`, but no such package exists in the workspace. Install cannot finish until the missing workspace package is added or the dependency removed.
