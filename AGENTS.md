# AGENTS.md

This file provides guidelines for AI coding agents operating in this repository.

## Quick Commands

### Monorepo Management
```bash
pnpm install          # Install dependencies
pnpm dev              # Start all apps in development (parallel)
pnpm build            # Build all apps and packages
pnpm lint             # Lint all apps and packages
pnpm typecheck        # TypeScript type checking across monorepo
pnpm clean            # Remove all build artifacts and node_modules
```

### App-Specific Commands
```bash
pnpm --filter <app-name> dev          # Run specific app
pnpm --filter <app-name> build        # Build specific app
pnpm --filter <app-name> lint         # Lint specific app
pnpm --filter <app-name> test         # Test specific app
```

### Database Commands (Admin App)
```bash
pnpm --filter admin db:migrate   # Run Prisma migrations
pnpm --filter admin db:push      # Push schema changes (dev only)
pnpm --filter admin db:studio    # Open Prisma Studio
pnpm --filter admin db:generate  # Generate Prisma client
pnpm --filter admin db:seed      # Seed database
```

### Testing
```bash
pnpm test              # Run all tests
pnpm test:unit         # Unit and component tests only
pnpm test:integration  # Integration tests only
pnpm test:e2e          # E2E tests only
pnpm test:coverage     # Run tests with coverage report
pnpm test:watch        # Run tests in watch mode (dev)

# Single test file
pnpm vitest run path/to/test/file.test.ts
pnpm vitest run --testNamePattern "test name" path/to/test/file.test.ts
```

---

## Code Style Guidelines

### Imports Order
1. React and Next.js imports
2. Third-party library imports
3. Absolute imports (`@/...`)
4. Relative imports (`../`, `./`)
5. Type imports (`import type { ... }`)
6. CSS imports

### Naming Conventions
- **Variables/Functions**: `camelCase` (`userData`, `fetchProjects`)
- **Constants**: `SCREAMING_SNAKE_CASE` (`API_BASE_URL`, `MAX_RETRIES`)
- **Types/Interfaces**: `PascalCase` (`User`, `ProjectDTO`, `ButtonProps`)
- **Component Files**: `PascalCase` (`ProjectCard.tsx`)
- **Utility Files**: `camelCase` (`formatDate.ts`)
- **Hook Files**: `useHookName.ts`
- **Boolean Variables**: Prefix with `is`, `has`, `should`, `can`

### TypeScript Rules
- Use `interface` for props and object shapes; `type` for unions/intersections
- Enable strict mode; no implicit `any`
- Use `null` and `undefined` explicitly
- Prefer type inference; be explicit for `useState` generics

### Component Patterns

#### Server vs Client Components
- **Server Components** by default (no `'use client'`)
- Use `'use client'` only for: event handlers, `useState`, `useEffect`, browser APIs
- Pass client components as children to server components
- Props: interface for type definition, use `React.ReactNode` for children

#### File-Based Component Separation
```
app/
├── page.tsx                    # Server Component (default)
├── layout.tsx                  # Server Component
├── loading.tsx                 # Server Component
├── error.tsx                   # Server Component
└── feature-name/
    ├── page.tsx                # Server Component - data fetching
    └── components/
        ├── ClientComponent.tsx   # 'use client' - interactivity
        └── ServerComponent.tsx   # Server - renders data
```

#### Component File Location
```
features/feature-name/
├── components/              # UI components
│   ├── ClientComponent.tsx  # 'use client' directive
│   ├── ServerComponent.tsx  # Server Component (default)
│   └── index.ts             # Barrel export
└── hooks/                   # Custom hooks (all 'use client')
```

#### Separation Rules
| What | Server Component | Client Component |
|------|-----------------|------------------|
| Data fetching | ✅ Yes | ❌ No (delegate) |
| Event handlers | ❌ No | ✅ Yes |
| useState/useEffect | ❌ No | ✅ Yes |
| Browser APIs | ❌ No | ✅ Yes |
| Render received data | ✅ Yes | ✅ Yes |

**Example Pattern:**
```typescript
// features/projects/page.tsx (Server Component)
import { projectsService } from '@/lib/services/projects';
import { ProjectList } from './components/ProjectList';

export default async function ProjectsPage() {
  const projects = await projectsService.getAll();
  return <ProjectList projects={projects} />;  // Pass data, no logic
}

// features/projects/components/ProjectList.tsx (Client Component)
'use client';
import { useState } from 'react';
import type { Project } from '@/types';

interface ProjectListProps {
  projects: Project[];  // Received from server
}

export function ProjectList({ projects }: ProjectListProps) {
  const [filter, setFilter] = useState('');  // Client logic only
  const filtered = projects.filter(p => p.title.includes(filter));
  return <div>{/* render */}</div>;
}
```

