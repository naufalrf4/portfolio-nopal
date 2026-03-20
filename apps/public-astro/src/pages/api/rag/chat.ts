import type { APIRoute } from 'astro';
import { buildSubmissionProxyHeaders } from '@/lib/submission-context';

const RAG_SERVICE_URL =
  process.env.RAG_SERVICE_URL?.trim() || import.meta.env.RAG_SERVICE_URL || 'http://localhost:3005';
const RATE_LIMIT_CONFIG = {
  maxRequests: 12,
  windowMs: 60 * 1000,
};

interface RateLimitState {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitState>();

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0]?.trim();
    if (firstIp) {
      return firstIp;
    }
  }

  const realIp = request.headers.get('x-real-ip') || request.headers.get('cf-connecting-ip');
  return realIp?.trim() || 'unknown';
}

function getRateLimitState(key: string): {
  allowed: boolean;
  remaining: number;
  retryAfter: number;
} {
  const now = Date.now();
  const current = rateLimitStore.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_CONFIG.windowMs,
    });

    return {
      allowed: true,
      remaining: RATE_LIMIT_CONFIG.maxRequests - 1,
      retryAfter: Math.ceil(RATE_LIMIT_CONFIG.windowMs / 1000),
    };
  }

  if (current.count >= RATE_LIMIT_CONFIG.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  rateLimitStore.set(key, current);

  return {
    allowed: true,
    remaining: Math.max(0, RATE_LIMIT_CONFIG.maxRequests - current.count),
    retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
  };
}

function applyRateLimitHeaders(
  headers: Headers,
  rateLimitState: ReturnType<typeof getRateLimitState>
) {
  headers.set('X-RateLimit-Limit', String(RATE_LIMIT_CONFIG.maxRequests));
  headers.set('X-RateLimit-Remaining', String(rateLimitState.remaining));
  headers.set('Retry-After', String(rateLimitState.retryAfter));
}

async function proxy(request: Request, body: unknown): Promise<Response> {
  const response = await fetch(`${RAG_SERVICE_URL}/chat`, {
    method: 'POST',
    headers: buildSubmissionProxyHeaders({ request, sourcePath: '/ai-chatbot' }),
    body: JSON.stringify(body),
  });

  const payload = await response.text();
  return new Response(payload, {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export const POST: APIRoute = async ({ request }) => {
  const rateLimitState = getRateLimitState(`chat:${getClientIp(request)}`);

  if (!rateLimitState.allowed) {
    const headers = new Headers({
      'Content-Type': 'application/json',
    });
    applyRateLimitHeaders(headers, rateLimitState);

    return new Response(
      JSON.stringify({
        success: false,
        error: {
          message: 'Too many chat requests. Please wait a minute before trying again.',
          code: 'RATE_LIMITED',
        },
      }),
      {
        status: 429,
        headers,
      }
    );
  }

  try {
    const body = await request.json();
    const response = await proxy(request, body);
    applyRateLimitHeaders(response.headers, rateLimitState);
    return response;
  } catch {
    const headers = new Headers({
      'Content-Type': 'application/json',
    });
    applyRateLimitHeaders(headers, rateLimitState);

    return new Response(
      JSON.stringify({ success: false, error: { message: 'Failed to send chat request.' } }),
      {
        status: 500,
        headers,
      }
    );
  }
};
