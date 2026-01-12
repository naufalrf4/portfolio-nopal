import { NextRequest } from 'next/server';
import { withAdminAuth } from '@/lib/api/middleware/auth';
import {
  successResponse,
  serverErrorResponse,
  validationErrorResponse,
  notFoundResponse,
} from '@/lib/api/responses';
import { projectContextsService } from '@/lib/api/handlers/project-contexts.service';
import { updateProjectContextSchema } from '@/lib/validations/project-context.schema';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, context: RouteContext) {
  return withAdminAuth(async () => {
    try {
      const { id } = await context.params;
      const projectContext = await projectContextsService.getById(id);

      if (!projectContext) {
        return notFoundResponse('Project context');
      }

      return successResponse(projectContext);
    } catch {
      return serverErrorResponse();
    }
  })(req);
}

export async function PUT(req: NextRequest, context: RouteContext) {
  return withAdminAuth(async () => {
    try {
      const { id } = await context.params;
      const body = await req.json();
      const validated = updateProjectContextSchema.safeParse(body);

      if (!validated.success) {
        return validationErrorResponse(validated.error.format());
      }

      const existing = await projectContextsService.getById(id);
      if (!existing) {
        return notFoundResponse('Project context');
      }

      const updated = await projectContextsService.update(id, validated.data);
      return successResponse(updated, 'Project context updated successfully');
    } catch {
      return serverErrorResponse();
    }
  })(req);
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  return withAdminAuth(async () => {
    try {
      const { id } = await context.params;
      const existing = await projectContextsService.getById(id);

      if (!existing) {
        return notFoundResponse('Project context');
      }

      await projectContextsService.delete(id);
      return successResponse({ id }, 'Project context deleted successfully');
    } catch {
      return serverErrorResponse();
    }
  })(req);
}
