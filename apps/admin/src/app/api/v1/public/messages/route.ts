import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db/prisma';
import {
  successResponse,
  validationErrorResponse,
  serverErrorResponse,
  errorResponse,
} from '@/lib/api/responses';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/services/rate-limiter';
import { getIpLocation } from '@/lib/services/geoIpService';
import { createHash } from 'crypto';
import { verifyTurnstileToken, isTurnstileConfigured } from '@/lib/services/turnstile';

const publicMessageSchema = z.object({
  content: z
    .string()
    .min(1, 'Message is required')
    .max(500, 'Message must be 500 characters or less'),
  turnstileToken: z.string().min(1, 'CAPTCHA verification is required'),
});

const RATE_LIMIT_CONFIG = {
  maxRequests: 5,
  windowMs: 60 * 1000,
};

function hashIp(ip: string): string {
  return createHash('sha256').update(ip).digest('hex').slice(0, 16);
}

export async function POST(request: NextRequest) {
  try {
    const forwarded = request.headers.get('x-forwarded-for');
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
    const ipHash = hashIp(clientIp);

    const rateLimitResult = checkRateLimit(`messages:${ipHash}`, RATE_LIMIT_CONFIG);
    const rateLimitHeaders = getRateLimitHeaders(rateLimitResult);

    if (!rateLimitResult.allowed) {
      const response = NextResponse.json(
        {
          success: false,
          error: {
            message: 'Too many requests. Please try again later.',
            code: 'RATE_LIMITED',
          },
        },
        { status: 429 }
      );

      Object.entries(rateLimitHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      return response;
    }

    const body = await request.json();
    const parsed = publicMessageSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error.flatten().fieldErrors);
    }

    const { content, turnstileToken } = parsed.data;

    if (isTurnstileConfigured() && turnstileToken) {
      const turnstileResult = await verifyTurnstileToken(turnstileToken);

      if (!turnstileResult.success) {
        return errorResponse(
          'CAPTCHA verification failed. Please try again.',
          400,
          'TURNSTILE_VERIFICATION_FAILED'
        );
      }
    }

    const geoLocation = getIpLocation(clientIp);

    const messageData: {
      content: string;
      ipHash: string;
      ipAddress: string;
      read: boolean;
      countryCode?: string;
      country?: string;
      city?: string;
      region?: string;
    } = {
      content,
      ipHash,
      ipAddress: clientIp,
      read: false,
    };

    if (geoLocation) {
      if (geoLocation.countryCode) messageData.countryCode = geoLocation.countryCode;
      if (geoLocation.country) messageData.country = geoLocation.country;
      if (geoLocation.city) messageData.city = geoLocation.city;
      if (geoLocation.region) messageData.region = geoLocation.region;
    }

    await prisma.anonymousMessage.create({ data: messageData });

    const response = successResponse({ success: true }, 'Message sent successfully');

    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    if (error instanceof SyntaxError) {
      return errorResponse('Invalid JSON body', 400);
    }
    return serverErrorResponse();
  }
}
