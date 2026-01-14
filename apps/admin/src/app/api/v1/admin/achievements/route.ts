import { NextRequest } from 'next/server';
import { withAdminAuth } from '@/lib/api/middleware/auth';
import { achievementsService } from '@/lib/api/handlers/achievements.service';
import { successResponse, validationErrorResponse, serverErrorResponse } from '@/lib/api/responses';
import {
  createAchievementSchema,
  achievementQuerySchema,
} from '@/lib/validations/achievement.schema';

async function handleGet(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const validation = achievementQuerySchema.safeParse(queryParams);
    if (!validation.success) {
      return validationErrorResponse(validation.error.format());
    }

    const achievements = await achievementsService.getAll(validation.data);
    return successResponse({ achievements });
  } catch {
    return serverErrorResponse();
  }
}

async function handlePost(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = createAchievementSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.format());
    }

    const achievement = await achievementsService.create(validation.data);
    return successResponse(achievement, 'Achievement created successfully');
  } catch {
    return serverErrorResponse();
  }
}

export const GET = withAdminAuth(handleGet);
export const POST = withAdminAuth(handlePost);
