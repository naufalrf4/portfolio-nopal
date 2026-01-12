import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { successResponse, serverErrorResponse } from '@/lib/api/responses';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const featured = searchParams.get('featured') === 'true' ? true : undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined;
    const category = searchParams.get('category') || undefined;

    const where = {
      visible: true,
      ...(featured !== undefined && { featured }),
      ...(category && { category }),
    };

    const [projects, total, featuredCount] = await Promise.all([
      prisma.project.findMany({
        where,
        take: limit,
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
        select: {
          id: true,
          title: true,
          slug: true,
          summary: true,
          category: true,
          techStack: true,
          liveUrl: true,
          repoUrl: true,
          imageUrl: true,
          featured: true,
          createdAt: true,
        },
      }),
      prisma.project.count({ where }),
      prisma.project.count({ where: { visible: true, featured: true } }),
    ]);

    return successResponse({
      projects,
      meta: {
        total,
        featured: featuredCount,
      },
    });
  } catch {
    return serverErrorResponse();
  }
}
