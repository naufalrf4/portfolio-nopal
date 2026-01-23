import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { successResponse, serverErrorResponse } from '@/lib/api/responses';
import { signAssetUrlsMany } from '@/lib/utils/sign-urls';

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
          images: {
            select: {
              id: true,
              url: true,
              order: true,
              alt: true,
              caption: true,
            },
            orderBy: {
              order: 'asc',
            },
          },
        },
      }),
      prisma.project.count({ where }),
      prisma.project.count({ where: { visible: true, featured: true } }),
    ]);

    const signedProjects = await signAssetUrlsMany(projects, {
      fields: ['imageUrl'],
      nested: { images: ['url'] },
    });

    return successResponse({
      projects: signedProjects,
      meta: {
        total,
        featured: featuredCount,
      },
    });
  } catch {
    return serverErrorResponse();
  }
}
