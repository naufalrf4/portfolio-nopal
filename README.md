# NaufalRF Portfolio Ecosystem

A production-grade, multi-application portfolio platform built with Next.js, demonstrating end-to-end solution engineering through real, interconnected systems.

## Overview

The NaufalRF Portfolio Ecosystem is a monorepo containing five interconnected applications that work together to create a comprehensive portfolio experience. Rather than presenting a static list of projects, this ecosystem enables deep exploration through structured narratives, interactive engagement channels, and a conversational AI interface.

### Applications

| Application            | Domain                | Purpose                                                  |
| ---------------------- | --------------------- | -------------------------------------------------------- |
| **Public Portfolio**   | `naufalrf.tech`       | Main portfolio showcasing projects, blogs, and guestbook |
| **Admin Dashboard**    | `admin.naufalrf.tech` | Content management system and API gateway                |
| **Links Hub**          | `links.naufalrf.tech` | Linktree-style profile links page                        |
| **Anonymous Feedback** | `ngl.naufalrf.tech`   | Anonymous message submission channel                     |
| **RAG Chatbot**        | `rag.naufalrf.tech`   | AI-powered conversational exploration                    |

### Key Features

- **Structured Project Narratives**: Projects presented through context sections (Context, Role, Decisions, Trade-offs, Result, Architecture)
- **Centralized Content Authority**: Single PostgreSQL database accessed exclusively through Admin API
- **Interactive Engagement**: Guestbook with Google OAuth, anonymous feedback, and AI chatbot
- **AI-Powered Exploration**: RAG chatbot with retrieval-augmented generation and session memory
- **Production-Grade Infrastructure**: Docker deployment with Traefik reverse proxy and TLS

## Architecture

### System Design

```
┌─────────────────────────────────────────────────────────────┐
│                     PUBLIC INTERNET                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  TRAEFIK (TLS + Routing)                     │
└─────────────────────────────────────────────────────────────┘
         │              │              │              │
         ▼              ▼              ▼              ▼
    ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
    │ Public  │   │  Admin  │   │   NGL   │   │  Links  │
    │  :3000  │   │  :3001  │   │  :3003  │   │  :3002  │
    └─────────┘   └─────────┘   └─────────┘   └─────────┘
         │              │              │              │
         └──────────────┼──────────────┴──────────────┘
                        │
                        ▼
                 ┌─────────────┐
                 │  PostgreSQL │
                 │   (Neon)    │
                 └─────────────┘
```

### Data Flow Rules

1. Only Admin app has direct database access
2. Public, Links, and NGL apps consume data through Admin API
3. RAG Service calls Admin API for content and uses Qdrant for vectors
4. All external traffic terminates TLS at Traefik

### Technology Stack

