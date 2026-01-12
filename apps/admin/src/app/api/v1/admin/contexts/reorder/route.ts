import { NextRequest } from 'next/server';
import { withAdminAuth } from '@/lib/api/middleware/auth';
import { successResponse, serverErrorResponse, validationErrorResponse } from '@/lib/api/responses';
import { projectContextsService } from '@/lib/api/handlers/project-contexts.service';
import { reorderProjectContextsSchema } from '@/lib/validations/project-context.schema';

async function handlePost(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = reorderProjectContextsSchema.safeParse(body);

    if (!validated.success) {
      return validationErrorResponse(validated.error.format());
    }

    const contexts = await projectContextsService.reorder(validated.data);
    return successResponse(contexts, 'Project contexts reordered successfully');
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Project not found') {
        return validationErrorResponse({ projectId: 'Project not found' });
      }
      if (error.message.includes('invalid or do not belong')) {
        return validationErrorResponse({ contextIds: error.message });
      }
    }
    return serverErrorResponse();
  }
}

export async function POST(req: NextRequest) {
  return withAdminAuth(handlePost)(req);
}