### Metadata and SEO
- Use Next.js Metadata API for all pages
- Define metadata objects in `layout.tsx` and `page.tsx`
- Use `generateMetadata` for dynamic metadata (projects, blogs)
- Include title, description, open graph, twitter cards, canonical URLs
- Add JSON-LD structured data for Person, WebSite, Article schemas

```typescript
// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'NaufalRF | Full-Stack Engineer',
    template: '%s | NaufalRF',
  },
  description: 'Portfolio of NaufalRF - Full-Stack Engineer specializing in scalable web applications',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://naufalrf.tech',
    siteName: 'NaufalRF Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@naufalrf',
  },
};

// app/projects/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Explore my portfolio of web applications, mobile apps, and backend systems',
};

export default function ProjectsPage() {
  // ...
}

// app/projects/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject(params.slug);
  if (!project) return {};
  
  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      type: 'article',
      images: project.imageUrl ? [project.imageUrl] : [],
    },
  };
}
```

### Business Logic Separation
**CRITICAL: No business logic in components. Components render only.**

```
features/feature-name/
├── components/   # UI components (render only, no logic)
├── hooks/        # Custom hooks (state, effects, callbacks)
├── services/     # ONE FILE PER SERVICE (API calls, business logic)
├── shared/       # Shared utilities, constants across features
├── types/        # Feature-specific types
├── utils/        # Pure functions (no side effects)
└── validation/   # Zod schemas
```

#### Layer Hierarchy (Top = High Level)
1. **components/** - Render only, delegate to hooks/services
2. **hooks/** - State management, event handlers, call services
3. **services/** - API calls, data transformation, business rules
4. **shared/** - Cross-feature constants, helpers
5. **utils/** - Pure functions, helpers
6. **types/** - TypeScript definitions
7. **validation/** - Zod schemas

#### Services Rule: ONE FILE PER SERVICE
```typescript
// ✅ CORRECT - one service per file
lib/services/projects.ts          // ProjectService
lib/services/blogs.ts             // BlogService
lib/services/guestbook.ts         // GuestbookService

// ❌ WRONG - multiple services in one file
lib/services/all.ts               // DON'T DO THIS
```

Each service class handles one entity/domain:
- `ProjectsService` - CRUD for projects
- `ProjectContextsService` - CRUD for project contexts
- `BlogLinksService` - CRUD for blog links
- `GuestbookService` - CRUD for guestbook entries
- `MessagesService` - CRUD for anonymous messages
- `ProfileLinksService` - CRUD for profile links
- `KnowledgeDocsService` - CRUD for knowledge documents
- `ChatLogsService` - CRUD for chat logs

### Shared Utilities (features/*/shared/)
Cross-feature shared code lives in each feature's `shared/` directory:
- `constants/` - Feature-specific constants
- `utils/` - Feature-specific pure functions
- `config/` - Feature-specific configurations

```typescript
// features/projects/shared/constants/categories.ts
export const PROJECT_CATEGORIES = ['web', 'mobile', 'backend', 'devops'] as const;

// features/projects/shared/utils/sort.ts
export function sortByDate<T extends { createdAt: Date }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
```

### No Comments Rule
**NO CODE COMMENTS ALLOWED.** Write self-documenting code.

```typescript
// ❌ WRONG - unnecessary comment
// This function validates email
function validateEmail(email: string): boolean { ... }

// ❌ WRONG - explaining what code does
const items = data.filter(item => item.active); // Get only active items

// ✅ CORRECT - clear naming, no comments needed
function isValidEmail(email: string): boolean { ... }
const activeItems = data.filter(isItemActive);
```

If code needs explanation, refactor:
- Use descriptive variable/function names
- Extract complex logic into named functions
- Split large functions into smaller ones

### Form Handling
- Use `react-hook-form` + `zod` resolver
- Define Zod schemas in `lib/validation/`
- Handle loading and error states explicitly

### Error Handling
- Always wrap async operations in `try/catch`
- Use typed error classes
- Reset state in `finally` blocks
- Handle `AbortError` in effects with AbortController

---

## Git Workflow (Per Task)

### 1. Start a New Task
```bash
# Ensure main is up to date
git checkout main && git pull origin main

# Create feature/fix branch from main
git checkout -b feature/XX-short-description   # for features
git checkout -b fix/XX-short-description       # for bug fixes
git checkout -b chore/XX-description           # for maintenance
```

