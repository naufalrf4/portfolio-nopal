import { NextRequest } from 'next/server';
import { withAdminAuth } from '@/lib/api/middleware/auth';
import { successResponse, serverErrorResponse } from '@/lib/api/responses';
import { prisma } from '@/lib/db/prisma';

interface LocationStat {
  countryCode: string;
  count: number;
}

async function handleGet(req: NextRequest) {
  try {
    const messages = await prisma.anonymousMessage.findMany({
      where: {
        countryCode: {
          not: null,
        },
      },
      select: {
        countryCode: true,
      },
    });

    const locationStats = messages.reduce(
      (acc, message) => {
        const code = message.countryCode as string;
        acc[code] = (acc[code] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const result = Object.entries(locationStats)
      .map(
        ([countryCode, count]) =>
          ({
            countryCode,
            count,
          }) as LocationStat
      )
      .sort((a, b) => b.count - a.count);

    return successResponse(result);
  } catch {
    return serverErrorResponse();
  }
}

export const GET = withAdminAuth(handleGet);
