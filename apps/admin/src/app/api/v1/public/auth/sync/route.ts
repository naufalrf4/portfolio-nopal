import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { successResponse, serverErrorResponse, validationErrorResponse } from '@/lib/api/responses';
import { z } from 'zod';
import { createId } from '@paralleldrive/cuid2';

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

    const now = new Date().toISOString();
    const [user] = await db
      .insert(users)
      .values({
        id: createId(),
        email,
        name,
        image,
        role: 'USER',
        createdAt: now,
        updatedAt: now,
      } as any)
      .onConflictDoUpdate({
        target: users.email,
        set: {
          ...(name && { name }),
          ...(image && { image }),
          updatedAt: now,
        } as any,
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        image: users.image,
      });

    return successResponse(user, 'User synced successfully');
  } catch {
    return serverErrorResponse();
  }
}