**Branch Naming:** `type/issue-number-short-description` (e.g., `feature/42-add-guestbook`)

### 2. Make Changes
```bash
# Work on your branch
git add .
git commit -m "feat(scope): description"   # Follow commit format below
```

### 3. Commit Format
```
<type>(<scope>): <description>

Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore
Scope: public, admin, links, ngl, rag, ui, types, sdk, auth, infra, deps

Examples:
feat(admin): add project CRUD API endpoints
fix(public): resolve guestbook authentication bug
chore(deps): upgrade Next.js to 14.2
docs(readme): update setup instructions
```

### 4. Push and Create PR
```bash
# Push branch to remote
git push -u origin feature/XX-description

# Create PR via GitHub UI with:
# - Title: Clear description
# - Body: What changed and why
# - Linked issue: If applicable
```

### 5. CI Checks Required
Before merge, ensure all pass:
- [ ] `pnpm lint` (no errors)
- [ ] `pnpm typecheck` (no errors)
- [ ] `pnpm test` (all passing)
- [ ] `pnpm build` (successful)

### 6. Merge and Cleanup
```bash
# After PR approval and CI green:
# Use GitHub "Squash and merge" button

# Delete branch locally and remotely
git checkout main && git pull main
git branch -d feature/XX-description       # local
git push origin --delete feature/XX-description  # remote
```

### 7. Hotfix Procedure (Urgent Fixes)
```bash
git checkout main
git checkout -b hotfix/XX-description
# Make fix, commit, push, PR to main
# Deploy immediately after merge
# Delete branch after deployment
```

### Merge Rules
- All PRs require CI green (lint, typecheck, test, build)
- Squash and merge to main (one commit per PR)
- Delete branch after merge
- At least 1 approval required
- No direct pushes to main

---

## Key Architecture References

| Context File | Purpose |
|-------------|---------|
| `.context/base/architecture.md` | System components, data flows, boundaries |
| `.context/base/directory-structure.yaml` | Feature-based architecture structure |
| `.context/implementation/coding-conventions.yaml` | Detailed coding patterns |
| `.context/implementation/design-system.yaml` | Neuromorphic + shadcn/ui design system |
| `.context/implementation/database-schema.yaml` | Prisma models and relationships |
| `.context/implementation/api-structure.yaml` | API endpoints and middleware |
| `.context/implementation/seo-strategy.yaml` | Metadata and structured data |

---

## Environment Setup

Required `.env.local` files:
- Root: `DATABASE_URL`, `DIRECT_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `apps/admin/.env.local`: `ADMIN_EMAILS`
- `apps/rag-service/.env.local`: `OPENAI_API_KEY`, `GEMINI_API_KEY`, `GROQ_API_KEY`, `DEEPSEEK_API_KEY`, `PRIMARY_LLM`, `FALLBACK_LLM`, `ADMIN_SERVICE_TOKEN`

---

## Important Notes

- Database access only via `apps/admin`; all other apps use Admin API
- RAG Service (`apps/rag-service`) is a Node.js/Fastify app, not Next.js
- Shared packages in `packages/` (`ui`, `types`, `sdk`, `config`, `auth`)
- Use `packages/sdk` for typed API clients
- Use `packages/ui` for shadcn/ui components with neuromorphism modifications
- All public write endpoints are rate-limited
- Internal APIs require `X-Service-Token` header

---

## Agent Instructions

### Before Starting Any Task
1. **Read Task Description**: Always read the full task including all subtasks
2. **Read Context Files**: Read relevant context files from `.context/` directory:
   - `.context/base/` for architecture and requirements
   - `.context/implementation/` for patterns and conventions
3. **Read AGENTS.md**: Review this file for project-specific rules
4. **Read TASKS.md**: Check existing task status and dependencies
5. **Read PROGRESS.md**: Read existing progress to understand what's done

### During Task Execution
- Follow all conventions in this AGENTS.md
- Reference context files for patterns
- Ask for clarification if task is unclear
- Work on one subtask at a time

### After Completing a Task
1. **Write PROGRESS.md**: Document completed work in `TASKS/PROGRESS.md`:
   ```markdown
   ## Task: [Task Name]
   - **Status**: Completed
   - **Date**: YYYY-MM-DD
   - **Completed By**: [Agent/User]
   
   ### Subtasks Completed
   - [x] Subtask 1
   - [x] Subtask 2
   
   ### Notes
   - Any relevant notes about the implementation
   - Decisions made during execution
   - Files created/modified
   ```
2. **Update TASKS.md**: Mark task and subtasks as completed
3. **Commit Changes**: Follow Git workflow for the changes
