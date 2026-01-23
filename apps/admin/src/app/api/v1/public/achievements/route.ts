import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { successResponse, serverErrorResponse } from '@/lib/api/responses';
import { signStringArray } from '@/lib/utils/sign-urls';

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const limitParam = searchParams.get('limit');
    const limit = limitParam
      ? Math.min(Math.max(1, parseInt(limitParam, 10) || DEFAULT_LIMIT), MAX_LIMIT)
      : undefined;

    const where = { visible: true };

    const [achievements, total] = await Promise.all([
      prisma.achievement.findMany({
        where,
        select: {
          id: true,
          name: true,
          location: true,
          monthYear: true,
          photos: true,
          description: true,
          externalUrl: true,
          order: true,
          createdAt: true,
        },
        orderBy: { order: 'asc' },
        take: limit,
      }),
      prisma.achievement.count({ where }),
    ]);

    const signedAchievements = await Promise.all(
      achievements.map(async (achievement) => ({
        ...achievement,
        photos: await signStringArray(achievement.photos),
      }))
    );

    return successResponse({ achievements: signedAchievements, meta: { total } });
  } catch {
    return serverErrorResponse();
  }
}
