# Database Documentation

This document provides comprehensive documentation for the PostgreSQL database schema, migrations, and procedures.

## Overview

The NaufalRF Portfolio Ecosystem uses a single PostgreSQL database accessed exclusively through the Admin application. All data operations are managed via Drizzle ORM.

**Database Provider:** PostgreSQL 14+ (Neon recommended)  
**ORM:** Drizzle ORM  
**Access:** Admin app only

## Database Schema

### Entity Relationship Diagram

```
┌──────────────────┐         ┌──────────────────────┐
│      User        │         │      Project         │
├──────────────────┤         ├──────────────────────┤
│ PK id            │         │ PK id                │
│    email (unique)│         │    title             │
│    name          │         │    slug (unique)     │
│    image         │         │    summary           │
│    role (enum)   │         │    description       │
│    createdAt     │         │    category          │
│    updatedAt     │         │    techStack[]       │
└────────┬─────────┘         │    imageUrl          │
         │                   │    liveUrl           │
         │ 1:N               │    repoUrl           │
         │                   │    featured          │
         ▼                   │    visible           │
┌──────────────────┐         │    order             │
│  GuestbookEntry  │         │    createdAt         │
├──────────────────┤         │    updatedAt         │
│ PK id            │         └──────────┬───────────┘
│ FK userId        │                    │
│    message       │                    │ 1:N
│    reactions     │                    │
│    visible       │                    ▼
│    createdAt     │         ┌──────────────────────┐
│    updatedAt     │         │   ProjectContext     │
└──────────────────┘         ├──────────────────────┤
                             │ PK id                │
┌──────────────────┐         │ FK projectId         │
│    BlogLink      │         │    type (enum)       │
├──────────────────┤         │    title             │
│ PK id            │         │    content (markdown)│
│    url (unique)  │         │    order             │
│    title         │         │    createdAt         │
│    description   │         │    updatedAt         │
│    imageUrl      │         └──────────────────────┘
│    source        │
│    publishedAt   │         ┌──────────────────────┐
│    visible       │         │   ProjectImage       │
│    order         │         ├──────────────────────┤
│    createdAt     │         │ PK id                │
│    updatedAt     │         │ FK projectId         │
└──────────────────┘         │    url               │
                             │    alt               │
┌──────────────────┐         │    order             │
│ AnonymousMessage │         │    createdAt         │
├──────────────────┤         │    updatedAt         │
│ PK id            │         └──────────────────────┘
│    content       │
│    ipHash        │         ┌──────────────────────┐
│    read          │         │      ChatLog         │
│    createdAt     │         ├──────────────────────┤
│    updatedAt     │         │ PK id                │
└──────────────────┘         │    sessionId (unique)│
                             │    messages (JSON[]) │
┌──────────────────┐         │    createdAt         │
│   ProfileLink    │         │    updatedAt         │
├──────────────────┤         └──────────────────────┘
│ PK id            │
│    label         │         ┌──────────────────────┐
│    url           │         │   KnowledgeDoc       │
│    icon          │         ├──────────────────────┤
│    visible       │         │ PK id                │
│    order         │         │    filename (unique) │
│    createdAt     │         │    content           │
│    updatedAt     │         │    indexed           │
└──────────────────┘         │    createdAt         │
                             │    updatedAt         │
                             └──────────────────────┘
```

## Models

### User

Stores user accounts for authentication and guestbook entries.

```typescript
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  image     String?
  role      UserRole @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  guestbookEntries GuestbookEntry[]

  @@index([email])
  @@index([role])
  @@index([createdAt])
  @@map("users")
}

enum UserRole {
  ADMIN
  USER
}
```

**Fields:**

- `id`: Unique identifier (CUID)
- `email`: User email (unique)
- `name`: Display name
- `image`: Avatar URL
- `role`: User role (ADMIN or USER)
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

**Indexes:**

- `email`: Fast lookup during authentication
- `role`: Filter users by permission level
- `createdAt`: Sort users by registration date

### Project

Portfolio projects with full details.

