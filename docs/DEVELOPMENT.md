# Development Workflow and Guidelines

This document outlines the development workflow, coding standards, and best practices for contributing to the NaufalRF Portfolio Ecosystem.

## Table of Contents

- [Development Workflow](#development-workflow)
- [Git Workflow](#git-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Code Review Process](#code-review-process)
- [Release Process](#release-process)

## Development Workflow

### Daily Development Cycle

1. **Start Your Day**

   ```bash
   # Pull latest changes
   git checkout main
   git pull origin main

   # Start development servers
   pnpm dev
   ```

2. **Create Feature Branch**

   ```bash
   git checkout -b feature/XX-short-description
   ```

3. **Make Changes**
   - Write code following coding standards
   - Test your changes locally
   - Write tests for new features

4. **Run Quality Checks**

   ```bash
   # Lint code
   pnpm lint

   # Type check
   pnpm typecheck

   # Run tests
   pnpm test

   # Build to verify
   pnpm build
   ```

5. **Commit Changes**

   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

6. **Push and Create PR**
   ```bash
   git push -u origin feature/XX-description
   ```

### Development Commands

```bash
# Start all apps
pnpm dev

# Start specific app
pnpm --filter admin dev
pnpm --filter public dev
pnpm --filter links dev
pnpm --filter ngl dev

# Build all apps
pnpm build

# Build specific app
pnpm --filter admin build

# Run linting
pnpm lint

# Fix linting issues
pnpm lint --fix

# Type checking
pnpm typecheck

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Clean build artifacts
pnpm clean

# Database commands (admin app)
pnpm --filter admin db:migrate
pnpm --filter admin db:push
pnpm --filter admin db:studio
pnpm --filter admin db:seed
```

## Git Workflow

### Branch Naming Convention

Use descriptive branch names with the following prefixes:

| Prefix      | Purpose                 | Example                     |
| ----------- | ----------------------- | --------------------------- |
| `feature/`  | New features            | `feature/42-add-guestbook`  |
| `fix/`      | Bug fixes               | `fix/23-auth-redirect`      |
| `chore/`    | Maintenance tasks       | `chore/update-dependencies` |
| `docs/`     | Documentation           | `docs/api-documentation`    |
| `refactor/` | Code refactoring        | `refactor/project-service`  |
| `test/`     | Test additions          | `test/guestbook-component`  |
| `hotfix/`   | Urgent production fixes | `hotfix/security-patch`     |

### Commit Message Format

Follow the Conventional Commits specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test additions or modifications
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Maintenance tasks

**Scopes:**

- `public`: Public portfolio app
- `admin`: Admin dashboard app
- `links`: Links hub app
- `ngl`: Anonymous feedback app
- `rag`: RAG service
- `ui`: UI package
- `types`: Types package
- `sdk`: SDK package
- `auth`: Auth package
- `infra`: Infrastructure
- `deps`: Dependencies

**Examples:**

```bash
feat(admin): add project CRUD API endpoints
fix(public): resolve guestbook authentication bug
docs(readme): update setup instructions
chore(deps): upgrade Next.js to 14.2
refactor(admin): extract project service logic
test(public): add guestbook component tests
```

### Pull Request Process

1. **Create Pull Request**
   - Use descriptive title
   - Fill out PR template
   - Link related issues
   - Add labels

2. **PR Requirements**
   - All CI checks must pass
   - At least 1 approval required
   - No merge conflicts
   - Up-to-date with main branch

3. **CI Checks**
   - ✅ Linting passes
   - ✅ Type checking passes
   - ✅ Tests pass
   - ✅ Build succeeds

4. **Merge Strategy**
   - Use "Squash and merge"
   - Delete branch after merge
   - Update related issues

### Hotfix Procedure

For urgent production fixes:

```bash
# Create hotfix branch from main
git checkout main
git checkout -b hotfix/XX-description

# Make fix and test thoroughly
# ...

# Commit and push
git add .
git commit -m "fix(scope): urgent fix description"
git push -u origin hotfix/XX-description

# Create PR with "hotfix" label
# Get expedited review
# Deploy immediately after merge
```

## Coding Standards

### General Principles

1. **Write Self-Documenting Code**
   - Use descriptive variable and function names
   - No comments (code should be clear enough)
   - Extract complex logic into named functions

2. **Keep It Simple**
   - Prefer simple solutions over clever ones
   - Avoid premature optimization
   - Write code for humans first

3. **Separation of Concerns**
   - Components render UI only
   - Hooks manage state and effects
   - Services handle business logic
   - Utils contain pure functions

### Naming Conventions

```typescript
// Variables and functions: camelCase
const userData = getUserData();
function fetchProjects() {}

// Constants: SCREAMING_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRIES = 3;

// Types and interfaces: PascalCase
interface User {}
type ProjectDTO = {};

// Components: PascalCase
function ProjectCard() {}
const HeroSection = () => {};

// Files: Match content naming
// - Components: PascalCase (ProjectCard.tsx)
// - Utilities: camelCase (formatDate.ts)
// - Hooks: camelCase (useProjects.ts)

// Boolean variables: Prefix with is, has, should, can
const isLoading = true;
const hasError = false;
const shouldRender = true;
const canEdit = false;
```

### TypeScript Guidelines

```typescript
// Use interface for object shapes
interface User {
  id: string;
  name: string;
  email: string;
}

// Use type for unions and intersections
type Status = 'idle' | 'loading' | 'success' | 'error';
type UserWithRole = User & { role: string };

// Prefer type inference
const count = 0; // inferred as number
const items = []; // inferred as never[], be explicit: string[]

// Be explicit for useState generics
const [user, setUser] = useState<User | null>(null);

// Use null and undefined explicitly
function getUser(id: string): User | null {}
function getOptionalValue(): string | undefined {}

// No implicit any
// ❌ Bad
function process(data) {}

// ✅ Good
function process(data: unknown) {}
```

### React Component Patterns

```typescript
// Server Component (default)
// app/projects/page.tsx
import { projectsService } from '@/lib/services/projects';
import { ProjectList } from '@/features/projects/components/ProjectList';

export default async function ProjectsPage() {
  const projects = await projectsService.getAll();
  return <ProjectList projects={projects} />;
}

// Client Component (when needed)
// features/projects/components/ProjectList.tsx
'use client';

import { useState } from 'react';
import type { Project } from '@/types';

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
  const [filter, setFilter] = useState('');
  const filtered = projects.filter(p => p.title.includes(filter));

  return (
    <div>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      {filtered.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

### Import Order

```typescript
// 1. React and Next.js
import { useState, useEffect } from 'react';
import Link from 'next/link';

// 2. Third-party libraries
import { z } from 'zod';
import { format } from 'date-fns';

// 3. Absolute imports (@/...)
import { Button } from '@/components/ui/Button';
import { useProjects } from '@/features/projects/hooks/useProjects';

// 4. Relative imports
import { ProjectCard } from './ProjectCard';
import { formatDate } from '../utils/formatDate';

// 5. Type imports
import type { Project } from '@/types';
import type { FC } from 'react';

// 6. CSS imports
import './styles.css';
```

### Service Layer Pattern

```typescript
// features/projects/services/projects.service.ts
import { apiClient } from '@/lib/api/client';
import type { Project, CreateProjectDTO } from '@/types';

export class ProjectsService {
  async getAll(): Promise<Project[]> {
    const response = await apiClient.get('/projects');
    return response.data;
  }

  async getBySlug(slug: string): Promise<Project> {
    const response = await apiClient.get(`/projects/${slug}`);
    return response.data;
  }

  async create(data: CreateProjectDTO): Promise<Project> {
    const response = await apiClient.post('/projects', data);
    return response.data;
  }

  async update(id: string, data: Partial<CreateProjectDTO>): Promise<Project> {
    const response = await apiClient.put(`/projects/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/projects/${id}`);
  }
}

export const projectsService = new ProjectsService();
```

### Error Handling

```typescript
// Always wrap async operations in try-catch
async function fetchData() {
  try {
    const data = await apiClient.get('/data');
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      // Handle API errors
      console.error('API Error:', error.message);
    } else {
      // Handle unexpected errors
      console.error('Unexpected error:', error);
    }
    throw error;
  } finally {
    // Cleanup
    setLoading(false);
  }
}

// Use typed error classes
class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Handle AbortError in effects
useEffect(() => {
  const controller = new AbortController();

  async function fetchData() {
    try {
      const data = await fetch('/api/data', {
        signal: controller.signal,
      });
      setData(data);
    } catch (error) {
      if (error.name === 'AbortError') {
        // Request was cancelled, ignore
        return;
      }
      setError(error);
    }
  }

  fetchData();

  return () => controller.abort();
}, []);
```

## Testing Guidelines

### Test Structure

```typescript
// Component test
import { render, screen } from '@testing-library/react';
import { ProjectCard } from './ProjectCard';

describe('ProjectCard', () => {
  it('renders project title', () => {
    const project = {
      id: '1',
      title: 'Test Project',
      slug: 'test-project',
      summary: 'Test summary',
    };

    render(<ProjectCard project={project} />);

    expect(screen.getByText('Test Project')).toBeInTheDocument();
  });

  it('renders project summary', () => {
    // ...
  });
});

// Service test
import { projectsService } from './projects.service';
import { apiClient } from '@/lib/api/client';

jest.mock('@/lib/api/client');

describe('ProjectsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches all projects', async () => {
    const mockProjects = [{ id: '1', title: 'Test' }];
    (apiClient.get as jest.Mock).mockResolvedValue({ data: mockProjects });

    const projects = await projectsService.getAll();

    expect(apiClient.get).toHaveBeenCalledWith('/projects');
    expect(projects).toEqual(mockProjects);
  });
});
```

### Test Coverage

Aim for:

- 80%+ code coverage
- 100% coverage for critical paths
- All edge cases tested
- Error scenarios tested

### Testing Best Practices

1. **Test Behavior, Not Implementation**

   ```typescript
   // ❌ Bad - testing implementation
   expect(component.state.count).toBe(1);

   // ✅ Good - testing behavior
   expect(screen.getByText('Count: 1')).toBeInTheDocument();
   ```

2. **Use Descriptive Test Names**

   ```typescript
   // ❌ Bad
   it('works', () => {});

   // ✅ Good
   it('displays error message when API call fails', () => {});
   ```

3. **Arrange-Act-Assert Pattern**

   ```typescript
   it('increments counter when button is clicked', () => {
     // Arrange
     render(<Counter />);
     const button = screen.getByRole('button', { name: /increment/i });

     // Act
     fireEvent.click(button);

     // Assert
     expect(screen.getByText('Count: 1')).toBeInTheDocument();
   });
   ```

## Code Review Process

### Reviewer Checklist

- [ ] Code follows project conventions
- [ ] Tests are included and passing
- [ ] No unnecessary complexity
- [ ] Error handling is appropriate
- [ ] Performance considerations addressed
- [ ] Security best practices followed
- [ ] Documentation updated if needed
- [ ] No hardcoded values or secrets
- [ ] Accessibility considerations addressed

### Review Guidelines

1. **Be Constructive**
   - Focus on the code, not the person
   - Explain why, not just what
   - Suggest alternatives
   - Acknowledge good work

2. **Be Timely**
   - Review within 24 hours
   - Prioritize hotfixes
   - Don't block unnecessarily

3. **Be Thorough**
   - Test the changes locally
   - Check edge cases
   - Verify tests are meaningful
   - Look for potential issues

### Responding to Reviews

1. **Be Open**
   - Consider feedback objectively
   - Ask questions if unclear
   - Explain your reasoning

2. **Be Responsive**
   - Address all comments
   - Make requested changes
   - Re-request review when ready

3. **Be Professional**
   - Thank reviewers
   - Don't take feedback personally
   - Learn from suggestions

## Release Process

### Version Numbering

Follow Semantic Versioning (SemVer):

```
MAJOR.MINOR.PATCH

