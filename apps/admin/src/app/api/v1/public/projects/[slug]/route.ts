import { NextRequest } from 'next/server';
import { successResponse, serverErrorResponse, notFoundResponse } from '@/lib/api/responses';
import { projectsService } from '@/lib/api/handlers/projects.service';

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const project = await projectsService.getBySlug(slug);

    if (!project || !project.visible) {
      return notFoundResponse('Project');
    }

    return successResponse(project);
  } catch {
    return serverErrorResponse();
  }
}
