import { NextRequest } from 'next/server';
import { withAdminAuth } from '@/lib/api/middleware/auth';
import { bookingsService } from '@/lib/api/handlers/bookings.service';
import {
  successResponse,
  notFoundResponse,
  validationErrorResponse,
  serverErrorResponse,
} from '@/lib/api/responses';
import { quickStatusUpdateSchema } from '@/lib/validations/booking.schema';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: NextRequest, context: RouteContext) {
  return withAdminAuth(async () => {
    try {
      const { id } = await context.params;
      const body = await req.json();
      const validation = quickStatusUpdateSchema.safeParse(body);

      if (!validation.success) {
        return validationErrorResponse(validation.error.format());
      }

      const exists = await bookingsService.getById(id);
      if (!exists) {
        return notFoundResponse('Booking');
      }

      const booking = await bookingsService.updateStatus(id, {
        status: validation.data.status,
      });
      return successResponse(booking, 'Booking status updated successfully');
    } catch {
      return serverErrorResponse();
    }
  })(req);
}
