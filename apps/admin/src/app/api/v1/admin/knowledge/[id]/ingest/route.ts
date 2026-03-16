import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import type { Session } from 'next-auth';
import { knowledgeDocsService } from '@/lib/api/handlers/knowledge-docs.service';
import { dispatchRagIngest } from '@/lib/services/ragIngest';
import {
  errorResponse,
  forbiddenResponse,
  notFoundResponse,
  successResponse,
  unauthorizedResponse,
  serverErrorResponse,
} from '@/lib/api/responses';

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

    const result = await dispatchRagIngest({
      type: 'knowledge',
      documentId: id,
    });

    if (!result.ok) {
      return errorResponse(
        result.errorMessage || 'Failed to trigger knowledge ingestion',
        result.status,
        'RAG_INGEST_FAILED',
        {
          ingest: result,
        }
      );
    }

    return successResponse(
      {
        success: true,
        chunksIngested: result.chunksIngested,
        target: 'fastapi',
      },
      'Document ingested successfully'
    );
  } catch (error) {
    return serverErrorResponse(`Failed to trigger ingestion: ${error}`);
  }
}
