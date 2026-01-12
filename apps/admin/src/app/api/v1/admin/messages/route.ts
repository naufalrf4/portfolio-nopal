import { NextRequest } from 'next/server';
import { withAdminAuth } from '@/lib/api/middleware/auth';
import { anonymousMessagesService } from '@/lib/api/handlers/anonymous-messages.service';
import { successResponse, serverErrorResponse, validationErrorResponse } from '@/lib/api/responses';
import { createAnonymousMessageSchema } from '@/lib/validations/anonymous-message.schema';
import { getIpLocation } from '@/lib/services/geoIpService';
import { prisma } from '@/lib/db/prisma';

async function handleGet(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const readParam = searchParams.get('read');

    const filters = readParam !== null ? { read: readParam === 'true' } : undefined;

    const result = await anonymousMessagesService.getAll(filters);
    return successResponse(result);
  } catch {
    return serverErrorResponse();
  }
}

async function handlePost(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createAnonymousMessageSchema.parse(body);

    const forwarded = req.headers.get('x-forwarded-for');
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : '0.0.0.0';

    const geoLocation = getIpLocation(clientIp);

    const data: any = {
      content: parsed.content,
      ipHash: parsed.ipHash,
      ipAddress: clientIp,
    };

    if (geoLocation) {
      if (geoLocation.countryCode) data.countryCode = geoLocation.countryCode;
      if (geoLocation.country) data.country = geoLocation.country;
      if (geoLocation.city) data.city = geoLocation.city;
      if (geoLocation.region) data.region = geoLocation.region;
    }

    const message = await prisma.anonymousMessage.create({ data });

    return successResponse(message, 'Message sent successfully');
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return validationErrorResponse(error);
    }
    return serverErrorResponse();
  }
}

export const GET = withAdminAuth(handleGet);
export const POST = handlePost;
