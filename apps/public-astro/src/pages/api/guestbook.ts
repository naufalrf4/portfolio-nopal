import type { APIRoute } from 'astro';
import { buildSubmissionProxyHeaders } from '@/lib/submission-context';

const ADMIN_API_URL = import.meta.env.ADMIN_API_URL || 'http://localhost:3001';

async function proxy(request: Request, method: 'GET' | 'POST', body?: unknown): Promise<Response> {
  const timezone =
    body && typeof body === 'object' && 'timezone' in body && typeof body.timezone === 'string'
      ? body.timezone
      : undefined;

  const response = await fetch(`${ADMIN_API_URL}/api/v1/public/guestbook`, {
    method,
    headers: buildSubmissionProxyHeaders({ request, sourcePath: '/#guestbook', timezone }),
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = await response.text();
  return new Response(payload, {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export const GET: APIRoute = async ({ request }) => {
  try {
    return await proxy(request, 'GET');
  } catch {
    return new Response(JSON.stringify({ entries: [] }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    return await proxy(request, 'POST', body);
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: { message: 'Failed to submit guestbook entry.' } }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
