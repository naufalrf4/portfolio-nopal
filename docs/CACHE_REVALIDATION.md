# Cache Revalidation System - Implementation Guide

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Implementation Steps](#implementation-steps)
- [Environment Configuration](#environment-configuration)
- [Code Implementation](#code-implementation)
- [Testing Guide](#testing-guide)
- [Troubleshooting](#troubleshooting)
- [Maintenance](#maintenance)

---

## Overview

### What This System Does

The **On-Demand Cache Revalidation System** enables instant synchronization of data changes from the Admin app to Public and Links apps without waiting for ISR (Incremental Static Regeneration) timers.

### Before vs After

| Scenario                | Before                                           | After                       |
| ----------------------- | ------------------------------------------------ | --------------------------- |
| Update project in Admin | Wait up to 1 hour for Public app to show changes | Instant update              |
| Update about info       | Wait up to 2 hours (Public) or 2 hours (Links)   | Instant update on both apps |
| Add profile link        | Wait up to 2 hours for Links app                 | Instant update              |
| Delete guestbook entry  | Wait until next revalidate cycle                 | Instant update              |

### System Flow

```
┌─────────────┐
│ Admin App   │ 1. User updates data
│ (CMS)       │ 2. Save to Database (Drizzle ORM)
└──────┬──────┘ 3. Trigger revalidation webhooks
       │
       ├──────────────────┬──────────────────┐
       │                  │                  │
       ▼                  ▼                  ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Public App  │    │ Links App   │    │ (Future)    │
│ /api/       │    │ /api/       │    │ Other Apps  │
│ revalidate  │    │ revalidate  │    │             │
└──────┬──────┘    └──────┬──────┘    └─────────────┘
       │                  │
       ▼                  ▼
Next.js revalidateTag('projects')
       │
       ▼
Cache cleared, fresh data fetched on next request
```

---

## Architecture

### Cache Tag Strategy

Each data endpoint is tagged for granular cache invalidation:

| Resource     | Cache Tag      | Used By        | Invalidated When                                |
| ------------ | -------------- | -------------- | ----------------------------------------------- |
| Projects     | `projects`     | Public App     | Create/Update/Delete project or project context |
| Blogs        | `blogs`        | Public App     | Create/Update/Delete blog link                  |
| About        | `about`        | Public + Links | Update about info                               |
| Achievements | `achievements` | Public App     | Create/Update/Delete/Reorder achievement        |
| Links        | `links`        | Links App      | Create/Update/Delete/Reorder profile link       |
| Guestbook    | `guestbook`    | Public App     | Create/Delete/Toggle guestbook entry            |
| Bookings     | `bookings`     | Public App     | CRUD on bookings/slots/availability             |

### Application Roles

**Admin App (Broadcaster):**

- Manages database through Drizzle ORM
- Triggers revalidation after successful mutations
- Sends authenticated webhooks to consumer apps

**Public App (Receiver):**

- Caches data with Next.js tags
- Exposes `/api/revalidate` endpoint
- Invalidates cache on webhook receipt

**Links App (Receiver):**

- Caches data with Next.js tags
- Exposes `/api/revalidate` endpoint
- Invalidates cache on webhook receipt

---

## Prerequisites

### Required Tools

- Node.js 18+
- pnpm (workspace package manager)
- OpenSSL (for token generation)

### Before Starting

1. **Clean Git State:**

   ```bash
   git status
   # Commit or stash any uncommitted changes
   git add . && git commit -m "chore: prepare for cache revalidation system"
   ```

2. **Generate Revalidation Secret:**

   ```bash
   openssl rand -hex 32
   # Example output: a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
   ```

   Save this token - you'll use it in multiple `.env` files.

3. **Verify Dev Servers:**
   ```bash
   # Test that all apps can start
   pnpm --filter admin dev    # Should run on :3001
   pnpm --filter public dev   # Should run on :3000
   pnpm --filter links dev    # Should run on :3002
   ```

---

## Implementation Steps

### Phase 1: Environment Configuration

#### Step 1.1: Update Admin App Environment

**File:** `apps/admin/.env.local`

```bash
# Add these variables to your existing .env.local

# ============================================
# CACHE REVALIDATION
# ============================================
# Secret token for authenticating revalidation requests
REVALIDATION_SECRET=<your-generated-token-here>

# Development URLs
PUBLIC_APP_REVALIDATION_URL=http://localhost:3000/api/revalidate
LINKS_APP_REVALIDATION_URL=http://localhost:3002/api/revalidate

# Production URLs (uncomment and update for production)
# PUBLIC_APP_REVALIDATION_URL=https://naufalrf.tech/api/revalidate
# LINKS_APP_REVALIDATION_URL=https://links.naufalrf.tech/api/revalidate
```

**Also update:** `apps/admin/.env.example` with same structure (use placeholder for token)

#### Step 1.2: Update Public App Environment

**File:** `apps/public/.env.local`

```bash
# Add this variable to your existing .env.local

# ============================================
# CACHE REVALIDATION
# ============================================
# Secret token for authenticating revalidation requests (must match Admin)
REVALIDATION_SECRET=<same-token-as-admin>
```

**Also update:** `apps/public/.env.example` with same structure

#### Step 1.3: Update Links App Environment

**File:** `apps/links/.env.local`

```bash
# Add this variable to your existing .env.local

# ============================================
# CACHE REVALIDATION
# ============================================
# Secret token for authenticating revalidation requests (must match Admin)
REVALIDATION_SECRET=<same-token-as-admin>
```

**Also update:** `apps/links/.env.example` with same structure

#### Step 1.4: Update Production Environment Template

**File:** `.env.production.example` (root)

```bash
# ============================================
# CACHE REVALIDATION (Production)
# ============================================
REVALIDATION_SECRET=<generate-new-token-for-production>

# Admin App
PUBLIC_APP_REVALIDATION_URL=https://naufalrf.tech/api/revalidate
LINKS_APP_REVALIDATION_URL=https://links.naufalrf.tech/api/revalidate

# Public & Links Apps
REVALIDATION_SECRET=<same-as-admin>
```

---

### Phase 2: Public App Receiver Implementation

#### Step 2.1: Upgrade fetchApi Client

**File:** `apps/public/src/lib/api/client.ts`

**Find this interface:**

```typescript
interface FetchOptions {
  retries?: number;
  retryDelay?: number;
  revalidate?: number | false;
}
```

**Replace with:**

```typescript
interface FetchOptions {
  retries?: number;
  retryDelay?: number;
  revalidate?: number | false;
  tags?: string[]; // NEW: Cache tags for revalidation
}
```

**Find the fetchApi function implementation:**

```typescript
async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { retries = 0, retryDelay = 1000, revalidate, ...fetchOptions } = options;

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...fetchOptions,
    next: revalidate !== undefined ? { revalidate } : undefined,
  });

  // ... rest of code
}
```

**Replace with:**

```typescript
async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { retries = 0, retryDelay = 1000, revalidate, tags, ...fetchOptions } = options;

  const nextConfig: { revalidate?: number | false; tags?: string[] } = {};
  if (revalidate !== undefined) {
    nextConfig.revalidate = revalidate;
  }
  if (tags && tags.length > 0) {
    nextConfig.tags = tags;
  }

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...fetchOptions,
    next: Object.keys(nextConfig).length > 0 ? nextConfig : undefined,
  });

  // ... rest of code (no changes)
}
```

#### Step 2.2: Add Cache Tags to Endpoints

**File:** `apps/public/src/lib/api/endpoints/projects.ts`

**Find:**

```typescript
getAll: (params?: GetProjectsParams) => {
  const qs = params ? `?${new URLSearchParams(params as any).toString()}` : '';
  return fetchApi<ProjectsResponse>(`/api/v1/public/projects${qs}`, {
    retries: 2,
    revalidate: 3600,
  });
},

getBySlug: (slug: string) => {
  return fetchApi<Project>(`/api/v1/public/projects/${slug}`, {
    retries: 2,
    revalidate: 3600,
  });
},
```

**Replace with:**

```typescript
getAll: (params?: GetProjectsParams) => {
  const qs = params ? `?${new URLSearchParams(params as any).toString()}` : '';
  return fetchApi<ProjectsResponse>(`/api/v1/public/projects${qs}`, {
    retries: 2,
    revalidate: 3600,
    tags: ['projects'], // NEW: Cache tag
  });
},

getBySlug: (slug: string) => {
  return fetchApi<Project>(`/api/v1/public/projects/${slug}`, {
    retries: 2,
    revalidate: 3600,
    tags: ['projects', `project:${slug}`], // NEW: Cache tags (list + detail)
  });
},
```

**File:** `apps/public/src/lib/api/endpoints/blogs.ts`

**Find:**

```typescript
getAll: (limit?: number) => {
  const qs = limit ? `?limit=${limit}` : '';
  return fetchApi<BlogsResponse>(`/api/v1/public/blogs${qs}`, {
    retries: 2,
    revalidate: 1800,
  });
},
```

**Replace with:**

```typescript
getAll: (limit?: number) => {
  const qs = limit ? `?limit=${limit}` : '';
  return fetchApi<BlogsResponse>(`/api/v1/public/blogs${qs}`, {
    retries: 2,
    revalidate: 1800,
    tags: ['blogs'], // NEW: Cache tag
  });
},
```

**File:** `apps/public/src/lib/api/endpoints/about.ts`

**Find:**

```typescript
get: () => {
  return fetchApi<AboutData>(`/api/v1/public/about`, {
    retries: 2,
    revalidate: 7200,
  });
},
```

**Replace with:**

```typescript
get: () => {
  return fetchApi<AboutData>(`/api/v1/public/about`, {
    retries: 2,
    revalidate: 7200,
    tags: ['about'], // NEW: Cache tag
  });
},
```

**File:** `apps/public/src/lib/api/endpoints/achievements.ts`

**Find:**

```typescript
getAll: () => {
  return fetchApi<AchievementsResponse>(`/api/v1/public/achievements`, {
    // May not have explicit options
  });
},
```

**Replace with:**

```typescript
getAll: () => {
  return fetchApi<AchievementsResponse>(`/api/v1/public/achievements`, {
    retries: 2,
    revalidate: 3600, // NEW: Add caching
    tags: ['achievements'], // NEW: Cache tag
  });
},
```

**File:** `apps/public/src/lib/api/endpoints/links.ts`

**Find:**

```typescript
getAll: () => {
  return fetchApi<ProfileLink[]>(`/api/v1/public/links`, {
    retries: 2,
  });
},
```

**Replace with:**

```typescript
getAll: () => {
  return fetchApi<ProfileLink[]>(`/api/v1/public/links`, {
    retries: 2,
    revalidate: 3600, // NEW: Add caching
    tags: ['links'], // NEW: Cache tag
  });
},
```

**File:** `apps/public/src/lib/api/endpoints/guestbook.ts`

**Find:**

```typescript
getAll: () => {
  return fetchApi<GuestbookResponse>(`/api/v1/public/guestbook`, {
    retries: 2,
  });
},
```

**Replace with:**

```typescript
getAll: () => {
  return fetchApi<GuestbookResponse>(`/api/v1/public/guestbook`, {
    retries: 2,
    revalidate: 60, // NEW: Cache for 1 minute (frequently updated)
    tags: ['guestbook'], // NEW: Cache tag
  });
},
```

**File:** `apps/public/src/lib/api/endpoints/bookings.ts`

**Find:**

```typescript
getAvailable: () => {
  return fetchApi<BookingAvailableResponse>(`/api/v1/public/bookings/available`, {
    retries: 2,
  });
},
```

**Replace with:**

```typescript
getAvailable: () => {
  return fetchApi<BookingAvailableResponse>(`/api/v1/public/bookings/available`, {
    retries: 2,
    revalidate: 300, // NEW: Cache for 5 minutes
    tags: ['bookings'], // NEW: Cache tag
  });
},
```

#### Step 2.3: Create Revalidation API Route

**File:** `apps/public/app/api/revalidate/route.ts` (NEW FILE)

```typescript
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const secret = process.env.REVALIDATION_SECRET;

    if (!secret) {
      console.error('[Revalidate] REVALIDATION_SECRET not configured');
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (!authHeader || authHeader !== `Bearer ${secret}`) {
      console.error('[Revalidate] Invalid or missing authorization token');
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { tag, tags } = body;

    if (!tag && !tags) {
      return NextResponse.json(
        { success: false, error: 'Missing tag or tags parameter' },
        { status: 400 }
      );
    }

    const tagsToRevalidate = tags || [tag];

    if (!Array.isArray(tagsToRevalidate)) {
      return NextResponse.json(
        { success: false, error: 'Tags must be a string or array' },
        { status: 400 }
      );
    }

    for (const tagName of tagsToRevalidate) {
      revalidateTag(tagName);
      console.log(`[Revalidate] Cache cleared for tag: ${tagName}`);
    }

    return NextResponse.json({
      success: true,
      revalidated: tagsToRevalidate,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Revalidate] Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed. Use POST.' }, { status: 405 });
}
```

---

### Phase 3: Links App Receiver Implementation

#### Step 3.1: Fix Cache Configuration

**File:** `apps/links/src/app/page.tsx`

**Find:**

```typescript
export const dynamic = 'force-dynamic';

async function getLinksData() {
  const baseUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3001';

  const [aboutResponse, linksResponse] = await Promise.all([
    fetch(`${baseUrl}/api/v1/public/about`, {
      next: { revalidate: 7200 },
    }),
    fetch(`${baseUrl}/api/v1/public/links`, {
      next: { revalidate: 7200 },
    }),
  ]);

  // ... rest of code
}
```

**Replace with:**

```typescript
// REMOVE THIS LINE:
// export const dynamic = 'force-dynamic';

async function getLinksData() {
  const baseUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3001';

  const [aboutResponse, linksResponse] = await Promise.all([
    fetch(`${baseUrl}/api/v1/public/about`, {
      next: {
        revalidate: 7200, // Cache for 2 hours
        tags: ['about'], // NEW: Cache tag
      },
    }),
    fetch(`${baseUrl}/api/v1/public/links`, {
      next: {
        revalidate: 3600, // Cache for 1 hour (reduced from 2h)
        tags: ['links'], // NEW: Cache tag
      },
    }),
  ]);

  // ... rest of code (no changes)
}
```

#### Step 3.2: Create Revalidation API Route

**File:** `apps/links/app/api/revalidate/route.ts` (NEW FILE)

```typescript
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const secret = process.env.REVALIDATION_SECRET;

    if (!secret) {
      console.error('[Revalidate] REVALIDATION_SECRET not configured');
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (!authHeader || authHeader !== `Bearer ${secret}`) {
      console.error('[Revalidate] Invalid or missing authorization token');
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { tag, tags } = body;

    if (!tag && !tags) {
      return NextResponse.json(
        { success: false, error: 'Missing tag or tags parameter' },
        { status: 400 }
      );
    }

    const tagsToRevalidate = tags || [tag];

    if (!Array.isArray(tagsToRevalidate)) {
      return NextResponse.json(
        { success: false, error: 'Tags must be a string or array' },
        { status: 400 }
      );
    }

    for (const tagName of tagsToRevalidate) {
      revalidateTag(tagName);
      console.log(`[Revalidate] Cache cleared for tag: ${tagName}`);
    }

    return NextResponse.json({
      success: true,
      revalidated: tagsToRevalidate,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Revalidate] Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed. Use POST.' }, { status: 405 });
}
```

---

### Phase 4: Admin Broadcaster Implementation

#### Step 4.1: Create Revalidation Service

**File:** `apps/admin/src/lib/services/revalidate.service.ts` (NEW FILE)

```typescript
export class RevalidateService {
  private static publicAppUrl = process.env.PUBLIC_APP_REVALIDATION_URL;
  private static linksAppUrl = process.env.LINKS_APP_REVALIDATION_URL;
  private static secret = process.env.REVALIDATION_SECRET;

  private static async sendRevalidation(url: string | undefined, tags: string[]): Promise<void> {
    if (!url) {
      console.warn('[Revalidate] URL not configured, skipping revalidation');
      return;
    }

    if (!this.secret) {
      console.error('[Revalidate] REVALIDATION_SECRET not configured');
      return;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.secret}`,
        },
        body: JSON.stringify({ tags }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error(`[Revalidate] Failed to revalidate ${url}:`, error);
        return;
      }

      const result = await response.json();
      console.log(`[Revalidate] Success for ${url}:`, result);
    } catch (error) {
      console.error(`[Revalidate] Network error for ${url}:`, error);
    }
  }

  static async revalidatePublic(tags: string[]): Promise<void> {
    await this.sendRevalidation(this.publicAppUrl, tags);
  }

  static async revalidateLinks(tags: string[]): Promise<void> {
    await this.sendRevalidation(this.linksAppUrl, tags);
  }

  static async revalidateBoth(tags: string[]): Promise<void> {
    await Promise.all([this.revalidatePublic(tags), this.revalidateLinks(tags)]);
  }
}
```

#### Step 4.2: Integrate into Projects Service

**File:** `apps/admin/src/lib/api/handlers/projects.service.ts`

**Add import at top:**

```typescript
import { RevalidateService } from '@/lib/services/revalidate.service';
```

**Find the `create` method:**

```typescript
async create(data: CreateProjectInput): Promise<Project> {
  // ... validation code

  const [project] = await db.insert(projects).values({
    data: {
      // ... project data
    },
  });

  return project;
}
```

**Replace with:**

```typescript
async create(data: CreateProjectInput): Promise<Project> {
  // ... validation code

  const [project] = await db.insert(projects).values({
    data: {
      // ... project data
    },
  });

  // NEW: Trigger cache revalidation
  await RevalidateService.revalidatePublic(['projects']);

  return project;
}
```

**Repeat for `update` and `delete` methods** - add this line after successful database operation:

```typescript
await RevalidateService.revalidatePublic(['projects']);
```

#### Step 4.3: Integrate into Project Contexts Service

**File:** `apps/admin/src/lib/api/handlers/project-contexts.service.ts`

**Add import:**

```typescript
import { RevalidateService } from '@/lib/services/revalidate.service';
```

**Add to methods:** `create`, `update`, `delete`, `reorder`

```typescript
await RevalidateService.revalidatePublic(['projects']);
```

#### Step 4.4: Integrate into Blogs Service

**File:** `apps/admin/src/lib/api/handlers/blogs.service.ts`

**Add import:**

```typescript
import { RevalidateService } from '@/lib/services/revalidate.service';
```

**Add to methods:** `create`, `update`, `delete`

```typescript
await RevalidateService.revalidatePublic(['blogs']);
```

#### Step 4.5: Integrate into About Service

**File:** `apps/admin/src/lib/api/handlers/about.service.ts`

**Add import:**

```typescript
import { RevalidateService } from '@/lib/services/revalidate.service';
```

**Add to method:** `update`

```typescript
// About data is used by BOTH Public and Links apps
await RevalidateService.revalidateBoth(['about']);
```

#### Step 4.6: Integrate into Achievements Service

**File:** `apps/admin/src/lib/api/handlers/achievements.service.ts`

**Add import:**

```typescript
import { RevalidateService } from '@/lib/services/revalidate.service';
```

**Add to methods:** `create`, `update`, `delete`, `reorder`, `toggleVisibility`

```typescript
await RevalidateService.revalidatePublic(['achievements']);
```

#### Step 4.7: Integrate into Profile Links Service

**File:** `apps/admin/src/lib/api/handlers/profile-links.service.ts`

**Add import:**

```typescript
import { RevalidateService } from '@/lib/services/revalidate.service';
```

**Add to methods:** `create`, `update`, `delete`, `reorder`

```typescript
await RevalidateService.revalidateLinks(['links']);
```

#### Step 4.8: Integrate into Guestbook Service

**File:** `apps/admin/src/lib/api/handlers/guestbook.service.ts`

**Add import:**

```typescript
import { RevalidateService } from '@/lib/services/revalidate.service';
```

**Add to methods:** `create`, `delete`, `toggleVisibility`

```typescript
await RevalidateService.revalidatePublic(['guestbook']);
```

#### Step 4.9: Integrate into Booking Services

**Files:**

- `apps/admin/src/lib/api/handlers/bookings.service.ts`
- `apps/admin/src/lib/api/handlers/booking-slots.service.ts`
- `apps/admin/src/lib/api/handlers/booking-availability.service.ts`

**Add import to all three:**

```typescript
import { RevalidateService } from '@/lib/services/revalidate.service';
```

**Add to all mutation methods:**

```typescript
await RevalidateService.revalidatePublic(['bookings']);
```

---

## Testing Guide

### Manual Testing Checklist

#### Test 1: Projects Revalidation

1. **Setup:**

   ```bash
   # Terminal 1
   pnpm --filter admin dev

   # Terminal 2
   pnpm --filter public dev
   ```

2. **Execute:**
   - Open browser: `http://localhost:3000/projects`
   - Note current project list
   - Open admin: `http://localhost:3001/admin/projects`
   - Create new project or edit existing one
   - Click Save

3. **Verify:**
   - Refresh `http://localhost:3000/projects`
   - ✅ New/updated project appears immediately (no 1hr wait)
   - Check terminal logs for `[Revalidate] Cache cleared for tag: projects`

#### Test 2: About Revalidation (Both Apps)

1. **Setup:**

   ```bash
   # Terminal 1
   pnpm --filter admin dev

   # Terminal 2
   pnpm --filter public dev

   # Terminal 3
   pnpm --filter links dev
   ```

2. **Execute:**
   - Open browser: `http://localhost:3000/about` (Public)
   - Open browser: `http://localhost:3002` (Links)
   - Note current info on both pages
   - Open admin: `http://localhost:3001/admin/about`
   - Update tagline or bio
   - Click Save

3. **Verify:**
   - Refresh both Public and Links apps
   - ✅ Changes appear on BOTH apps immediately
   - Check admin logs for revalidation to both URLs

#### Test 3: Links Revalidation

1. **Setup:**

   ```bash
   # Terminal 1
   pnpm --filter admin dev

   # Terminal 2
   pnpm --filter links dev
   ```

2. **Execute:**
   - Open browser: `http://localhost:3002`
   - Note current links
   - Open admin: `http://localhost:3001/admin/links`
   - Add new profile link
   - Click Save

3. **Verify:**
   - Refresh `http://localhost:3002`
   - ✅ New link appears immediately
   - Check terminal logs

#### Test 4: Error Handling (Graceful Degradation)

1. **Setup:**

   ```bash
   # Terminal 1 - Admin only
   pnpm --filter admin dev

   # Do NOT start Public or Links apps
   ```

2. **Execute:**
   - Open admin: `http://localhost:3001/admin/projects`
   - Create or update a project
   - Click Save

3. **Verify:**
   - ✅ Project saves successfully to database
   - Check admin terminal logs:
   - ✅ Should see revalidation error logged
   - ✅ Should NOT crash or block the save operation
   - Start Public app later: `pnpm --filter public dev`
   - ✅ Changes appear after ISR timer expires (fallback)

#### Test 5: Unauthorized Access Prevention

1. **Execute:**

   ```bash
   # Try to trigger revalidation without proper auth
   curl -X POST http://localhost:3000/api/revalidate \
     -H "Content-Type: application/json" \
     -d '{"tag":"projects"}'
   ```

2. **Verify:**
   - ✅ Response: `{"success":false,"error":"Unauthorized"}` (401)
   - ✅ Cache NOT cleared
   - ✅ Error logged in terminal

#### Test 6: Valid Manual Revalidation

1. **Execute:**

   ```bash
   # Get your REVALIDATION_SECRET from .env.local
   # Replace YOUR_SECRET_HERE with actual token

   curl -X POST http://localhost:3000/api/revalidate \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_SECRET_HERE" \
     -d '{"tags":["projects","blogs"]}'
   ```

2. **Verify:**
   - ✅ Response: `{"success":true,"revalidated":["projects","blogs"],"timestamp":"..."}`
   - ✅ Cache cleared for both tags
   - ✅ Success logged in terminal

### Automated Testing (Future Enhancement)

```typescript
// Example test structure (to be implemented)
describe('Cache Revalidation', () => {
  it('should revalidate public app after project update', async () => {
    // 1. Create project via Admin API
    // 2. Verify revalidation webhook was called
    // 3. Verify Public app cache was cleared
  });
});
```

---

## Troubleshooting

### Issue: Changes not appearing instantly

**Symptoms:**

- Update data in Admin
- Refresh Public/Links app
- Still seeing old data

**Diagnosis:**

1. Check Admin terminal logs:

   ```
   [Revalidate] Success for http://localhost:3000/api/revalidate
   ```

   - If missing: Check if revalidation code added to service
   - If error: Continue to next steps

2. Check Public/Links terminal logs:

   ```
   [Revalidate] Cache cleared for tag: projects
   ```

   - If missing: Revalidation request never reached the app

3. Check environment variables:

   ```bash
   # In Admin app
   echo $REVALIDATION_SECRET
   echo $PUBLIC_APP_REVALIDATION_URL

   # In Public app
   echo $REVALIDATION_SECRET
   ```

   - If empty: Environment variables not loaded

**Solutions:**

- **Restart dev servers** to load new env vars
- **Verify token matches** in Admin and Public `.env.local`
- **Check URL format**: Should include `/api/revalidate`
- **Verify service code**: Ensure `await RevalidateService.revalidatePublic()` added

### Issue: Revalidation errors in logs

**Error:** `Failed to revalidate: ECONNREFUSED`

**Cause:** Target app (Public/Links) is not running

**Solution:**

- Start the target app: `pnpm --filter public dev`
- Or accept graceful degradation (data updates on ISR timer)

**Error:** `Invalid or missing authorization token`

**Cause:** `REVALIDATION_SECRET` mismatch or missing

**Solution:**

```bash
# Verify tokens match
grep REVALIDATION_SECRET apps/admin/.env.local
grep REVALIDATION_SECRET apps/public/.env.local

# They should be identical
```

**Error:** `Server configuration error`

**Cause:** `REVALIDATION_SECRET` not set in receiver app

**Solution:**

- Add `REVALIDATION_SECRET=<token>` to `apps/public/.env.local`
- Restart the app

### Issue: Cache still using old timer

**Symptoms:**

- Revalidation works, but cache still expires after original timer

**Explanation:**

- This is **normal behavior** and **by design**
- Cache tags enable **on-demand** revalidation (instant updates)
- ISR timer provides **fallback** if webhook fails
- Both mechanisms work together (hybrid approach)

**Example:**

- Project endpoint: `revalidate: 3600, tags: ['projects']`
- On update: Webhook clears cache **instantly**
- If webhook fails: Cache expires after 1 hour **automatically**

### Issue: Development vs Production URLs

**Problem:** Production deployment uses wrong URLs

**Solution:**
Update production environment:

```bash
# .env.production (Admin)
PUBLIC_APP_REVALIDATION_URL=https://naufalrf.tech/api/revalidate
LINKS_APP_REVALIDATION_URL=https://links.naufalrf.tech/api/revalidate
```

Ensure deployment platform (Vercel, etc.) has these env vars configured.

### Debug Mode

Enable verbose logging by adding to service methods:

```typescript
// In RevalidateService.sendRevalidation()
console.log('[Revalidate] Sending to:', url);
console.log('[Revalidate] Tags:', tags);
console.log('[Revalidate] Token:', this.secret?.substring(0, 10) + '...');
```

---

## Maintenance

### Adding New Cache Tags

**Scenario:** You add a new feature (e.g., "Testimonials")

**Steps:**

1. **Public App - Add tag to endpoint:**

   ```typescript
   // apps/public/src/lib/api/endpoints/testimonials.ts
   getAll: () => {
     return fetchApi<Testimonial[]>('/api/v1/public/testimonials', {
       retries: 2,
       revalidate: 3600,
       tags: ['testimonials'], // NEW TAG
     });
   },
   ```

2. **Admin App - Add revalidation trigger:**

   ```typescript
   // apps/admin/src/lib/api/handlers/testimonials.service.ts
   import { RevalidateService } from '@/lib/services/revalidate.service';

   async create(data: CreateTestimonialInput): Promise<Testimonial> {
     const [testimonial] = await db.insert(testimonials).values({ data });

     await RevalidateService.revalidatePublic(['testimonials']); // NEW

     return testimonial;
   }
   ```

3. **Update this documentation:**
   - Add to [Cache Tag Strategy](#cache-tag-strategy) table

### Monitoring Revalidation Success

**Production Logging:**

Consider integrating with logging service (Sentry, LogRocket, etc.):

```typescript
// apps/admin/src/lib/services/revalidate.service.ts
private static async sendRevalidation(url: string | undefined, tags: string[]): Promise<void> {
  // ... existing code

  try {
    const response = await fetch(url, { /* ... */ });

    if (!response.ok) {
      // Send to error tracking
      logger.error('Revalidation failed', {
        url,
        tags,
        status: response.status,
      });
    } else {
      // Send to analytics
      logger.info('Revalidation success', {
        url,
        tags,
      });
    }
  } catch (error) {
    logger.error('Revalidation network error', { url, tags, error });
  }
}
```

### Performance Considerations

**Current Setup:**

- Revalidation happens **asynchronously** (non-blocking)
- Admin operations complete regardless of revalidation status
- Webhook timeout: Default fetch timeout (~30s)

**Optimization (if needed):**

```typescript
// Add timeout to prevent hanging
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

const response = await fetch(url, {
  method: 'POST',
  signal: controller.signal,
  // ... other options
});

clearTimeout(timeoutId);
```

### Security Best Practices

1. **Rotate Secrets Regularly:**

   ```bash
   # Generate new token
   openssl rand -hex 32

   # Update in all .env files
   # Restart all apps
   ```

2. **Use Different Secrets for Environments:**
   - Development: One token
   - Staging: Different token
   - Production: Different token

3. **Never Commit Secrets:**
   - Secrets should only be in `.env.local` (gitignored)
   - `.env.example` files should have placeholders

4. **Verify Authorization:**
   - Revalidation endpoints check `Authorization` header
   - Use Bearer token format
   - Return 401 for invalid tokens

### Scaling Considerations

**Multiple Instances (Vercel, etc.):**

- Next.js cache is **per-instance**
- Revalidation purges cache **across all instances** (Next.js handles this)
- No additional configuration needed

**CDN Caching:**

- If using CDN (Cloudflare, etc.), you may need to:
  - Purge CDN cache separately
  - Configure CDN to respect Next.js cache headers

---

## Quick Reference

### Environment Variables Summary

| Variable                      | App(s)               | Purpose                |
| ----------------------------- | -------------------- | ---------------------- |
| `REVALIDATION_SECRET`         | Admin, Public, Links | Authentication token   |
| `PUBLIC_APP_REVALIDATION_URL` | Admin                | Public app webhook URL |
| `LINKS_APP_REVALIDATION_URL`  | Admin                | Links app webhook URL  |

### Cache Tags Reference

| Tag            | Endpoint                      | Triggered By                      |
| -------------- | ----------------------------- | --------------------------------- |
| `projects`     | `/api/v1/public/projects`     | Project CRUD, ProjectContext CRUD |
| `blogs`        | `/api/v1/public/blogs`        | BlogLink CRUD                     |
| `about`        | `/api/v1/public/about`        | AboutMe update                    |
| `achievements` | `/api/v1/public/achievements` | Achievement CRUD                  |
| `links`        | `/api/v1/public/links`        | ProfileLink CRUD                  |
| `guestbook`    | `/api/v1/public/guestbook`    | GuestbookEntry CRD                |
| `bookings`     | `/api/v1/public/bookings/*`   | Booking/Slot/Availability CRUD    |

### API Endpoints

**Revalidation Endpoint (Public & Links):**

```
POST /api/revalidate
Authorization: Bearer <REVALIDATION_SECRET>
Content-Type: application/json

Body:
{
  "tag": "projects"          // Single tag
  // OR
  "tags": ["projects", "blogs"]  // Multiple tags
}

Response (Success):
{
  "success": true,
  "revalidated": ["projects"],
  "timestamp": "2024-01-27T10:30:00.000Z"
}

Response (Error):
{
  "success": false,
  "error": "Unauthorized"
}
```

### Common Commands

```bash
# Start all dev servers
pnpm --filter admin dev &
pnpm --filter public dev &
pnpm --filter links dev &

# Generate new secret
openssl rand -hex 32

# Test revalidation manually
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SECRET" \
  -d '{"tag":"projects"}'

# Check logs
# Admin terminal: Look for "[Revalidate] Success..."
# Public/Links terminal: Look for "[Revalidate] Cache cleared..."
```

---

## Appendix

### Implementation Checklist

Use this checklist to verify complete implementation:

**Phase 1: Environment**

- [ ] Generated `REVALIDATION_SECRET` token
- [ ] Updated `apps/admin/.env.local`
- [ ] Updated `apps/admin/.env.example`
- [ ] Updated `apps/public/.env.local`
- [ ] Updated `apps/public/.env.example`
- [ ] Updated `apps/links/.env.local`
- [ ] Updated `apps/links/.env.example`
- [ ] Updated `.env.production.example`

**Phase 2: Public App**

- [ ] Modified `apps/public/src/lib/api/client.ts` (tag support)
- [ ] Updated `apps/public/src/lib/api/endpoints/projects.ts`
- [ ] Updated `apps/public/src/lib/api/endpoints/blogs.ts`
- [ ] Updated `apps/public/src/lib/api/endpoints/about.ts`
- [ ] Updated `apps/public/src/lib/api/endpoints/achievements.ts`
- [ ] Updated `apps/public/src/lib/api/endpoints/links.ts`
- [ ] Updated `apps/public/src/lib/api/endpoints/guestbook.ts`
- [ ] Updated `apps/public/src/lib/api/endpoints/bookings.ts`
- [ ] Created `apps/public/app/api/revalidate/route.ts`

**Phase 3: Links App**

- [ ] Modified `apps/links/src/app/page.tsx` (removed force-dynamic, added tags)
- [ ] Created `apps/links/app/api/revalidate/route.ts`

**Phase 4: Admin App**

- [ ] Created `apps/admin/src/lib/services/revalidate.service.ts`
- [ ] Updated `apps/admin/src/lib/api/handlers/projects.service.ts`
- [ ] Updated `apps/admin/src/lib/api/handlers/project-contexts.service.ts`
- [ ] Updated `apps/admin/src/lib/api/handlers/blogs.service.ts`
- [ ] Updated `apps/admin/src/lib/api/handlers/about.service.ts`
- [ ] Updated `apps/admin/src/lib/api/handlers/achievements.service.ts`
- [ ] Updated `apps/admin/src/lib/api/handlers/profile-links.service.ts`
- [ ] Updated `apps/admin/src/lib/api/handlers/guestbook.service.ts`
- [ ] Updated `apps/admin/src/lib/api/handlers/bookings.service.ts`
- [ ] Updated `apps/admin/src/lib/api/handlers/booking-slots.service.ts`
- [ ] Updated `apps/admin/src/lib/api/handlers/booking-availability.service.ts`

**Phase 5: Testing**

- [ ] Test 1: Projects revalidation
- [ ] Test 2: About revalidation (both apps)
- [ ] Test 3: Links revalidation
- [ ] Test 4: Error handling (graceful degradation)
- [ ] Test 5: Unauthorized access prevention
- [ ] Test 6: Valid manual revalidation

---

## Support

If you encounter issues not covered in this guide:

1. Check terminal logs (Admin, Public, Links)
2. Verify environment variables are loaded
3. Test with manual curl requests
4. Review [Troubleshooting](#troubleshooting) section
5. Check Next.js documentation on [revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)

---

**Last Updated:** 2024-01-27  
**Version:** 1.0.0  
**Status:** Production Ready
