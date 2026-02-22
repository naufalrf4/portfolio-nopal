# API Documentation

This document provides comprehensive documentation for all public API endpoints in the NaufalRF Portfolio Ecosystem.

## Base URL

All API endpoints are served from the Admin application:

- **Development**: `http://localhost:3001/api`
- **Production**: `https://admin.naufalrf.tech/api`

## API Versioning

All endpoints are versioned with the prefix `/v1`:

```
/api/v1/public/*
/api/v1/public-write/*
/api/v1/user/*
/api/v1/admin/*
/api/v1/internal/*
```

## Authentication

### Public Endpoints

Public read endpoints (`/api/v1/public/*`) do not require authentication.

### Public Write Endpoints

Public write endpoints (`/api/v1/public-write/*`) may require authentication depending on the endpoint:

- Guestbook: Requires Google OAuth
- Anonymous messages: No authentication (rate-limited by IP)
- Contact form: No authentication (rate-limited by IP)

### User Endpoints

User endpoints (`/api/v1/user/*`) require Google OAuth authentication.

**Headers:**

```
Authorization: Bearer <jwt-token>
```

Or use session cookies from NextAuth.js.

### Admin Endpoints

Admin endpoints (`/api/v1/admin/*`) require Google OAuth authentication with an allowlisted email.

**Allowlist Configuration:**

```bash
ADMIN_EMAILS="admin@example.com,another@example.com"
```

### Internal Endpoints

Internal endpoints (`/api/v1/internal/*`) require a service token.

**Headers:**

```
X-Service-Token: <service-token>
```

## Rate Limiting

| Endpoint Type | Limit         | Window     | Identifier    |
| ------------- | ------------- | ---------- | ------------- |
| Public Read   | 100 requests  | 60 seconds | IP Address    |
| Public Write  | 10 requests   | 60 seconds | IP Address    |
| User          | 60 requests   | 60 seconds | User ID       |
| Admin         | 120 requests  | 60 seconds | User ID       |
| Internal      | 1000 requests | 60 seconds | Service Token |

**Rate Limit Headers:**

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "requestId": "req_abc123",
    "timestamp": "2024-01-20T15:00:00.000Z"
  }
}
```

### List Response

```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    },
    "requestId": "req_abc123",
    "timestamp": "2024-01-20T15:00:00.000Z"
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format",
        "code": "invalid_string"
      }
    ],
    "requestId": "req_abc123",
    "timestamp": "2024-01-20T15:00:00.000Z"
  }
}
```

## Error Codes

| Code                  | Status | Description                       |
| --------------------- | ------ | --------------------------------- |
| `VALIDATION_ERROR`    | 400    | Invalid request parameters        |
| `UNAUTHORIZED`        | 401    | Missing or invalid authentication |
| `FORBIDDEN`           | 403    | Insufficient permissions          |
| `NOT_FOUND`           | 404    | Resource not found                |
| `CONFLICT`            | 409    | Resource already exists           |
| `RATE_LIMIT_EXCEEDED` | 429    | Too many requests                 |
| `INTERNAL_ERROR`      | 500    | Server error                      |

## Public Endpoints

### About

#### Get About Information

```http
GET /api/v1/public/about
```

**Response:**

```json
{
  "success": true,
  "data": {
    "fullName": "Naufal RF",
    "tagline": "Full-Stack Engineer",
    "roles": ["Software Engineer", "System Architect"],
    "bio": "Passionate about building scalable systems...",
    "email": "hello@naufalrf.tech",
    "location": "Jakarta, Indonesia",
    "avatarUrl": "https://example.com/avatar.jpg",
    "resumeUrl": "https://example.com/resume.pdf",
    "skills": ["TypeScript", "React", "Node.js"],
    "experience": [
      {
        "type": "work",
        "title": "Senior Software Engineer",
        "organization": "Tech Company",
        "location": "Remote",
        "startDate": "2022-01",
        "endDate": null,
        "description": "Leading development of...",
        "logoUrl": "https://example.com/logo.png",
        "skills": ["TypeScript", "React"]
      }
    ],
    "socialLinks": [
      {
        "platform": "github",
        "url": "https://github.com/username",
        "icon": "github"
      }
    ]
  }
}
```

### Projects

#### List Projects

```http
GET /api/v1/public/projects
```

**Query Parameters:**

- `page` (number, default: 1): Page number
- `limit` (number, default: 10, max: 100): Items per page
- `category` (string, optional): Filter by category
- `featured` (boolean, optional): Filter featured projects
- `sort` (string, default: "order"): Sort field
- `order` (string, default: "asc"): Sort order (asc/desc)

**Example:**

```http
GET /api/v1/public/projects?featured=true&limit=3
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "clx1234567890abcdef",
      "title": "E-Commerce Platform",
      "slug": "ecommerce-platform",
      "summary": "Full-stack e-commerce solution with Next.js",
      "description": "Detailed description...",
      "category": "Web Application",
      "techStack": ["Next.js", "TypeScript", "Drizzle ORM"],
      "imageUrl": "https://example.com/project.jpg",
      "liveUrl": "https://example.com",
      "repoUrl": "https://github.com/username/project",
      "featured": true,
      "visible": true,
      "order": 0,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-20T14:22:00.000Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### Get Project by Slug

