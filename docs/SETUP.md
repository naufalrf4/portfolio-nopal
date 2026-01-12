# Development Environment Setup

This guide walks you through setting up the NaufalRF Portfolio Ecosystem for local development.

## Prerequisites

### Required Software

| Software       | Minimum Version | Purpose                                  |
| -------------- | --------------- | ---------------------------------------- |
| Node.js        | 22.0.0          | JavaScript runtime                       |
| pnpm           | 8.0.0           | Package manager                          |
| Git            | 2.30.0          | Version control                          |
| Docker         | 20.10.0         | Containerization (optional)              |
| Docker Compose | 2.0.0           | Multi-container orchestration (optional) |

### Optional Software

- **PostgreSQL** (14+): If not using Docker or Neon
- **VS Code**: Recommended IDE with extensions
- **Postman/Insomnia**: API testing

### System Requirements

- **OS**: macOS, Linux, or Windows (with WSL2)
- **RAM**: 8GB minimum, 16GB recommended
- **Disk Space**: 5GB free space

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/naufalrf-portfolio.git
cd naufalrf-portfolio
```

### 2. Install Dependencies

```bash
# Install pnpm globally if not already installed
npm install -g pnpm

# Install all dependencies
pnpm install
```

This will install dependencies for all apps and packages in the monorepo.

### 3. Set Up Environment Variables

#### Root Environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio?schema=public"
DIRECT_URL="postgresql://user:password@localhost:5432/portfolio?schema=public"

# NextAuth
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3001"

# Google OAuth
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

#### Admin App Environment

```bash
cp apps/admin/.env.example apps/admin/.env.local
```

Edit `apps/admin/.env.local`:

```bash
# Database (same as root)
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio?schema=public"
DIRECT_URL="postgresql://user:password@localhost:5432/portfolio?schema=public"

# NextAuth (same as root)
NEXTAUTH_SECRET="same-as-root"
NEXTAUTH_URL="http://localhost:3001"
GOOGLE_CLIENT_ID="same-as-root"
GOOGLE_CLIENT_SECRET="same-as-root"

# Admin Configuration
ADMIN_EMAILS="your-email@gmail.com"
ADMIN_SERVICE_TOKEN="generate-with-openssl-rand-hex-32"

# Cloudflare R2 (optional for file uploads)
R2_ENDPOINT="https://[account-id].r2.cloudflarestorage.com"
R2_ACCESS_KEY_ID="your-r2-access-key"
R2_SECRET_ACCESS_KEY="your-r2-secret-key"
R2_BUCKET_NAME="your-bucket"
R2_PUBLIC_URL="https://pub-[hash].r2.dev/your-bucket"
```

#### Public App Environment

```bash
cp apps/public/.env.example apps/public/.env
```

Edit `apps/public/.env`:

```bash
# Admin API
NEXT_PUBLIC_ADMIN_API_URL="http://localhost:3001/api"

# NextAuth
NEXTAUTH_SECRET="same-as-admin"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="same-as-admin"
GOOGLE_CLIENT_SECRET="same-as-admin"

# Cloudflare Turnstile (optional)
NEXT_PUBLIC_TURNSTILE_SITE_KEY="0x4AAAAAAA_your_site_key"
TURNSTILE_SECRET_KEY="0x4AAAAAAA_your_secret_key"
```

#### Links App Environment

```bash
cp apps/links/.env.example apps/links/.env
```

Edit `apps/links/.env`:

```bash
NEXT_PUBLIC_ADMIN_API_URL="http://localhost:3001/api"
```

#### NGL App Environment

```bash
cp apps/ngl/.env.example apps/ngl/.env
```

Edit `apps/ngl/.env`:

```bash
NEXT_PUBLIC_ADMIN_API_URL="http://localhost:3001/api"
```

#### RAG Service Environment

```bash
cp apps/rag-service/.env.example apps/rag-service/.env
```

Edit `apps/rag-service/.env`:

```bash
# Admin API
ADMIN_API_URL="http://localhost:3001/api"
ADMIN_SERVICE_TOKEN="same-as-admin"

