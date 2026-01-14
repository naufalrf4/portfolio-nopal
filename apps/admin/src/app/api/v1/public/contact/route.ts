import { NextRequest } from 'next/server';
import { successResponse, serverErrorResponse, validationErrorResponse } from '@/lib/api/responses';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';
import { getIpLocation } from '@/lib/services/geoIpService';
import { hashIp } from '@/lib/utils/hash';

const createContactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  subject: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
  turnstileToken: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createContactSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error.flatten().fieldErrors);
    }

    const forwarded = request.headers.get('x-forwarded-for');
    const clientIp = forwarded?.split(',')[0]?.trim() || 'unknown';
    const geoLocation = getIpLocation(clientIp);
    const ipHash = hashIp(clientIp);

    const contact = await prisma.contactForm.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        subject: parsed.data.subject || null,
        message: parsed.data.message,
        ipHash,
        ipAddress: clientIp !== 'unknown' ? clientIp : null,
        countryCode: geoLocation?.countryCode || null,
        country: geoLocation?.country || null,
        city: geoLocation?.city || null,
        region: geoLocation?.region || null,
        read: false,
        replied: false,
      },
    });

    return successResponse(contact, 'Message sent successfully');
  } catch {
    return serverErrorResponse();
  }
}