```http
GET /api/v1/public/projects/:slug
```

**Parameters:**

- `slug` (string, required): Project slug

**Example:**

```http
GET /api/v1/public/projects/ecommerce-platform
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "clx1234567890abcdef",
    "title": "E-Commerce Platform",
    "slug": "ecommerce-platform",
    "summary": "Full-stack e-commerce solution",
    "description": "# E-Commerce Platform\n\nDetailed markdown description...",
    "category": "Web Application",
    "techStack": ["Next.js", "TypeScript", "Drizzle ORM"],
    "imageUrl": "https://example.com/project.jpg",
    "liveUrl": "https://example.com",
    "repoUrl": "https://github.com/username/project",
    "featured": true,
    "visible": true,
    "order": 0,
    "contexts": [
      {
        "id": "ctx_123",
        "type": "CONTEXT",
        "title": "Project Background",
        "content": "The project was initiated to...",
        "order": 1
      },
      {
        "id": "ctx_124",
        "type": "ROLE",
        "title": "My Role",
        "content": "As the lead developer...",
        "order": 2
      }
    ],
    "images": [
      {
        "id": "img_123",
        "url": "https://example.com/screenshot1.jpg",
        "alt": "Dashboard view",
        "order": 1
      }
    ],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-20T14:22:00.000Z"
  }
}
```

### Blog Links

#### List Blog Links

```http
GET /api/v1/public/blogs
```

**Query Parameters:**

- `page` (number, default: 1): Page number
- `limit` (number, default: 10, max: 100): Items per page
- `source` (string, optional): Filter by source (medium, dev.to, hashnode)
- `sort` (string, default: "publishedAt"): Sort field
- `order` (string, default: "desc"): Sort order

**Example:**

```http
GET /api/v1/public/blogs?source=medium&limit=5
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "blog_123",
      "url": "https://medium.com/@username/article",
      "title": "Building Scalable Applications",
      "description": "A deep dive into...",
      "imageUrl": "https://example.com/blog-cover.jpg",
      "source": "medium",
      "publishedAt": "2024-01-10T00:00:00.000Z",
      "visible": true,
      "order": 1,
      "createdAt": "2024-01-11T10:00:00.000Z",
      "updatedAt": "2024-01-11T10:00:00.000Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 15,
      "totalPages": 2,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### Guestbook

#### List Guestbook Entries

```http
GET /api/v1/public/guestbook
```

**Query Parameters:**

- `page` (number, default: 1): Page number
- `limit` (number, default: 20, max: 100): Items per page

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "guest_123",
      "message": "Great portfolio! Love the design.",
      "visible": true,
      "createdAt": "2024-01-20T10:00:00.000Z",
      "updatedAt": "2024-01-20T10:00:00.000Z",
      "user": {
        "id": "user_123",
        "name": "John Doe",
        "image": "https://example.com/avatar.jpg"
      },
      "reactions": [
        {
          "type": "LIKE",
          "count": 5
        },
        {
          "type": "HEART",
          "count": 3
        }
      ]
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### Profile Links

#### List Profile Links

```http
GET /api/v1/public/profile-links
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "link_123",
      "label": "GitHub",
      "url": "https://github.com/username",
      "icon": "github",
      "visible": true,
      "order": 1,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "link_124",
      "label": "LinkedIn",
      "url": "https://linkedin.com/in/username",
      "icon": "linkedin",
      "visible": true,
      "order": 2,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## Public Write Endpoints

### Guestbook

#### Create Guestbook Entry

```http
POST /api/v1/public-write/guestbook
```

**Authentication:** Required (Google OAuth)

**Request Body:**

```json
{
  "message": "Great portfolio! Love the design."
}
```

**Validation:**