# LLM Configuration
PRIMARY_LLM="gemini"
FALLBACK_LLM="groq"

# API Keys (at least one required)
OPENAI_API_KEY="sk-..."
GEMINI_API_KEY="..."
GROQ_API_KEY="gsk_..."
DEEPSEEK_API_KEY="..."

# Qdrant
QDRANT_URL="http://localhost:6333"
QDRANT_API_KEY="" # Optional for local development
```

### 4. Set Up Database

#### Option A: Using Neon (Recommended)

1. Create a free account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Update `DATABASE_URL` and `DIRECT_URL` in your `.env` files

#### Option B: Using Docker

```bash
# Start PostgreSQL container
docker run -d \
  --name portfolio-postgres \
  -e POSTGRES_USER=portfolio \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=portfolio \
  -p 5432:5432 \
  postgres:14-alpine

# Update DATABASE_URL in .env files
DATABASE_URL="postgresql://portfolio:password@localhost:5432/portfolio?schema=public"
```

#### Option C: Local PostgreSQL Installation

Install PostgreSQL 14+ on your system and create a database:

```bash
# macOS with Homebrew
brew install postgresql@14
brew services start postgresql@14

# Create database
createdb portfolio

# Update DATABASE_URL in .env files
DATABASE_URL="postgresql://localhost:5432/portfolio?schema=public"
```

### 5. Run Database Migrations

```bash
# Navigate to admin app
cd apps/admin

# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed initial data (optional)
pnpm db:seed

# Return to root
cd ../..
```

### 6. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (Public app)
   - `http://localhost:3001/api/auth/callback/google` (Admin app)
7. Copy Client ID and Client Secret to your `.env` files

### 7. Generate Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate ADMIN_SERVICE_TOKEN
openssl rand -hex 32
```

Update your `.env` files with these values.

### 8. Verify Installation

```bash
# Check Node.js version
node --version  # Should be >= 22.0.0

# Check pnpm version
pnpm --version  # Should be >= 8.0.0

# Check if all dependencies are installed
pnpm list --depth=0

# Run type checking
pnpm typecheck

# Run linting
pnpm lint
```

## Starting Development Servers

### Start All Apps

```bash
# From root directory
pnpm dev
```

This starts all applications in parallel:

- Public Portfolio: http://localhost:3000
- Admin Dashboard: http://localhost:3001
- Links Hub: http://localhost:3002
- NGL App: http://localhost:3003
- RAG Service: http://localhost:3004 (if configured)

### Start Individual Apps

```bash
# Admin app only
pnpm --filter admin dev

# Public app only
pnpm --filter public dev

# Links app only
pnpm --filter links dev

# NGL app only
pnpm --filter ngl dev

# RAG service only
pnpm --filter rag-service dev
```

### Start with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## IDE Setup

### VS Code (Recommended)

#### Recommended Extensions

Install these extensions for the best development experience:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-vscode.vscode-typescript-next",
    "usernamehw.errorlens",
    "christian-kohler.path-intellisense",
    "formulahendry.auto-rename-tag"
  ]
}
```

#### Workspace Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

#### Debug Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "pnpm --filter admin dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3001"
    }
  ]
}
```

## Database Management

### Prisma Studio

Open Prisma Studio to view and edit database records:

```bash
pnpm --filter admin db:studio
```

Access at: http://localhost:5555

### Common Database Commands

```bash
# Generate Prisma client after schema changes
pnpm --filter admin db:generate

# Create a new migration
pnpm --filter admin db:migrate

# Push schema changes without migration (dev only)
pnpm --filter admin db:push

# Reset database (WARNING: deletes all data)
pnpm --filter admin db:reset

# Seed database with initial data
pnpm --filter admin db:seed

