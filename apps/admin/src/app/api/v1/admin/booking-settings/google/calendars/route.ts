import { NextRequest } from 'next/server';
import { withAdminAuth } from '@/lib/api/middleware/auth';
import { bookingSettingsService } from '@/lib/api/handlers/booking-settings.service';
import { errorResponse, serverErrorResponse, successResponse } from '@/lib/api/responses';
import { googleCalendarService } from '@/lib/services/googleCalendarService';

async function handleGet(request: NextRequest) {
  try {
    const settings = await bookingSettingsService.getInternal();

    if (!googleCalendarService.hasClientCredentials()) {
      return errorResponse('Google OAuth client credentials are not configured.', 400);
    }

    if (!googleCalendarService.isConnected(settings)) {
      return successResponse({ items: [], connected: false, selectedCalendarId: null });
    }

    const items = await googleCalendarService.listCalendars(settings, request.nextUrl.origin);
    return successResponse({
      items,
      connected: true,
      selectedCalendarId: settings.googleCalendarCalendarId ?? null,
    });
  } catch {
    return serverErrorResponse();
  }
}

export const GET = withAdminAuth(handleGet);
