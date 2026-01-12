import { NextRequest } from 'next/server';
import { withAdminAuth } from '@/lib/api/middleware/auth';
import { projectsService } from '@/lib/api/handlers/projects.service';
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  serverErrorResponse,
} from '@/lib/api/responses';
import { projectQuerySchema, createProjectSchema } from '@/lib/validations/project.schema';

async function handleGet(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const validation = projectQuerySchema.safeParse(queryParams);
    if (!validation.success) {
      return validationErrorResponse(validation.error.format());
    }

    const result = await projectsService.getAll(validation.data);
    return successResponse(result);
  } catch {
    return serverErrorResponse();
  }
}

async function handlePost(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = createProjectSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.format());
    }

    const slugExists = await projectsService.checkSlugExists(validation.data.slug);
    if (slugExists) {
      return errorResponse('Project with this slug already exists', 409, 'SLUG_EXISTS');
    }

    const project = await projectsService.create(validation.data);
    return successResponse(project, 'Project created successfully');
  } catch {
    return serverErrorResponse();
  }
}

export const GET = withAdminAuth(handleGet);
export const POST = withAdminAuth(handlePost);
