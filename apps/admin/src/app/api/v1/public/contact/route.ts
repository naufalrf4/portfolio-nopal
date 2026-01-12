import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db/prisma';
import {
  successResponse,
  validationErrorResponse,
  serverErrorResponse,
  errorResponse,
} from '@/lib/api/responses';
import { createHash } from 'crypto';

const publicContactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  subject: z.string().max(200).optional(),
  message: z.string().min(1).max(5000),
});

function hashIp(ip: string): string {
  return createHash('sha256').update(ip).digest('hex').slice(0, 16);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = publicContactSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error.flatten().fieldErrors);
    }

    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
    const ipHash = hashIp(ip);

    await prisma.contactForm.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        subject: parsed.data.subject || null,
        message: parsed.data.message,
        ipHash,
        read: false,
        replied: false,
      },
    });

    return successResponse({ success: true }, 'Message sent successfully');
  } catch (error) {
    if (error instanceof SyntaxError) {
      return errorResponse('Invalid JSON body', 400);
    }
    return serverErrorResponse();
  }
}
