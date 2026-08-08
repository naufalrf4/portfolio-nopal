import type { APIRoute } from 'astro';
import { buildSubmissionProxyHeaders } from '@/lib/submission-context';

const RAG_SERVICE_URL =
  process.env.RAG_SERVICE_URL?.trim() || import.meta.env.RAG_SERVICE_URL?.trim() || 'http://localhost:3005';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const response = await fetch(`${RAG_SERVICE_URL}/chat/confirm`, {
      method: 'POST',
      headers: buildSubmissionProxyHeaders({ request, sourcePath: '/ai-chatbot' }),
      body: JSON.stringify(body),
    });

    const payload = await response.text();
    return new Response(payload, {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(
      JSON.stringify({ success: false, message: 'Failed to confirm action.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
