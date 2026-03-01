# Plan 1 — Remove Turborepo, Migrate to Pure pnpm Workspaces

## TL;DR

> **Quick Summary**: Remove the `turbo` dev dependency and `turbo.json` configuration file, replacing all root `turbo run X` scripts with native `pnpm` workspace commands, and scrubbing every remaining `.turbo` reference from app clean scripts, `.gitignore`, and docs.
>
> **Deliverables**:
>
> - Updated `package.json` (root) — no turbo, pnpm-native scripts
> - Deleted `turbo.json`
> - Updated `.gitignore` (`.turbo` line removed)
> - Updated clean scripts in 4 app `package.json` files
> - Updated 4 doc file locations across `docs/`
> - Verified working build pipeline (`build`, `typecheck`, `lint`, `dev`)
>
> **Estimated Effort**: Short
> **Parallel Execution**: NO — tasks are sequential (each cleanly scoped to separate files)
> **Critical Path**: T1 (remove dep) → T2 (rewrite scripts) → T3 (app clean scripts) → T4 (gitignore) → T5 (docs) → T6 (verify)

---

## Context

### Original Request

Remove Turborepo from the monorepo and replace all `turbo run X` orchestration with native `pnpm` workspace commands, without breaking the build pipeline or `rag-service`.

### Research Findings

**Workspace apps** (5 total):

- `apps/admin` — Next.js, port 3001
- `apps/public` — Next.js, port 3000
- `apps/links` — Next.js, port 3002
- `apps/ngl` — Next.js, port 3003
- `apps/rag-service` — Python FastAPI (has a `package.json` but is NOT a JS app; must be excluded from JS pipelines with `--filter=!rag-service` or explicit filters)

**All turbo references (complete map)**:

| Location                              | Reference                          | Action                     |
| ------------------------------------- | ---------------------------------- | -------------------------- |
| `package.json` (root)                 | `turbo run X` in 7 scripts         | Replace with pnpm commands |
| `package.json` (root)                 | `"turbo": "latest"` in devDeps     | Remove                     |
| `turbo.json` (root)                   | Entire file                        | Delete                     |
| `.gitignore` line 7                   | `.turbo`                           | Remove line                |
| `apps/admin/package.json` clean       | `rm -rf .next .turbo node_modules` | Remove `.turbo`            |
| `apps/links/package.json` clean       | `rm -rf .next .turbo node_modules` | Remove `.turbo`            |
| `apps/ngl/package.json` clean         | `rm -rf .next .turbo node_modules` | Remove `.turbo`            |
| `apps/rag-service/package.json` clean | `rm -rf dist .turbo node_modules`  | Remove `.turbo`            |
| `docs/DEPLOYMENT.md` line 1090        | `rm -rf .turbo`                    | Remove from snippet        |
| `docs/SETUP.md` line 531              | `rm -rf .turbo`                    | Remove from snippet        |
| `docs/TROUBLESHOOTING.md` line 142    | `rm -rf .turbo`                    | Remove from snippet        |
| `docs/TROUBLESHOOTING.md` line 940    | `rm -rf .turbo`                    | Remove from snippet        |

**`apps/public`** has NO `clean` script — leave it alone.

**Replacement script strategy**:

- `build` → `pnpm -r --filter=!rag-service run build` (recursive, exclude rag-service)
- `dev` → `pnpm -r --parallel --filter=!rag-service run dev` (parallel, exclude rag-service)
- `start` → `pnpm -r --parallel --filter=!rag-service run start`
- `typecheck` → `pnpm -r --filter=!rag-service run typecheck`
- `test` → `pnpm -r run test`
- `clean` → `pnpm -r run clean && rm -rf node_modules && rm -rf .turbo`
- `prepare` → `husky` (unchanged)

### Metis Review (from prior session)

Gaps addressed:

- rag-service exclusion explicitly handled via `--filter=!rag-service`
- No source code changes, only config/scripts/docs
- `apps/public` has no `clean` script — skip it (confirmed)

---

## Work Objectives

### Core Objective

Remove the Turborepo dependency and all `.turbo` artifacts from the monorepo, migrating task orchestration to native pnpm workspace commands, without changing any application source code or breaking build/dev pipelines.

### Concrete Deliverables