```typescript
model Project {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  summary     String   @db.Text
  description String   @db.Text
  category    String
  techStack   String[]
  imageUrl    String?
  liveUrl     String?
  repoUrl     String?
  featured    Boolean  @default(false)
  visible     Boolean  @default(true)
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  contexts ProjectContext[]
  images   ProjectImage[]

  @@index([slug])
  @@index([category])
  @@index([featured])
  @@index([visible])
  @@index([order])
  @@index([visible, featured, order])
  @@map("projects")
}
```

**Fields:**

- `id`: Unique identifier
- `title`: Project title
- `slug`: URL-friendly identifier (unique)
- `summary`: Short description
- `description`: Full markdown description
- `category`: Project category
- `techStack`: Array of technologies used
- `imageUrl`: Main project image
- `liveUrl`: Live demo URL
- `repoUrl`: Repository URL
- `featured`: Featured on homepage
- `visible`: Publicly visible
- `order`: Display order
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

**Indexes:**

- `slug`: Fast project lookup by URL slug
- `category`: Filter projects by category
- `featured`: Quick access to featured projects
- `visible`: Filter published projects
- `visible, featured, order`: Composite index for homepage listing

### ProjectContext

Detailed context sections for each project.

```typescript
model ProjectContext {
  id        String             @id @default(cuid())
  projectId String
  type      ProjectContextType
  title     String
  content   String             @db.Text
  order     Int                @default(0)
  createdAt DateTime           @default(now())
  updatedAt DateTime           @updatedAt

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@index([projectId])
  @@index([type])
  @@index([projectId, type])
  @@index([projectId, order])
  @@map("project_contexts")
}

enum ProjectContextType {
  CONTEXT
  ROLE
  DECISIONS
  TRADEOFFS
  RESULT
  ARCHITECTURE
  OPERATIONS
  METRICS
}
```

**Fields:**

- `id`: Unique identifier
- `projectId`: Foreign key to Project
- `type`: Context section type
- `title`: Section title
- `content`: Markdown content
- `order`: Display order
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

**Context Types:**

- `CONTEXT`: Background and problem statement
- `ROLE`: Personal role and responsibilities
- `DECISIONS`: Key technical and design decisions
- `TRADEOFFS`: Tradeoffs considered and made
- `RESULT`: Outcomes and achievements
- `ARCHITECTURE`: System architecture and design patterns
- `OPERATIONS`: Deployment, monitoring, and maintenance
- `METRICS`: Performance metrics and KPIs

### ProjectImage

Additional images for projects.

```typescript
model ProjectImage {
  id        String   @id @default(cuid())
  projectId String
  url       String
  alt       String?
  order     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@index([projectId])
  @@index([projectId, order])
  @@map("project_images")
}
```

### BlogLink

External blog posts and articles.

```typescript
model BlogLink {
  id          String    @id @default(cuid())
  url         String    @unique
  title       String
  description String?   @db.Text
  imageUrl    String?
  source      String
  publishedAt DateTime?
  visible     Boolean   @default(true)
  order       Int       @default(0)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([url])
  @@index([source])
  @@index([visible])
  @@index([order])
  @@index([publishedAt])
  @@index([visible, order])
  @@map("blog_links")
}
```

**Fields:**

- `id`: Unique identifier
- `url`: Blog post URL (unique)
- `title`: Post title
- `description`: Post description
- `imageUrl`: Cover image URL
- `source`: Platform (medium, dev.to, hashnode)
- `publishedAt`: Publication date
- `visible`: Publicly visible
- `order`: Display order
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### GuestbookEntry

Guestbook messages from authenticated users.

```typescript
model GuestbookEntry {
  id        String   @id @default(cuid())
  userId    String
  message   String   @db.Text
  reactions Json     @default("{}")
  visible   Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([visible])
  @@index([createdAt])
  @@index([visible, createdAt])
  @@map("guestbook_entries")
}
```

**Fields:**

- `id`: Unique identifier
- `userId`: Foreign key to User
- `message`: Entry message
- `reactions`: JSON structure for reactions
- `visible`: Publicly visible
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

**Reactions JSON Structure:**

