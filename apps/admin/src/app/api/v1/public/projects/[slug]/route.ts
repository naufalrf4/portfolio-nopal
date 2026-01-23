import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { successResponse, notFoundResponse, serverErrorResponse } from '@/lib/api/responses';
import { signAssetUrls } from '@/lib/utils/sign-urls';

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

    const signedProject = await signAssetUrls(project, {
      fields: ['imageUrl'],
      nested: { images: ['url'] },
    });

    return successResponse(signedProject);
  } catch {
    return serverErrorResponse();
  }
}
