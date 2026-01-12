import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { successResponse, serverErrorResponse, validationErrorResponse } from '@/lib/api/responses';
import { z } from 'zod';

const syncUserSchema = z.object({
  email: z.string().email('Invalid email'),
  name: z.string().optional(),
  image: z.string().url().optional().nullable(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = syncUserSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error.flatten().fieldErrors);
    }

    const { email, name, image } = parsed.data;

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name: name || undefined,
        image: image || undefined,
      },
      create: {
        email,
        name,
        image,
        role: 'USER',
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
      },
    });

    return successResponse(user, 'User synced successfully');
  } catch {
    return serverErrorResponse();
  }
}