```json
{
  "reactions": [
    {
      "type": "LIKE",
      "count": 5,
      "userIds": ["user1", "user2", "user3"]
    },
    {
      "type": "HEART",
      "count": 3,
      "userIds": ["user4", "user5", "user6"]
    }
  ]
}
```

### AnonymousMessage

Anonymous messages from visitors.

```typescript
model AnonymousMessage {
  id        String   @id @default(cuid())
  content   String   @db.Text
  ipHash    String
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([ipHash])
  @@index([read])
  @@index([createdAt])
  @@index([read, createdAt])
  @@map("anonymous_messages")
}
```

**Fields:**

- `id`: Unique identifier
- `content`: Message content
- `ipHash`: Hashed IP for rate limiting (not identification)
- `read`: Admin has read the message
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### ChatLog

AI chat conversation logs.

```typescript
model ChatLog {
  id        String   @id @default(cuid())
  sessionId String   @unique
  messages  Json     @default("[]")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([sessionId])
  @@index([createdAt])
  @@index([updatedAt])
  @@map("chat_logs")
}
```

**Messages JSON Structure:**

```json
{
  "messages": [
    {
      "id": "msg_001",
      "role": "user",
      "content": "Tell me about your projects",
      "timestamp": "2024-01-20T10:00:00Z"
    },
    {
      "id": "msg_002",
      "role": "assistant",
      "content": "I have several projects...",
      "timestamp": "2024-01-20T10:00:02Z",
      "metadata": {
        "model": "gemini-2.0-flash",
        "tokens": 150,
        "duration": 1.2
      }
    }
  ]
}
```

### ProfileLink

Social and professional profile links.

```typescript
model ProfileLink {
  id        String   @id @default(cuid())
  label     String
  url       String
  icon      String?
  visible   Boolean  @default(true)
  order     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([visible])
  @@index([order])
  @@index([visible, order])
  @@map("profile_links")
}
```

### KnowledgeDoc

Documents for RAG knowledge base.

```typescript
model KnowledgeDoc {
  id        String   @id @default(cuid())
  filename  String   @unique
  content   String   @db.Text
  indexed   Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([filename])
  @@index([indexed])
  @@index([createdAt])
  @@index([indexed, updatedAt])
  @@map("knowledge_docs")
}
```

## Migrations

### Creating Migrations

```bash
# Create a new migration
pnpm --filter admin db:generate && pnpm --filter admin db:migrate  # (migration naming in Drizzle) descriptive_name

# Example: Add new field
pnpm --filter admin db:generate && pnpm --filter admin db:migrate  # (migration naming in Drizzle) add_project_featured_field
```

### Applying Migrations

```bash
# Development
pnpm --filter admin db:migrate

# Production
pnpm --filter admin db:migrate
```

### Migration Status

```bash
# Check migration status
pnpm --filter admin db:migrate  # Check migration status

# View migration history
pnpm --filter admin db:migrate  # View migration history
```

### Rollback Strategy

Drizzle ORM migrations require manual rollback. For production:

1. **Backup database before migrations**

   ```bash
   pg_dump -h host -U user -d database > backup.sql
   ```

2. **Create reverse migration scripts manually**

   ```sql
   -- Example: Reverse adding a column
   ALTER TABLE projects DROP COLUMN new_field;
   ```

3. **Test migrations on staging first**

4. **Use database snapshots for critical migrations**

## Seeding

### Seed Script

Location: `apps/admin/db/seed.ts`

```bash
# Run seed script
pnpm --filter admin db:seed
```

### Seed Data

The seed script creates:

- Admin user
- Sample projects with contexts
- Sample blog links
- Profile links
- Knowledge documents

### Environment-Specific Seeds

- **Development**: Full seed data including test users
- **Staging**: Sanitized production-like data
- **Production**: Admin user and essential data only

## Common Queries

### Projects

```typescript
// Get all visible projects
const projects = await db.select().from(projects).where({
  where: { visible: true },
  include: {
    contexts: {
      orderBy: { order: 'asc' },
    },
    images: {
      orderBy: { order: 'asc' },
    },
  },
  orderBy: { order: 'asc' },
});

// Get featured projects
const featured = await db.select().from(projects).where({
  where: {
    visible: true,
    featured: true,
  },
  take: 3,
  orderBy: { order: 'asc' },
});

// Get project by slug
const project = await db.query.projects.findFirst({
  where: { slug: 'project-slug' },
  include: {
    contexts: {
      orderBy: { order: 'asc' },
    },
    images: {
      orderBy: { order: 'asc' },
    },
  },
});
```