- **Frontend**: Next.js 14+ (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js (RAG Service)
- **Database**: PostgreSQL (Neon), Prisma ORM
- **Authentication**: NextAuth.js with Google OAuth
- **Vector Store**: Qdrant (for RAG embeddings)
- **Deployment**: Docker, Docker Compose, Traefik
- **Monorepo**: Turborepo with pnpm workspaces

## Quick Start

### Prerequisites

- Node.js >= 22.0.0
- pnpm >= 8.0.0
- Docker and Docker Compose (for local development)
- PostgreSQL database (Neon recommended)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/naufalrf-portfolio.git
cd naufalrf-portfolio
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

Copy the example environment files and fill in your values:

```bash
# Root environment
cp .env.example .env

# Admin app
cp apps/admin/.env.example apps/admin/.env.local

# Public app
cp apps/public/.env.example apps/public/.env

# Links app
cp apps/links/.env.example apps/links/.env

# NGL app
cp apps/ngl/.env.example apps/ngl/.env

# RAG service
cp apps/rag-service/.env.example apps/rag-service/.env
```

4. **Set up the database**

```bash
# Run migrations
pnpm --filter admin db:migrate

# Seed initial data (optional)
pnpm --filter admin db:seed
```

5. **Start development servers**

```bash
# Start all apps in parallel
pnpm dev

# Or start specific apps
pnpm --filter admin dev
pnpm --filter public dev
pnpm --filter links dev
pnpm --filter ngl dev
```

6. **Access the applications**

- Public Portfolio: http://localhost:3000
- Admin Dashboard: http://localhost:3001
- Links Hub: http://localhost:3002
- NGL App: http://localhost:3003

## Development

### Project Structure

```
naufalrf-portfolio/
├── apps/                          # Application packages
│   ├── admin/                     # Admin dashboard + API
│   ├── public/                    # Public portfolio
│   ├── links/                     # Links hub
│   ├── ngl/                       # Anonymous feedback
│   └── rag-service/               # RAG chatbot service
├── packages/                      # Shared packages
│   ├── ui/                        # Shared UI components
│   ├── types/                     # TypeScript types
│   ├── sdk/                       # API clients
│   ├── config/                    # Shared configs
│   └── auth/                      # NextAuth config
├── .context/                      # AI context files
├── docs/                          # Documentation
├── scripts/                       # Build/deploy scripts
└── docker-compose.yml             # Dev environment
```

### Available Commands

```bash
# Development
pnpm dev              # Start all apps in development
pnpm build            # Build all apps and packages
pnpm typecheck        # TypeScript type checking
pnpm lint             # Lint all apps and packages
pnpm test             # Run all tests
pnpm clean            # Remove build artifacts

# App-specific commands
pnpm --filter <app-name> dev          # Run specific app
pnpm --filter <app-name> build        # Build specific app
pnpm --filter <app-name> lint         # Lint specific app
pnpm --filter <app-name> test         # Test specific app

# Database commands (Admin app)
pnpm --filter admin db:migrate   # Run Prisma migrations
pnpm --filter admin db:push      # Push schema changes (dev only)
pnpm --filter admin db:studio    # Open Prisma Studio
pnpm --filter admin db:generate  # Generate Prisma client
pnpm --filter admin db:seed      # Seed database
```

### Feature-Based Architecture

Each Next.js app follows a feature-based architecture pattern:

```
apps/[app-name]/
├── app/                           # Next.js App Router
│   ├── (public)/                  # Public routes
│   ├── (dashboard)/               # Protected routes
│   ├── api/                       # API routes
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Root page
├── src/
│   ├── features/                  # Feature modules
│   │   ├── [feature-name]/
│   │   │   ├── components/        # Feature components
│   │   │   ├── hooks/             # Feature hooks
│   │   │   ├── services/          # API calls & logic
│   │   │   ├── types/             # Feature types
│   │   │   └── index.ts           # Feature exports
│   ├── components/                # Shared components
│   │   ├── ui/                    # Base UI components
│   │   ├── layout/                # Layout components
│   │   └── common/                # Common components
│   ├── lib/                       # Utilities & config
│   │   ├── utils/                 # Utility functions
│   │   ├── constants/             # Constants
│   │   └── api/                   # API client
│   ├── hooks/                     # Shared hooks
│   ├── providers/                 # Context providers
│   └── types/                     # Shared types
└── public/                        # Static assets
```

### Coding Conventions

- **Naming**: camelCase for variables/functions, PascalCase for components/types, SCREAMING_SNAKE_CASE for constants
- **Components**: Server Components by default, use `'use client'` only when needed
- **Imports**: React/Next.js → Third-party → Absolute → Relative → Types → CSS
- **No Comments**: Write self-documenting code with clear naming
- **Business Logic**: Keep logic in services, not components
- **One Service Per File**: Each service class in its own file

See [AGENTS.md](./AGENTS.md) for complete coding guidelines.

## Deployment

The ecosystem supports multiple deployment platforms:

- **Heroku**: Platform-as-a-Service deployment
- **Google Cloud App Engine**: Managed app platform
- **AWS ECS (Fargate)**: Containerized deployment
- **AWS Elastic Beanstalk**: Managed platform
- **VPS (Docker Compose)**: Self-hosted deployment

For detailed deployment instructions, see [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md).

### Quick Deploy (VPS with Docker Compose)

1. **Set up environment variables**

```bash
cp .env.production.example .env.production
# Edit .env.production with your values
```

2. **Build and start services**

```bash
docker-compose --env-file .env.production up -d
```

3. **Run database migrations**

```bash
docker exec -it portfolio-admin sh
cd apps/admin && pnpm db:migrate
exit
```

4. **Configure reverse proxy**

Set up Nginx or Traefik to route traffic to the appropriate containers.

### Environment Variables

#### Required for Admin App

```bash
DATABASE_URL=postgresql://user:password@host:5432/database
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=https://admin.yourdomain.com
ADMIN_EMAILS=admin@example.com
ADMIN_SERVICE_TOKEN=<generate with: openssl rand -hex 32>
R2_ENDPOINT=https://[account-id].r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_BUCKET_NAME=your_bucket
R2_PUBLIC_URL=https://pub-[hash].r2.dev/your_bucket
```

#### Required for Public App

```bash
NEXT_PUBLIC_ADMIN_API_URL=https://admin.yourdomain.com/api
NEXTAUTH_SECRET=<same as admin app>
NEXTAUTH_URL=https://yourdomain.com
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAA_your_site_key
```

See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for complete environment variable documentation.

## API Documentation

### Public API Endpoints

All public endpoints are read-only and do not require authentication:

```bash
# About information
GET /api/v1/public/about

# Projects
GET /api/v1/public/projects
GET /api/v1/public/projects/:slug

# Blog links
GET /api/v1/public/blogs

# Guestbook entries
GET /api/v1/public/guestbook

# Profile links
GET /api/v1/public/profile-links
```

### Public Write Endpoints

These endpoints are rate-limited and may require authentication:

```bash
# Submit guestbook entry (requires Google OAuth)
POST /api/v1/public-write/guestbook

# Submit anonymous message (rate-limited by IP)
POST /api/v1/public-write/messages

# Submit contact form (rate-limited by IP)
POST /api/v1/public-write/contact
```

### Admin API Endpoints

Admin endpoints require Google OAuth authentication with allowlisted email:

```bash
# Projects CRUD
GET    /api/v1/admin/projects
POST   /api/v1/admin/projects
GET    /api/v1/admin/projects/:id
PUT    /api/v1/admin/projects/:id
DELETE /api/v1/admin/projects/:id

# Project contexts
GET    /api/v1/admin/projects/:id/contexts
POST   /api/v1/admin/projects/:id/contexts
PUT    /api/v1/admin/contexts/:id
DELETE /api/v1/admin/contexts/:id

# Blog links, guestbook, messages, etc.
# Similar CRUD patterns for all resources
```

## Contributing

### Git Workflow

1. **Start a new task**

```bash
git checkout main && git pull origin main
git checkout -b feature/XX-short-description
```

2. **Make changes and commit**

```bash
git add .
git commit -m "feat(scope): description"
```

Commit format: `<type>(<scope>): <description>`

- **Types**: feat, fix, docs, style, refactor, perf, test, build, ci, chore
- **Scopes**: public, admin, links, ngl, rag, ui, types, sdk, auth, infra, deps

3. **Push and create PR**

```bash
git push -u origin feature/XX-description
```

4. **CI checks required**

- `pnpm lint` (no errors)
- `pnpm typecheck` (no errors)
- `pnpm test` (all passing)
- `pnpm build` (successful)

5. **Merge and cleanup**

Use "Squash and merge" on GitHub, then delete the branch.

### Development Guidelines

- Follow the coding conventions in [AGENTS.md](./AGENTS.md)
- Write self-documenting code (no comments)
- Keep business logic in services, not components
- Use Server Components by default
- Write tests for new features
- Update documentation as needed

## Testing

```bash
# Run all tests
pnpm test

# Run tests for specific app
pnpm --filter admin test
pnpm --filter public test

# Run tests in watch mode (development)
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm vitest run path/to/test/file.test.ts
```

## Troubleshooting

### Common Issues

**Build failures**

```bash
# Clear caches and reinstall
pnpm clean
rm -rf node_modules
pnpm install
```

**Database connection issues**

```bash
# Test database connection
psql "postgresql://user:password@host:5432/database?sslmode=require"

# Check migration status
pnpm --filter admin prisma migrate status
```

**Authentication issues**

- Verify NEXTAUTH_SECRET is identical across public and admin apps
- Check NEXTAUTH_URL matches actual domain (no trailing slash)
- Verify Google OAuth redirect URIs in Google Cloud Console

For comprehensive troubleshooting guides, see [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md).

## Documentation

### Getting Started

- [Setup Guide](./docs/SETUP.md) - Development environment setup and installation
- [Development Workflow](./docs/DEVELOPMENT.md) - Git workflow, coding standards, and best practices
- [Coding Guidelines](./AGENTS.md) - Detailed coding conventions and agent instructions

### Architecture & Design

- [System Architecture](./docs/ARCHITECTURE.md) - System design, component relationships, and data flows
- [Database Schema](./docs/DATABASE.md) - Database models, relationships, and migrations
- [Applications Overview](./docs/APPS.md) - Detailed documentation for each application

### API & Integration

- [API Documentation](./docs/API.md) - Complete API reference with examples
- [API Audit Results](./docs/api-audit-results.md) - Security audit and endpoint verification

### Deployment & Operations

- [Deployment Guide](./docs/DEPLOYMENT.md) - Multi-platform deployment instructions
- [Troubleshooting](./docs/TROUBLESHOOTING.md) - Common issues and solutions

## License

This project is proprietary and confidential. All rights reserved.

## Contact

For questions or inquiries, visit [naufalrf.tech](https://naufalrf.tech) or reach out through the contact form.
