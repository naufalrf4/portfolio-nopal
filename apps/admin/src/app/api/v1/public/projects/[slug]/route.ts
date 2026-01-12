import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { successResponse, notFoundResponse, serverErrorResponse } from '@/lib/api/responses';

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;

    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        contexts: {
          orderBy: { order: 'asc' },
        },
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!project || !project.visible) {
      return notFoundResponse('Project');
    }

    return successResponse(project);
  } catch {
    return serverErrorResponse();
  }
}
