import { NextRequest } from 'next/server';
import { auth } from '@naufalrf/auth';
import type { Session } from 'next-auth';
import { knowledgeDocsService } from '@/lib/api/handlers/knowledge-docs.service';
import {
  successResponse,
  validationErrorResponse,
  notFoundResponse,
  serverErrorResponse,
  unauthorizedResponse,
  forbiddenResponse,
} from '@/lib/api/responses';
import { updateKnowledgeDocSchema } from '@/lib/validations/knowledge.schema';

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

export async function GET(_req: NextRequest, context: RouteContext) {
  const authCheck = await checkAdminAuth();
  if (!authCheck.authorized) return authCheck.response!;

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

export async function PUT(req: NextRequest, context: RouteContext) {
  const authCheck = await checkAdminAuth();
  if (!authCheck.authorized) return authCheck.response!;

  try {
    const { id } = await context.params;
    const body = await req.json();
    const validation = updateKnowledgeDocSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.format());
    }

    const existing = await knowledgeDocsService.getById(id);
    if (!existing) {
      return notFoundResponse('Knowledge document');
    }

    if (validation.data.filename && validation.data.filename !== existing.filename) {
      const duplicate = await knowledgeDocsService.getByFilename(validation.data.filename);
      if (duplicate) {
        return validationErrorResponse({ filename: { _errors: ['Filename already exists'] } });
      }
    }

    const doc = await knowledgeDocsService.update(id, validation.data);
    return successResponse(doc, 'Knowledge document updated');
  } catch {
    return serverErrorResponse('Failed to update knowledge document');
  }
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  const authCheck = await checkAdminAuth();
  if (!authCheck.authorized) return authCheck.response!;

  try {
    const { id } = await context.params;
    const existing = await knowledgeDocsService.getById(id);

    if (!existing) {
      return notFoundResponse('Knowledge document');
    }

    await knowledgeDocsService.delete(id);
    return successResponse({ success: true }, 'Knowledge document deleted');
  } catch {
    return serverErrorResponse('Failed to delete knowledge document');
  }
}