### Guestbook

```typescript
// Get visible guestbook entries with user info
const entries = await db.select().from(guestbookEntries).where({
  where: { visible: true },
  include: {
    user: {
      select: {
        id: true,
        name: true,
        image: true,
      },
    },
  },
  orderBy: { createdAt: 'desc' },
  take: 20,
});

// Create guestbook entry
const [entry] = await db.insert(guestbookEntries).values({
  data: {
    userId: user.id,
    message: 'Great portfolio!',
  },
  include: {
    user: {
      select: {
        id: true,
        name: true,
        image: true,
      },
    },
  },
});
```

### Blog Links

```typescript
// Get visible blog links
const blogs = await db.select().from(blogLinks).where({
  where: { visible: true },
  orderBy: [{ publishedAt: 'desc' }, { order: 'asc' }],
  take: 10,
});

// Filter by source
const mediumPosts = await db.select().from(blogLinks).where({
  where: {
    visible: true,
    source: 'medium',
  },
  orderBy: { publishedAt: 'desc' },
});
```

## Database Maintenance

### Backup

```bash
# Create backup
pg_dump -h host -U user -d database > backup_$(date +%Y%m%d).sql

# Restore backup
psql -h host -U user -d database < backup_20240120.sql
```

### Vacuum

```sql
-- Analyze and vacuum database
VACUUM ANALYZE;

-- Vacuum specific table
VACUUM ANALYZE projects;
```

### Reindex

```sql
-- Reindex all tables
REINDEX DATABASE portfolio;

-- Reindex specific table
REINDEX TABLE projects;
```

## Performance Optimization

### Index Strategy

- Primary keys use CUID for distributed-friendly IDs
- Unique indexes on email, slug, url, sessionId, filename
- Composite indexes for frequently combined filters
- Indexes on foreign keys for join performance

### Query Optimization

```typescript
// Use select to limit fields
const projects = await db.select().from(projects).where({
  select: {
    id: true,
    title: true,
    slug: true,
    summary: true,
  },
});

// Use pagination
const projects = await db.select().from(projects).where({
  skip: (page - 1) * limit,
  take: limit,
});

// Use cursor-based pagination for large datasets
const projects = await db.select().from(projects).where({
  take: 10,
  cursor: {
    id: lastProjectId,
  },
});
```

### Connection Pooling

Neon provides automatic connection pooling. For self-hosted:

```bash
DATABASE_URL="postgresql://user:password@host:5432/db?connection_limit=10"
```

## Troubleshooting

### Connection Issues

```bash
# Test connection
psql "postgresql://user:password@host:5432/database"

# Check database connection
DEBUG="*" pnpm --filter admin dev
```

### Migration Issues

```bash
# Reset database (WARNING: deletes all data)
pnpm --filter admin db:push  # Reset and push schema

# Mark migration as applied without running
pnpm --filter admin db:migrate  # Resolve migration issues --applied <migration-name>

# Mark migration as rolled back
pnpm --filter admin db:migrate  # Resolve migration issues --rolled-back <migration-name>
```

### Schema Sync Issues

```bash
# Generate Drizzle client
pnpm --filter admin db:generate

# Push schema without migration (dev only)
pnpm --filter admin db:push

# Pull schema from database
pnpm --filter admin db:pull
```

## Security

### Best Practices

- Never expose `DATABASE_URL` to frontend
- Use connection pooling
- Implement rate limiting on write operations
- Hash sensitive data (IP addresses)
- Use parameterized queries (Drizzle ORM handles this)
- Regular backups
- Monitor for suspicious activity

### Access Control

- Only Admin app has database access
- All other apps use Admin API
- Admin endpoints require authentication
- Public write endpoints are rate-limited

## Resources

- [Drizzle ORM Documentation](https://orm.drizzle.team/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Neon Documentation](https://neon.tech/docs)
