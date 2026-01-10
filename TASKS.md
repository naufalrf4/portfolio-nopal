# Project Tasks

## Status Legend

- `[ ]` = Pending
- `[~]` = In Progress
- `[x]` = Completed

---

## Phase 0: Foundation

### Task 0.1: Monorepo Initialization

- [x] Initialize Turborepo with pnpm workspace
- [x] Configure root `package.json` with workspace scripts
- [x] Create `pnpm-workspace.yaml`
- [x] Create `turbo.json` with pipeline configuration

### Task 0.2: Shared Config Package

- [x] Create `packages/config` package
- [x] Setup ESLint configuration
- [x] Setup TypeScript base configuration
- [x] Setup Tailwind configuration
- [ ] Setup Prettier configuration (skipped - using .prettierrc at root)

### Task 0.3: Shared Types Package

- [x] Create `packages/types` package
- [x] Define base DTO interfaces
- [x] Define API response types
- [x] Define enum definitions

### Task 0.4: Git Configuration

- [x] Setup Husky pre-commit hooks
- [x] Configure lint-staged
- [x] Setup commitlint with conventional commits
- [x Initialize Git repository and first commit

### Task 0.5: Development Environment

- [x] Create `docker-compose.yaml` for local services
- [x] Configure PostgreSQL container
- [x] Configure Qdrant container
- [x] Create `.env.example` templates

---

## Phase 1: Admin Core

### Task 1.1: Admin App Scaffold

- [ ] Create `apps/admin` Next.js app with App Router
- [ ] Install and configure Tailwind CSS
- [ ] Install shadcn/ui base components
- [ ] Create basic layout with navigation

### Task 1.2: Database Setup

- [ ] Create Prisma schema in `apps/admin/prisma/schema.prisma`
- [ ] Define all models (User, Project, ProjectContext, BlogLink, etc.)
- [ ] Run initial migration
- [ ] Create seed script for initial data

### Task 1.3: Authentication Setup

- [ ] Create `packages/auth` package
- [ ] Configure NextAuth with Google OAuth
- [ ] Implement admin allowlist enforcement
- [ ] Implement role assignment (admin/user)

### Task 1.4: Admin API - Projects CRUD

- [ ] Create API route: `GET /api/admin/projects`
- [ ] Create API route: `GET /api/admin/projects/:id`
- [ ] Create API route: `POST /api/admin/projects`
- [ ] Create API route: `PUT /api/admin/projects/:id`
- [ ] Create API route: `DELETE /api/admin/projects/:id`
- [ ] Define Zod validation schemas

### Task 1.5: Admin API - Context Sections

- [ ] Create API routes for ProjectContext CRUD
- [ ] Implement ordering support
- [ ] Implement type enum enforcement

### Task 1.6: Admin Dashboard UI - Projects

- [ ] Create projects list table
- [ ] Create project create/edit form
- [ ] Create context section management UI
- [ ] Implement visibility toggle

### Task 1.7: Public Read API

- [ ] Create `GET /api/public/projects`
- [ ] Create `GET /api/public/projects/:slug`
- [ ] Implement pagination and filtering
- [ ] Ensure only visible items returned

---

## Phase 2: Public Portfolio

### Task 2.1: Public App Scaffold

- [ ] Create `apps/public` Next.js app
- [ ] Configure Tailwind CSS with neuromorphic theme
- [ ] Install shared UI components
- [ ] Create main layout

### Task 2.2: SDK Package

- [ ] Create `packages/sdk` package
- [ ] Implement typed Admin API client
- [ ] Add error handling utilities
- [ ] Add response type inference

### Task 2.3: Home Page

- [ ] Create hero section
- [ ] Create featured projects grid
- [ ] Add navigation to sections
- [ ] Implement responsive design

### Task 2.4: Projects Listing

- [ ] Create projects page
- [ ] Implement category filter
- [ ] Add depth indicator
- [ ] Implement pagination

### Task 2.5: Project Detail Page

- [ ] Create dynamic route `/projects/:slug`
- [ ] Implement context section renderer
- [ ] Style different section types
- [ ] Add navigation between projects

### Task 2.6: Blog Links Page

- [ ] Create blog links page
- [ ] Display blog cards with thumbnails
- [ ] Link to external URLs

### Task 2.7: UI Polish

- [ ] Apply playful geometric design system
- [ ] Add Framer Motion animations
- [ ] Implement dark mode support
- [ ] Audit and fix accessibility

---

## Phase 3: Interactive Features

### Task 3.1: Guestbook Backend

- [ ] Create `POST /api/public-write/guestbook`
- [ ] Implement authentication check
- [ ] Add reaction support
- [ ] Implement rate limiting

### Task 3.2: Guestbook Frontend

- [ ] Create guestbook page
- [ ] Integrate Google sign-in
- [ ] Create entry display with reactions
- [ ] Create post form with validation

### Task 3.3: NGL App

- [ ] Create `apps/ngl` Next.js app
- [ ] Create anonymous message form
- [ ] Implement IP-based rate limiting
- [ ] Create admin inbox view

### Task 3.4: Links Hub

- [ ] Create `apps/links` Next.js app
- [ ] Fetch profile links from API
- [ ] Display links with icons
- [ ] Admin CRUD for profile links

### Task 3.5: Rate Limiting Infrastructure

- [ ] Create rate limiting middleware
- [ ] Implement IP-based tracking
- [ ] Add 429 response handling
- [ ] Add admin visibility into limits

---

## Phase 4: RAG Chatbot

### Task 4.1: RAG Service Scaffold

- [ ] Create `apps/rag-service` Node.js app
- [ ] Setup Fastify server
- [ ] Create health check endpoint
- [ ] Create Docker configuration

### Task 4.2: Vector Store Integration

- [ ] Configure Qdrant client
- [ ] Create collection for embeddings
- [ ] Implement embedding generation
- [ ] Implement similarity search

### Task 4.3: Ingestion Pipeline

- [ ] Create content fetch from Admin API
- [ ] Implement document chunking
- [ ] Implement embedding generation
- [ ] Create internal trigger endpoint

### Task 4.4: LLM Integration

- [ ] Setup LangChain.js
- [ ] Implement provider clients (Gemini, Groq, OpenAI, DeepSeek)
- [ ] Implement primary/fallback routing
- [ ] Configure environment-based selection

### Task 4.5: Chat Endpoint

- [ ] Create `POST /chat` endpoint
- [ ] Implement RAG chain
- [ ] Implement session memory storage
- [ ] Implement context pruning
- [ ] Implement deep link extraction

### Task 4.6: Chat Log Forwarding

- [ ] Create internal API to Admin
- [ ] Implement async log forwarding
- [ ] Handle failure resilience

### Task 4.7: Chat UI Integration

- [ ] Create floating chatbot component
- [ ] Implement message display
- [ ] Add typing indicators
- [ ] Implement deep link rendering
- [ ] Add session persistence

---

## Phase 5: Infrastructure & Deployment

### Task 5.1: Production Dockerfiles

- [ ] Create Dockerfile for each app
- [ ] Implement multi-stage builds
- [ ] Optimize image sizes

### Task 5.2: Traefik Configuration

- [ ] Setup Traefik container
- [ ] Configure host-based routing
- [ ] Configure TLS with Let's Encrypt
- [ ] Add health check integration

### Task 5.3: CI Pipeline

- [ ] Create GitHub Actions workflow
- [ ] Add lint and typecheck stages
- [ ] Add test stage
- [ ] Add build stage
- [ ] Add Docker build and push

### Task 5.4: CD Pipeline

- [ ] Create SSH deployment workflow
- [ ] Implement image pull and restart
- [ ] Add database migration step
- [ ] Add health verification

### Task 5.5: Production Deployment

- [ ] Provision VPS
- [ ] Install Docker and Docker Compose
- [ ] Configure environment variables
- [ ] Deploy all services
- [ ] Verify domains point correctly

### Task 5.6: Monitoring Setup

- [ ] Create health check endpoints
- [ ] Configure uptime monitoring
- [ ] Set up basic alerting
- [ ] Configure log aggregation

---

## Phase 6: Polish & Optimization

### Task 6.1: Performance Optimization

- [ ] Run Lighthouse audit
- [ ] Fix performance issues
- [ ] Optimize images
- [ ] Analyze and reduce bundle size
- [ ] Improve caching

### Task 6.2: Accessibility Audit

- [ ] Run WCAG 2.1 AA check
- [ ] Fix keyboard navigation
- [ ] Fix screen reader issues
- [ ] Fix color contrast issues

### Task 6.3: Security Hardening

- [ ] Configure security headers
- [ ] Run dependency audit
- [ ] Fix vulnerabilities
- [ ] Verify rate limiting
- [ ] Audit for secret exposure

### Task 6.4: Documentation

- [ ] Update README files
- [ ] Review architecture documentation
- [ ] Create environment setup guide
- [ ] Create deployment runbook

### Task 6.5: Final Testing

- [ ] Run full E2E test suite
- [ ] Test cross-browser compatibility
- [ ] Test mobile responsiveness
- [ ] Test edge cases
