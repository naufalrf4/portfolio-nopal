# Product Requirements Document

## Problem

### Current State
Traditional portfolio websites fail to demonstrate real engineering capability. They present static lists of technologies and superficial project descriptions that do not convey architectural thinking, trade-off analysis, or operational maturity. Recruiters, engineers, and clients cannot distinguish between a developer who "used React" and one who designed scalable systems.

### Gap Analysis
| Dimension | Traditional Portfolio | Required Capability |
|-----------|----------------------|---------------------|
| Depth | Single description per project | Structured narrative with context, decisions, trade-offs, results |
| Interactivity | Static pages | Conversational exploration, guestbook, feedback channels |
| Architecture | Monolithic site | Multi-app ecosystem demonstrating system design |
| Content Management | Hard-coded or CMS dependency | API-first, centralized control, frontend-agnostic |
| Security | Often overlooked | Production-grade access control, rate limiting, secrets management |

### Impact
Without a system that demonstrates real engineering depth, the owner cannot effectively communicate value to technical audiences, leading to missed opportunities and undervaluation of skills.

---

## Goals

### Primary Goals
1. **Demonstrate System Design Capability**: Build a multi-application ecosystem that itself serves as a portfolio piece—showing monorepo management, API-first architecture, and service boundaries.

2. **Enable Deep Project Exploration**: Each project must be explorable through structured context sections (Context, Role, Decisions, Trade-offs, Result) without requiring frontend changes when new projects are added.

3. **Centralize Content Authority**: A single admin application controls all data. Other applications consume via typed APIs, ensuring consistency and security.

4. **Provide Interactive Touchpoints**: Visitors can engage through a guestbook, anonymous feedback, and a RAG-powered chatbot that answers questions about the portfolio.

5. **Maintain Production-Grade Standards**: The system must embody security best practices, observability, and maintainability appropriate for production workloads.

### Measurable Objectives
| Objective | Target | Measurement |
|-----------|--------|-------------|
| Time to Value | Recruiter understands positioning within 60 seconds | User testing, heatmaps |
| Content Depth | Each project has 5+ context sections | Content audit |
| API Coverage | 100% of data flows through Admin API | Architecture validation |
| Uptime | 99.5% availability | Monitoring dashboard |
| Security | Zero exposed secrets, all public writes rate-limited | Security audit |

---

## Non-Goals

The following are explicitly out of scope for this system:

### Product Boundaries
- **Public SaaS Platform**: This is a personal portfolio, not a multi-tenant product.
- **Generic CMS**: Content structures are domain-specific, not generalized.
- **Social Networking Features**: No follower systems, feeds, or user-to-user messaging.
- **Autonomous AI Content Generation**: The chatbot retrieves and presents existing content; it does not generate new portfolio content.

### Technical Boundaries
- **Client-Side Database Access**: All database operations are server-side through the Admin app only.
- **Multiple Database Instances**: Single PostgreSQL database via Neon; no polyglot persistence.
- **Custom Authentication System**: OAuth via Google only; no username/password flows.
- **Public Write Without Protection**: All public write endpoints require rate limiting; anonymous abuse is not tolerated.

### Operational Boundaries
- **24/7 On-Call**: Best-effort availability with automated recovery; no formal SLA commitments.
- **Multi-Region Deployment**: Single-region self-hosted Docker deployment.
- **Real-Time Features**: No WebSocket-based real-time updates; polling or refresh-based where needed.

---

## Users

### Primary Users

#### Recruiters
- **Goal**: Quickly assess candidate's engineering capability and fit.
- **Behavior**: Scan homepage, view 1-2 project details, check for relevant technologies.
- **Needs**: Clear positioning, scannable project list, depth indicators, downloadable resume.
- **Constraints**: Limited time (typically under 3 minutes).

#### Engineers / Tech Leads
- **Goal**: Evaluate architectural thinking and technical depth.
- **Behavior**: Deep-dive into project context sections, examine trade-offs, assess decision quality.
- **Needs**: Structured narratives, architecture diagrams, links to code or demos.
- **Constraints**: High expectations for technical accuracy and clarity.

#### Clients
- **Goal**: Determine if the owner can solve their problem.
- **Behavior**: Look for similar past projects, check for business impact in results.
- **Needs**: Problem-solution framing, quantified outcomes, contact path.
- **Constraints**: May not be technical; need accessible language.

### Secondary Users

#### Public Visitors
- **Goal**: General exploration, curiosity.
- **Behavior**: Browse projects, interact with chatbot, leave guestbook entries.
- **Needs**: Engaging experience, easy navigation, responsive design.
- **Constraints**: None specific.

#### Owner (Admin)
- **Goal**: Manage all content, moderate submissions, monitor system health.
- **Behavior**: CRUD operations on projects, blogs, guestbook; trigger RAG ingestion; review chat logs.
- **Needs**: Efficient dashboard, bulk operations, clear moderation queue.
- **Constraints**: Single admin user; must be protected by allowlist.

---

## Success Metrics

### Engagement Metrics
| Metric | Target | Rationale |
|--------|--------|-----------|
| Avg. Time on Site | > 2 minutes | Indicates depth of engagement |
| Project Detail Views | > 40% of sessions | Visitors are exploring beyond homepage |
| Guestbook Entries | > 10/month | Visitors are engaging interactively |
| Chatbot Interactions | > 50/month | Conversational exploration is valued |

### Technical Metrics
| Metric | Target | Rationale |
|--------|--------|-----------|
| Lighthouse Performance | > 90 | Fast, accessible public pages |
| API Response Time (p95) | < 500ms | Responsive user experience |
| Error Rate | < 0.1% | Stable, reliable system |
| Uptime | 99.5% | Acceptable for personal project |

### Content Metrics
| Metric | Target | Rationale |
|--------|--------|-----------|
| Projects with Full Context | 100% | Every project tells complete story |
| Context Sections per Project | >= 5 | Sufficient depth for technical evaluation |
| Blog Links Curated | >= 10 | Demonstrates ongoing learning |

### Security Metrics
| Metric | Target | Rationale |
|--------|--------|-----------|
| Exposed Secrets | 0 | Non-negotiable security baseline |
| Rate Limit Violations Blocked | 100% | Abuse protection effective |
| Admin Access Attempts (non-allowlist) | 100% rejected | Allowlist enforcement working |
