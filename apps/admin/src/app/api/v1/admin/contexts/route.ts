import { NextRequest } from 'next/server';
import { withAdminAuth } from '@/lib/api/middleware/auth';
import { successResponse, serverErrorResponse, validationErrorResponse } from '@/lib/api/responses';
import { projectContextsService } from '@/lib/api/handlers/project-contexts.service';
import {
  createProjectContextSchema,
  projectContextQuerySchema,
} from '@/lib/validations/project-context.schema';

async function handleGet(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const queryData = {
      projectId: searchParams.get('projectId') || undefined,
      type: searchParams.get('type') || undefined,
    };

    const validated = projectContextQuerySchema.safeParse(queryData);
    if (!validated.success) {
      return validationErrorResponse(validated.error.format());
    }

    const contexts = await projectContextsService.getAll(validated.data);
    return successResponse(contexts);
  } catch {
    return serverErrorResponse();
  }
}

async function handlePost(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = createProjectContextSchema.safeParse(body);

    if (!validated.success) {
      return validationErrorResponse(validated.error.format());
    }

    const context = await projectContextsService.create(validated.data);
    return successResponse(context, 'Project context created successfully');
  } catch (error) {
    if (error instanceof Error && error.message === 'Project not found') {
      return validationErrorResponse({ projectId: 'Project not found' });
    }
    return serverErrorResponse();
  }
}

export async function GET(req: NextRequest) {
  return withAdminAuth(handleGet)(req);
}

export async function POST(req: NextRequest) {
  return withAdminAuth(handlePost)(req);
}
