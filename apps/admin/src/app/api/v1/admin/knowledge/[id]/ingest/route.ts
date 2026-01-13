import { NextRequest } from 'next/server';
import { auth } from '@naufalrf/auth';
import type { Session } from 'next-auth';
import { knowledgeDocsService } from '@/lib/api/handlers/knowledge-docs.service';
import {
  successResponse,
  notFoundResponse,
  serverErrorResponse,
  unauthorizedResponse,
  forbiddenResponse,
} from '@/lib/api/responses';

const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || 'http://localhost:3004';
const ADMIN_SERVICE_TOKEN = process.env.ADMIN_SERVICE_TOKEN;

interface RouteContext {
  params: Promise<{ id: string }>;
}

async function checkAdminAuth(): Promise<{ authorized: boolean; response?: Response }> {
  const session = (await auth()) as Session | null;
  if (!session?.user) {
    return { authorized: false, response: unauthorizedResponse() };
  }
  const userRole = (session.user as { role?: string }).role;
  if (userRole !== 'ADMIN') {
    return { authorized: false, response: forbiddenResponse('Admin access required') };
  }
  return { authorized: true };
}

export async function POST(_req: NextRequest, context: RouteContext) {
  const authCheck = await checkAdminAuth();
  if (!authCheck.authorized) return authCheck.response!;

  try {
    const { id } = await context.params;
    const doc = await knowledgeDocsService.getById(id);

    if (!doc) {
      return notFoundResponse('Knowledge document');
    }

    const response = await fetch(`${RAG_SERVICE_URL}/ingest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Service-Token': ADMIN_SERVICE_TOKEN || '',
      },
      body: JSON.stringify({
        type: 'knowledge',
        documentId: id,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return serverErrorResponse(`RAG ingestion failed: ${error}`);
    }

    const result = await response.json();
    return successResponse(
      {
        success: true,
        chunksIngested: result.data?.chunksIngested || 0,
      },
      'Document ingested successfully'
    );
  } catch (error) {
    return serverErrorResponse(`Failed to trigger ingestion: ${error}`);
  }
}
