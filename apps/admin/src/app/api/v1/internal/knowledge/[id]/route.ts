import { NextRequest } from 'next/server';
import { knowledgeDocsService } from '@/lib/api/handlers/knowledge-docs.service';
import {
  successResponse,
  notFoundResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from '@/lib/api/responses';

const ADMIN_SERVICE_TOKEN = process.env.ADMIN_SERVICE_TOKEN;

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, context: RouteContext) {
  const token = _req.headers.get('X-Service-Token');
  if (!token || token !== ADMIN_SERVICE_TOKEN) {
    return unauthorizedResponse('Invalid service token');
  }

  try {
    const { id } = await context.params;
    const doc = await knowledgeDocsService.getById(id);

    if (!doc) {
      return notFoundResponse('Knowledge document');
    }

    return successResponse(doc);
  } catch {
    return serverErrorResponse('Failed to fetch knowledge document');
  }
}
