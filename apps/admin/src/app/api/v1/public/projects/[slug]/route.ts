import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

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
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Project not found',
            code: 'NOT_FOUND',
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Internal server error',
          code: 'INTERNAL_ERROR',
        },
      },
      { status: 500 }
    );
  }
}