- `message`: Required, 1-1000 characters, trimmed

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "guest_123",
    "message": "Great portfolio! Love the design.",
    "visible": true,
    "createdAt": "2024-01-20T10:00:00.000Z",
    "user": {
      "id": "user_123",
      "name": "John Doe",
      "image": "https://example.com/avatar.jpg"
    }
  }
}
```

**Errors:**

- `401 UNAUTHORIZED`: User not authenticated
- `400 VALIDATION_ERROR`: Invalid message format
- `429 RATE_LIMIT_EXCEEDED`: Too many submissions (5 per hour)

#### Add Reaction to Guestbook Entry

```http
POST /api/v1/public-write/guestbook/:id/reactions
```

**Authentication:** Required (Google OAuth)

**Parameters:**

- `id` (string, required): Guestbook entry ID

**Request Body:**

```json
{
  "type": "HEART"
}
```

**Reaction Types:**

- `LIKE`
- `HEART`
- `FIRE`
- `CLAP`
- `LAUGH`

**Response:**

```json
{
  "success": true,
  "data": {
    "entryId": "guest_123",
    "reactions": [
      {
        "type": "LIKE",
        "count": 5
      },
      {
        "type": "HEART",
        "count": 4
      }
    ]
  }
}
```

### Anonymous Messages

#### Submit Anonymous Message

```http
POST /api/v1/public-write/messages
```

**Authentication:** None (rate-limited by IP)

**Request Body:**

```json
{
  "content": "Just wanted to say your projects are inspiring!"
}
```

**Validation:**

- `content`: Required, 1-1000 characters, trimmed

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "Message submitted successfully"
  }
}
```

**Errors:**

- `400 VALIDATION_ERROR`: Invalid message content
- `429 RATE_LIMIT_EXCEEDED`: Too many submissions (5 per hour per IP)

### Contact Form

#### Submit Contact Form

```http
POST /api/v1/public-write/contact
```

**Authentication:** None (rate-limited by IP)

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "I'd like to discuss a potential project...",
  "turnstileToken": "0x4AAAAAAA..."
}
```

**Validation:**

- `name`: Required, 1-100 characters
- `email`: Required, valid email format
- `subject`: Required, 1-200 characters
- `message`: Required, 1-5000 characters
- `turnstileToken`: Required (Cloudflare Turnstile)

**Response:**

```json
{
  "success": true,
  "data": {
    "message": "Message sent successfully"
  }
}
```

**Errors:**

- `400 VALIDATION_ERROR`: Invalid form data
- `400 INVALID_CAPTCHA`: Invalid Turnstile token
- `429 RATE_LIMIT_EXCEEDED`: Too many submissions (3 per hour per IP)

## User Endpoints

### Profile

#### Get Current User Profile

```http
GET /api/v1/user/me
```

**Authentication:** Required (Google OAuth)

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "image": "https://example.com/avatar.jpg",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Guestbook

#### Get User's Guestbook Entries

```http
GET /api/v1/user/guestbook
```

**Authentication:** Required (Google OAuth)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "guest_123",
      "message": "Great portfolio!",
      "visible": true,
      "createdAt": "2024-01-20T10:00:00.000Z",
      "reactions": [
        {
          "type": "LIKE",
          "count": 5
        }
      ]
    }
  ]
}
```

#### Delete Own Guestbook Entry

```http
DELETE /api/v1/user/guestbook/:id
```

**Authentication:** Required (Google OAuth)

**Parameters:**

- `id` (string, required): Guestbook entry ID

**Response:**

```json
{
  "success": true,
  "data": {
    "deleted": true
  }
}
```

**Errors:**

- `403 FORBIDDEN`: Cannot delete entry owned by another user
- `404 NOT_FOUND`: Entry not found

## Admin Endpoints

Admin endpoints are documented separately for security reasons. Contact the administrator for access to admin API documentation.

## Internal Endpoints

Internal endpoints are for service-to-service communication only and require a service token. These are not publicly documented.

## Code Examples

### JavaScript/TypeScript

```typescript
// Using fetch
const response = await fetch('https://admin.naufalrf.tech/api/v1/public/projects', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
});

const data = await response.json();

if (data.success) {
  console.log('Projects:', data.data);
} else {
  console.error('Error:', data.error);
}
```

### Using the SDK

```typescript
import { createApiClient } from '@repo/sdk';

const client = createApiClient({
  baseUrl: 'https://admin.naufalrf.tech/api',
});

// List projects
const projects = await client.projects.list({
  featured: true,
  limit: 3,
});

// Get project by slug
const project = await client.projects.getBySlug('ecommerce-platform');

// Create guestbook entry (requires auth)
const entry = await client.guestbook.create({
  message: 'Great portfolio!',
});
```

### cURL

```bash
# List projects
curl -X GET "https://admin.naufalrf.tech/api/v1/public/projects?featured=true&limit=3"

# Get project by slug
curl -X GET "https://admin.naufalrf.tech/api/v1/public/projects/ecommerce-platform"

# Submit anonymous message
curl -X POST "https://admin.naufalrf.tech/api/v1/public-write/messages" \
  -H "Content-Type: application/json" \
  -d '{"content":"Great work!"}'
```

## Webhooks

Webhooks are not currently supported but may be added in future versions.

## Changelog

### v1.0.0 (2024-01-20)

- Initial API release
- Public read endpoints for projects, blogs, guestbook
- Public write endpoints for guestbook and anonymous messages
- User endpoints for profile and guestbook management
- Admin endpoints for content management

## Support

For API support or questions:

- Email: hello@naufalrf.tech
- GitHub Issues: [Create an issue](https://github.com/yourusername/naufalrf-portfolio/issues)