- `package.json` (root): `turbo` removed from devDeps; all 7 scripts rewritten
- `turbo.json`: deleted
- `.gitignore`: `.turbo` line removed
- `apps/admin/package.json`: clean script updated
- `apps/links/package.json`: clean script updated
- `apps/ngl/package.json`: clean script updated
- `apps/rag-service/package.json`: clean script updated
- `docs/DEPLOYMENT.md`: `.turbo` reference removed
- `docs/SETUP.md`: `.turbo` reference removed
- `docs/TROUBLESHOOTING.md`: both `.turbo` references removed

### Definition of Done

- [ ] `grep -r "turbo" . --include="*.json" --include="*.md" --include=".gitignore" --exclude-dir=node_modules --exclude-dir=.git` returns zero results
- [ ] `pnpm install` exits 0
- [ ] `pnpm build` exits 0
- [ ] `pnpm typecheck` exits 0
- [ ] `pnpm lint` exits 0

### Must Have

- All 12 turbo references removed
- `pnpm install` regenerates lockfile without turbo
- Build, typecheck, lint pipelines work with new scripts

### Must NOT Have (Guardrails)

- NO changes to any application source code (`.ts`, `.tsx`, `.py` files)
- NO changes to `apps/public/package.json` (it has no `clean` script — do not add one)
- NO removal of rag-service from the workspace entirely
- NO turbo references remaining in any tracked file after completion
- NO new dependencies added

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed.

### Test Decision

- **Infrastructure exists**: YES (pnpm scripts)
- **Automated tests**: None needed — this is pure config/script changes
- **Agent-Executed QA**: bash commands verify every file change and pipeline

### QA Policy

All verification via `Bash` — grep for absence of references, run pnpm commands, check exit codes.

---

## Execution Strategy

### Sequential Execution (no parallelism needed — all tasks are independent file edits)

```
Task 1: Remove turbo from root package.json + delete turbo.json
Task 2: Rewrite root package.json scripts
Task 3: Update app clean scripts (admin, links, ngl, rag-service)
Task 4: Update .gitignore
Task 5: Update docs (DEPLOYMENT.md, SETUP.md, TROUBLESHOOTING.md)
Task 6: Verify full pipeline

Critical Path: T1 → T2 → T3 → T4 → T5 → T6
```

---

## TODOs

[x] 1. Remove `turbo` from root `package.json` devDependencies and delete `turbo.json`

**What to do**:

- Open `package.json` (root). In `devDependencies`, delete the line `"turbo": "latest"`.
- Delete the file `turbo.json` from the repo root.
- Run `pnpm install` to regenerate `pnpm-lock.yaml` without turbo.

**Must NOT do**:

- Do NOT touch any scripts section yet (that's Task 2)
- Do NOT remove any other devDependencies
- Do NOT modify any app-level files

**Recommended Agent Profile**:

- **Category**: `quick`
  - Reason: Simple file edit + delete + pnpm install. Single concern.
- **Skills**: none

**Parallelization**:

- **Can Run In Parallel**: NO
- **Parallel Group**: Sequential — Task 1 of 6
- **Blocks**: Task 2 (scripts must reference a non-turbo lockfile)
- **Blocked By**: None (start immediately)

**References**:

- `package.json` (root) line 29: `"turbo": "latest"` — the exact line to delete
- `turbo.json` (root) — the file to delete entirely

**Acceptance Criteria**:

- [ ] `cat package.json | grep turbo` returns zero results
- [ ] `ls turbo.json` returns "No such file or directory"
- [ ] `pnpm install` exits 0
- [ ] `grep "turbo" pnpm-lock.yaml` returns zero results

**QA Scenarios**:

```
Scenario: turbo removed from devDependencies and lockfile
  Tool: Bash
  Preconditions: package.json exists at repo root
  Steps:
    1. grep -c "turbo" package.json  → expected: 0
    2. ls turbo.json 2>&1           → expected: "ls: cannot access 'turbo.json'"
    3. grep -c "turbo" pnpm-lock.yaml → expected: 0
  Expected Result: All three commands confirm turbo is gone
  Evidence: .sisyphus/evidence/task-1-turbo-removed.txt

Scenario: pnpm install succeeds after removal
  Tool: Bash
  Preconditions: Task 1 edits complete
  Steps:
    1. pnpm install --frozen-lockfile=false  → expected: exit 0
    2. echo $?  → expected: 0
  Expected Result: exit code 0, no turbo-related install errors
  Evidence: .sisyphus/evidence/task-1-install-ok.txt
```

**Evidence to Capture**:

- [ ] `task-1-turbo-removed.txt` — grep output confirming zero matches
- [ ] `task-1-install-ok.txt` — pnpm install output

**Commit**: NO (groups with Task 2 into single commit at end)

---

[x] 2. Rewrite all root `package.json` scripts to use native `pnpm` commands

**What to do**:

- Open `package.json` (root). Replace the entire `scripts` block with:
  ```json
  "scripts": {
    "build": "pnpm -r --filter=!rag-service run build",
    "dev": "pnpm -r --parallel --filter=!rag-service run dev",
    "start": "pnpm -r --parallel --filter=!rag-service run start",
    "typecheck": "pnpm -r --filter=!rag-service run typecheck",
    "test": "pnpm -r run test",
    "clean": "pnpm -r run clean && rm -rf node_modules && rm -rf .turbo",
    "prepare": "husky"
  }
  ```
- Explanation of flags:
  - `-r` = recursive across all workspace packages
  - `--filter=!rag-service` = exclude rag-service (Python app, not JS)
  - `--parallel` = run dev servers concurrently (like turbo's persistent tasks)

**Must NOT do**:

- Do NOT change `prepare` (must stay `husky`)
- Do NOT add `--filter=!rag-service` to `test` or `clean` (those are safe to run on all)
- Do NOT add extra scripts not listed above

**Recommended Agent Profile**:

- **Category**: `quick`
  - Reason: Surgical JSON edit to a single file, no logic decisions.
- **Skills**: none

**Parallelization**:

- **Can Run In Parallel**: NO
- **Parallel Group**: Sequential — Task 2 of 6
- **Blocks**: Task 6 (verification runs new scripts)
- **Blocked By**: Task 1 (turbo must be uninstalled first)

**References**:

- `package.json` (root) lines 9–16: current `scripts` block using `turbo run X`
- pnpm docs: `--filter=!<name>` excludes a workspace package by name

**Acceptance Criteria**:

- [ ] `grep "turbo run" package.json` returns zero results
- [ ] `grep "pnpm -r" package.json` returns 5+ results (build/dev/start/typecheck/test/clean)
- [ ] `jq .scripts package.json` parses without error

**QA Scenarios**:

```
Scenario: Scripts rewritten, no turbo run references remain
  Tool: Bash
  Preconditions: package.json is the root package.json
  Steps:
    1. grep -c "turbo run" package.json  → expected: 0
    2. grep -c "pnpm -r" package.json    → expected: ≥5
    3. python3 -c "import json; json.load(open('package.json'))" → expected: exit 0 (valid JSON)
  Expected Result: No turbo references, valid JSON, pnpm commands present
  Evidence: .sisyphus/evidence/task-2-scripts-rewritten.txt

Scenario: filter correctly excludes rag-service
  Tool: Bash
  Preconditions: Scripts rewritten
  Steps:
    1. grep "filter=!rag-service" package.json → expected: 4 matches (build/dev/start/typecheck)
    2. grep '"test"' package.json | grep -v filter → expected: test has no filter (runs everywhere)
  Expected Result: rag-service excluded from JS-only pipelines, included in test/clean
  Evidence: .sisyphus/evidence/task-2-filter-check.txt
```

**Evidence to Capture**:

- [ ] `task-2-scripts-rewritten.txt`
- [ ] `task-2-filter-check.txt`

**Commit**: NO (all tasks committed together at end)

---

[x] 3. Update `clean` scripts in 4 app `package.json` files (remove `.turbo`)

**What to do**:

- In each of the following files, edit the `clean` script to remove `.turbo` from the `rm -rf` call:
  - `apps/admin/package.json`: `"clean": "rm -rf .next .turbo node_modules"` → `"clean": "rm -rf .next node_modules"`
  - `apps/links/package.json`: `"clean": "rm -rf .next .turbo node_modules"` → `"clean": "rm -rf .next node_modules"`
  - `apps/ngl/package.json`: `"clean": "rm -rf .next .turbo node_modules"` → `"clean": "rm -rf .next node_modules"`
  - `apps/rag-service/package.json`: `"clean": "rm -rf dist .turbo node_modules"` → `"clean": "rm -rf dist node_modules"`

**Must NOT do**:

- Do NOT touch `apps/public/package.json` — it has NO `clean` script (confirmed)
- Do NOT add a `clean` script to `apps/public/package.json`
- Do NOT modify any other key in these files

**Recommended Agent Profile**:

- **Category**: `quick`
  - Reason: Four surgical string replacements in four files, zero logic.
- **Skills**: none

**Parallelization**:

- **Can Run In Parallel**: NO
- **Parallel Group**: Sequential — Task 3 of 6
- **Blocks**: Task 6 (verify pipeline)
- **Blocked By**: None (can run concurrently with T2, but sequential is fine)

**References**:

- `apps/admin/package.json` — `scripts.clean` key
- `apps/links/package.json` — `scripts.clean` key
- `apps/ngl/package.json` — `scripts.clean` key
- `apps/rag-service/package.json` — `scripts.clean` key

**Acceptance Criteria**:

- [ ] `grep ".turbo" apps/admin/package.json` → zero results
- [ ] `grep ".turbo" apps/links/package.json` → zero results
- [ ] `grep ".turbo" apps/ngl/package.json` → zero results
- [ ] `grep ".turbo" apps/rag-service/package.json` → zero results
- [ ] `cat apps/public/package.json | grep clean` → zero results (untouched, no clean script)

**QA Scenarios**:

```
Scenario: .turbo removed from all four app clean scripts
  Tool: Bash
  Preconditions: App package.json files exist
  Steps:
    1. grep -c ".turbo" apps/admin/package.json      → expected: 0
    2. grep -c ".turbo" apps/links/package.json      → expected: 0
    3. grep -c ".turbo" apps/ngl/package.json        → expected: 0
    4. grep -c ".turbo" apps/rag-service/package.json → expected: 0
  Expected Result: Zero .turbo references in all four files
  Evidence: .sisyphus/evidence/task-3-app-clean-scripts.txt

Scenario: apps/public/package.json untouched (no clean script added)
  Tool: Bash
  Preconditions: Task 3 edits complete
  Steps:
    1. grep -c "clean" apps/public/package.json → expected: 0
  Expected Result: public app still has no clean script
  Evidence: .sisyphus/evidence/task-3-public-untouched.txt
```

**Evidence to Capture**:

- [ ] `task-3-app-clean-scripts.txt`
- [ ] `task-3-public-untouched.txt`

**Commit**: NO (groups with final commit)

---

[x] 4. Remove `.turbo` from `.gitignore`

**What to do**:

- Open `.gitignore` at the repo root.
- Delete **line 7**: `.turbo`
- Save the file. Do not reorder or change any other lines.

**Must NOT do**:

- Do NOT remove any other lines from `.gitignore`
- Do NOT add any new entries

**Recommended Agent Profile**:

- **Category**: `quick`
  - Reason: Single-line deletion in a text file.
- **Skills**: none

**Parallelization**:

- **Can Run In Parallel**: YES (independent of T2/T3)
- **Parallel Group**: Can run alongside T3
- **Blocks**: Task 6 (verification)
- **Blocked By**: None

**References**:

- `.gitignore` line 7: `.turbo` — the exact line to remove

**Acceptance Criteria**:

- [ ] `grep ".turbo" .gitignore` → zero results
- [ ] `.gitignore` still contains all other original entries (e.g., `node_modules`, `.env`, `.next`)

**QA Scenarios**:

```
Scenario: .turbo removed from .gitignore, file otherwise intact
  Tool: Bash
  Preconditions: .gitignore exists at repo root
  Steps:
    1. grep -c ".turbo" .gitignore      → expected: 0
    2. grep -c "node_modules" .gitignore → expected: ≥1 (file not corrupted)
    3. grep -c ".env" .gitignore         → expected: ≥1
  Expected Result: .turbo gone, other entries preserved
  Evidence: .sisyphus/evidence/task-4-gitignore.txt
```

**Evidence to Capture**:

- [ ] `task-4-gitignore.txt`

**Commit**: NO (groups with final commit)

---

[x] 5. Remove `.turbo` references from documentation files

**What to do**:

- In each file below, find the specific line containing `rm -rf .turbo` (as part of a cleanup command snippet) and remove `.turbo` from that command:

| File                      | Line | Current text                           | New text                    |
| ------------------------- | ---- | -------------------------------------- | --------------------------- |
| `docs/DEPLOYMENT.md`      | 1090 | `rm -rf .turbo` (standalone or inline) | Remove the `.turbo` portion |
| `docs/SETUP.md`           | 531  | `rm -rf .turbo` (standalone or inline) | Remove the `.turbo` portion |
| `docs/TROUBLESHOOTING.md` | 142  | `rm -rf .turbo` (standalone or inline) | Remove the `.turbo` portion |
| `docs/TROUBLESHOOTING.md` | 940  | `rm -rf .turbo` (standalone or inline) | Remove the `.turbo` portion |

- Strategy: Read 5 lines of context around each line number, then edit surgically. Do not alter surrounding prose.

**Must NOT do**:

- Do NOT rewrite doc sections — only remove the `.turbo` string/line
- Do NOT change any other content in these files

**Recommended Agent Profile**:

- **Category**: `quick`
  - Reason: Four targeted string removals in doc files, no logic.
- **Skills**: none

**Parallelization**:

- **Can Run In Parallel**: YES (independent of T3/T4)
- **Parallel Group**: Can run alongside T3 and T4
- **Blocks**: Task 6 (verification)
- **Blocked By**: None

**References**:

- `docs/DEPLOYMENT.md:1090` — `.turbo` in cleanup snippet
- `docs/SETUP.md:531` — `.turbo` in cleanup snippet
- `docs/TROUBLESHOOTING.md:142` — `.turbo` in cleanup snippet
- `docs/TROUBLESHOOTING.md:940` — `.turbo` in cleanup snippet

**Acceptance Criteria**:

- [ ] `grep -n "turbo" docs/DEPLOYMENT.md` → zero results
- [ ] `grep -n "turbo" docs/SETUP.md` → zero results
- [ ] `grep -n "turbo" docs/TROUBLESHOOTING.md` → zero results

**QA Scenarios**:

```
Scenario: All .turbo references removed from docs
  Tool: Bash
  Preconditions: docs/ directory exists
  Steps:
    1. grep -rc "turbo" docs/ → expected: 0 matches in all files
  Expected Result: Zero turbo references across all doc files
  Evidence: .sisyphus/evidence/task-5-docs-clean.txt

Scenario: Surrounding doc content is intact (not accidentally deleted)
  Tool: Bash
  Preconditions: Task 5 edits complete
  Steps:
    1. wc -l docs/DEPLOYMENT.md   → expected: within ±5 lines of original count
    2. wc -l docs/SETUP.md        → expected: within ±5 lines of original count
    3. wc -l docs/TROUBLESHOOTING.md → expected: within ±5 lines of original count
  Expected Result: Files not truncated or corrupted
  Evidence: .sisyphus/evidence/task-5-docs-line-counts.txt
```

**Evidence to Capture**:

- [ ] `task-5-docs-clean.txt`
- [ ] `task-5-docs-line-counts.txt`

**Commit**: NO (groups with final commit)

---

- [x] 6. Verify full pipeline and commit all changes

  **What to do**:
  - Run the full verification suite to confirm nothing is broken:
    1. `grep -r "turbo" . --include="*.json" --include="*.md" --include=".gitignore" --exclude-dir=node_modules --exclude-dir=.git` → must return 0 lines
    2. `pnpm install` → must exit 0
    3. `pnpm build` → must exit 0 (all apps build successfully)
    4. `pnpm typecheck` → must exit 0
    5. `pnpm lint` → must exit 0
  - If all pass, create the final commit:
    ```
    git add -A
    git commit -m "chore(infra): remove Turborepo, migrate to native pnpm workspace scripts"
    ```

  **Must NOT do**:
  - Do NOT commit if any verification step fails — fix the failure first
  - Do NOT squash or amend prior commits
  - Do NOT push to remote (user pushes separately)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Runs multi-step bash pipeline, interprets output, conditionally commits. Needs judgment.
  - **Skills**: [`git-master`]
    - `git-master`: Needed for correct atomic commit with pre-commit hook awareness.

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential — must run after T1–T5 all complete
  - **Blocks**: F1, F2, F3 (final verification wave)
  - **Blocked By**: T1, T2, T3, T4, T5

  **References**:
  - Root `package.json` — new scripts to verify (`build`, `typecheck`, `lint`)
  - `.sisyphus/plans/plan-1-remove-turborepo.md` — Definition of Done checklist

  **Acceptance Criteria**:
  - [ ] `grep -r "turbo" . --include="*.json" --include="*.md" --include=".gitignore" --exclude-dir=node_modules --exclude-dir=.git` → 0 lines
  - [ ] `pnpm install` → exit 0
  - [ ] `pnpm build` → exit 0
  - [ ] `pnpm typecheck` → exit 0
  - [ ] `pnpm lint` → exit 0
  - [ ] `git log --oneline -1` shows commit with message `chore(infra): remove Turborepo, migrate to native pnpm workspace scripts`

  **QA Scenarios**:

  ```
  Scenario: Zero turbo references remain in tracked files
    Tool: Bash
    Preconditions: All prior tasks complete
    Steps:
      1. grep -r "turbo" . --include="*.json" --include="*.md" --include=".gitignore" --exclude-dir=node_modules --exclude-dir=.git
         → expected: zero output lines
    Expected Result: Clean codebase with no turbo references
    Evidence: .sisyphus/evidence/task-6-final-grep.txt

  Scenario: Full build pipeline succeeds with new pnpm scripts
    Tool: Bash
    Preconditions: pnpm install completed
    Steps:
      1. pnpm build      → expected: exit 0, all apps emit success
      2. pnpm typecheck  → expected: exit 0, no type errors
      3. pnpm lint       → expected: exit 0, no lint errors
    Expected Result: All three commands exit 0
    Evidence: .sisyphus/evidence/task-6-pipeline-ok.txt

  Scenario: rag-service is excluded from build/typecheck (not broken by pnpm -r)
    Tool: Bash
    Preconditions: build pipeline ran
    Steps:
      1. pnpm -r --filter=!rag-service run build 2>&1 | grep -i "rag-service" → expected: no lines (excluded)
    Expected Result: rag-service not invoked in JS build pipeline
    Evidence: .sisyphus/evidence/task-6-ragservice-excluded.txt
  ```

  **Evidence to Capture**:
  - [ ] `task-6-final-grep.txt`
  - [ ] `task-6-pipeline-ok.txt`
  - [ ] `task-6-ragservice-excluded.txt`

  **Commit**: YES
  - Message: `chore(infra): remove Turborepo, migrate to native pnpm workspace scripts`
  - Files: `package.json`, `turbo.json` (deleted), `.gitignore`, `apps/admin/package.json`, `apps/links/package.json`, `apps/ngl/package.json`, `apps/rag-service/package.json`, `docs/DEPLOYMENT.md`, `docs/SETUP.md`, `docs/TROUBLESHOOTING.md`
  - Pre-commit: `pnpm build && pnpm typecheck && pnpm lint`

---

## Final Verification Wave

- [x] F1. **Plan Compliance Audit** — `oracle`
      Read plan end-to-end. For each "Must Have": grep codebase to confirm turbo is gone (`grep -r "turbo" . --include="*.json" --include=".gitignore" --exclude-dir=node_modules --exclude-dir=.git`). For each "Must NOT Have": confirm no source files changed via `git diff --name-only`. Check all evidence files in `.sisyphus/evidence/`.
      Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [x] F2. **Code Quality Review** — `unspecified-high`
      Run `pnpm install` + `pnpm build` + `pnpm typecheck` + `pnpm lint`. Confirm all exit 0. Verify `pnpm-lock.yaml` no longer references turbo. Confirm no `.turbo` directories remain: `find . -name ".turbo" -type d --exclude-dir=node_modules`.
      Output: `Install [PASS/FAIL] | Build [PASS/FAIL] | Typecheck [PASS/FAIL] | Lint [PASS/FAIL] | VERDICT`

- [x] F3. **Scope Fidelity Check** — `deep`
      Run `git diff --name-only` and verify ONLY the expected files were modified. Confirm zero source files (`.ts`, `.tsx`, `.py`) were changed. Confirm `apps/public/package.json` was not touched.
      Output: `Files changed [N] | Source files [CLEAN/N modified] | VERDICT`

---

## Commit Strategy

- **Single commit** after all tasks: `chore(infra): remove Turborepo, migrate to native pnpm workspace scripts`
  Files: `package.json`, `turbo.json` (deleted), `.gitignore`, `apps/*/package.json`, `docs/**/*.md`
  Pre-commit: `pnpm build && pnpm typecheck && pnpm lint`

---

## Success Criteria

### Verification Commands

```bash
grep -r "turbo" . --include="*.json" --include="*.md" --include=".gitignore" --exclude-dir=node_modules --exclude-dir=.git  # Expected: zero results
pnpm install   # Expected: exit 0
pnpm build     # Expected: exit 0
pnpm typecheck # Expected: exit 0
pnpm lint      # Expected: exit 0
```

### Final Checklist

- [ ] Zero turbo references in tracked files
- [ ] `pnpm install` succeeds (lockfile regenerated)
- [ ] `pnpm build` succeeds
- [ ] `pnpm typecheck` succeeds
- [ ] `pnpm lint` succeeds
- [ ] No application source files modified