1.0.0 → 1.0.1 (patch: bug fixes)
1.0.1 → 1.1.0 (minor: new features, backward compatible)
1.1.0 → 2.0.0 (major: breaking changes)
```

### Release Checklist

- [ ] All tests passing
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json
- [ ] Git tag created
- [ ] Deployment successful
- [ ] Smoke tests passed
- [ ] Stakeholders notified

### Deployment Process

1. **Staging Deployment**

   ```bash
   # Deploy to staging
   git checkout main
   git pull origin main
   ./scripts/deploy-staging.sh

   # Run smoke tests
   pnpm test:e2e --env=staging
   ```

2. **Production Deployment**

   ```bash
   # Create release tag
   git tag -a v1.0.0 -m "Release v1.0.0"
   git push origin v1.0.0

   # Deploy to production
   ./scripts/deploy-production.sh

   # Monitor deployment
   ./scripts/monitor-deployment.sh
   ```

3. **Post-Deployment**
   - Monitor error rates
   - Check performance metrics
   - Verify critical features
   - Update status page

### Rollback Procedure

If issues are detected:

```bash
# Rollback to previous version
./scripts/rollback.sh v0.9.9

# Or rollback database migration
pnpm --filter admin prisma migrate resolve --rolled-back <migration-name>
```

## Best Practices

### Performance

- Use Server Components by default
- Implement proper caching strategies
- Optimize images with Next.js Image
- Lazy load components when appropriate
- Monitor bundle sizes

### Security

- Never commit secrets
- Validate all user input
- Use parameterized queries
- Implement rate limiting
- Keep dependencies updated

### Accessibility

- Use semantic HTML
- Include ARIA labels
- Ensure keyboard navigation
- Test with screen readers
- Maintain color contrast

### SEO

- Use Next.js Metadata API
- Include structured data
- Optimize page titles and descriptions
- Implement proper heading hierarchy
- Generate sitemaps

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Testing Library](https://testing-library.com/docs/)
- [Conventional Commits](https://www.conventionalcommits.org/)

## Getting Help

- Check existing documentation
- Search GitHub issues
- Ask in team chat
- Create a new issue with details
- Schedule a pair programming session
