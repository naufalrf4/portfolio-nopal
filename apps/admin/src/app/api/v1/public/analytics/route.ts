import { NextRequest } from 'next/server';
import { successResponse, serverErrorResponse, validationErrorResponse } from '@/lib/api/responses';
import { analyticsService } from '@/lib/api/handlers/analytics.service';
import { getSubmissionContext } from '@/lib/api/submission-context';
import { publicAnalyticsEventSchema } from '@/lib/validations/analytics.schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = publicAnalyticsEventSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error.flatten().fieldErrors);
    }

    const submissionContext = getSubmissionContext(request);

    const event = await analyticsService.trackEvent({
      page: parsed.data.page,
      eventType: parsed.data.eventType,
      entityType: parsed.data.entityType,
      entityId: parsed.data.entityId || null,
      userSession: parsed.data.userSession || null,
      ipAddress: submissionContext.ipAddress,
      countryCode: submissionContext.countryCode,
      city: submissionContext.city,
      data: {
        ...(parsed.data.data || {}),
        sourceApp: submissionContext.metadata.sourceApp,
        sourcePath: submissionContext.metadata.sourcePath,
        referrerDomain: submissionContext.metadata.referrerDomain,
        language: submissionContext.metadata.language,
        country: submissionContext.country,
      },
    });

    return successResponse({ id: event.id }, 'Analytics event tracked');
  } catch {
    return serverErrorResponse();
  }
}