# View migration status
pnpm --filter admin prisma migrate status
```

### Database Backup

```bash
# Backup database
pg_dump -h localhost -U portfolio -d portfolio > backup.sql

# Restore database
psql -h localhost -U portfolio -d portfolio < backup.sql
```

## Testing Setup

### Run Tests

```bash
# Run all tests
pnpm test

# Run tests for specific app
pnpm --filter admin test
pnpm --filter public test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### Test Configuration

Tests are configured with Vitest. Configuration files:

- `vitest.config.ts` - Root configuration
- `apps/*/vitest.config.ts` - App-specific configuration

## Troubleshooting

### Port Already in Use

If you get "port already in use" errors:

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different ports
PORT=3010 pnpm --filter admin dev
```

### Database Connection Issues

```bash
# Test database connection
psql "postgresql://user:password@localhost:5432/portfolio"

# Check if PostgreSQL is running
pg_isready -h localhost -p 5432

# View Prisma connection logs
DEBUG="prisma:*" pnpm --filter admin dev
```

### Module Not Found Errors

```bash
# Clear all caches and reinstall
pnpm clean
rm -rf node_modules
pnpm install

# Regenerate Prisma client
pnpm --filter admin db:generate
```

### TypeScript Errors

```bash
# Check TypeScript version
pnpm list typescript

# Run type checking
pnpm typecheck

# Restart TypeScript server in VS Code
# Command Palette → "TypeScript: Restart TS Server"
```

### Build Failures

```bash
# Clear Turbo cache
rm -rf .turbo

# Clear Next.js cache
rm -rf apps/*/.next

# Rebuild everything
pnpm clean
pnpm install
pnpm build
```

### Google OAuth Issues

Common issues:

- Redirect URI mismatch: Ensure URIs in Google Console match exactly
- Invalid client: Check Client ID and Secret are correct
- NEXTAUTH_SECRET missing: Generate and add to .env files
- NEXTAUTH_URL incorrect: Should match your domain (no trailing slash)

### Environment Variable Issues

```bash
# Verify environment variables are loaded
pnpm --filter admin dev

# Check for .env file
ls -la apps/admin/.env.local

# Ensure NEXTAUTH_SECRET is identical across apps
grep NEXTAUTH_SECRET .env apps/admin/.env.local apps/public/.env
```

## Next Steps

After completing the setup:

1. **Explore the Admin Dashboard**: http://localhost:3001
   - Sign in with your Google account (must be in ADMIN_EMAILS)
   - Create your first project
   - Add blog links
   - Configure settings

2. **View the Public Portfolio**: http://localhost:3000
   - See your projects displayed
   - Test the guestbook (requires Google sign-in)
   - Try the contact form

3. **Check the Links Hub**: http://localhost:3002
   - Add profile links in admin dashboard
   - View them on the links page

4. **Test Anonymous Feedback**: http://localhost:3003
   - Submit an anonymous message
   - View it in admin dashboard

5. **Read the Documentation**:
   - [Architecture](./ARCHITECTURE.md) - System design
   - [Development Guidelines](../AGENTS.md) - Coding conventions
   - [API Documentation](./API.md) - API endpoints

## Development Workflow

### Daily Workflow

```bash
# 1. Pull latest changes
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/your-feature

# 3. Start development servers
pnpm dev

# 4. Make changes and test
# ... code ...

# 5. Run checks before committing
pnpm lint
pnpm typecheck
pnpm test

# 6. Commit and push
git add .
git commit -m "feat(scope): description"
git push -u origin feature/your-feature

# 7. Create pull request on GitHub
```

### Code Quality Checks

```bash
# Run all checks
pnpm lint && pnpm typecheck && pnpm test && pnpm build

# Fix linting issues automatically
pnpm lint --fix

# Format code with Prettier
pnpm format
```

## Additional Resources

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Getting Help

If you encounter issues not covered in this guide:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review the [AGENTS.md](../AGENTS.md) file for coding guidelines
3. Check existing GitHub issues
4. Create a new issue with detailed information
