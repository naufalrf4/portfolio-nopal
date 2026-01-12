import { NextRequest, NextResponse } from 'next/server';
import { serverErrorResponse } from '@/lib/api/responses';
import { prisma } from '@/lib/db/prisma';

const DEFAULT_LIMIT = 6;
const MAX_LIMIT = 50;

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const limitParam = searchParams.get('limit');
    const limit = limitParam
      ? Math.min(Math.max(1, parseInt(limitParam, 10) || DEFAULT_LIMIT), MAX_LIMIT)
      : DEFAULT_LIMIT;

    const where = { visible: true };

    const [blogs, total] = await Promise.all([
      prisma.blogLink.findMany({
        where,
        select: {
          id: true,
          url: true,
          title: true,
          description: true,
          imageUrl: true,
          source: true,
          publishedAt: true,
        },
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        take: limit,
      }),
      prisma.blogLink.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: blogs,
      meta: { total },
    });
  } catch {
    return serverErrorResponse();
  }
}
