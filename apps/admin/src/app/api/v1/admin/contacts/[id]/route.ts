import { NextRequest } from 'next/server';
import { withAdminAuth } from '@/lib/api/middleware/auth';
import { contactsService } from '@/lib/api/handlers/contacts.service';
import {
  successResponse,
  notFoundResponse,
  validationErrorResponse,
  serverErrorResponse,
} from '@/lib/api/responses';
import { updateContactSchema } from '@/lib/validations/contact.schema';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, context: RouteContext) {
  return withAdminAuth(async () => {
    try {
      const { id } = await context.params;
      const contact = await contactsService.getById(id);

      if (!contact) {
        return notFoundResponse('Contact');
      }

      
      if (!contact.read) {
        await contactsService.markAsRead(id);
      }

      return successResponse(contact);
    } catch {
      return serverErrorResponse();
    }
  })(req);
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  return withAdminAuth(async () => {
    try {
      const { id } = await context.params;
      const body = await req.json();
      const validation = updateContactSchema.safeParse(body);

      if (!validation.success) {
        return validationErrorResponse(validation.error.format());
      }

      const exists = await contactsService.getById(id);
      if (!exists) {
        return notFoundResponse('Contact');
      }

      const contact = await contactsService.update(id, validation.data);
      return successResponse(contact, 'Contact updated successfully');
    } catch {
      return serverErrorResponse();
    }
  })(req);
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  return withAdminAuth(async () => {
    try {
      const { id } = await context.params;
      const exists = await contactsService.getById(id);
      if (!exists) {
        return notFoundResponse('Contact');
      }

      await contactsService.delete(id);
      return successResponse(null, 'Contact deleted successfully');
    } catch {
      return serverErrorResponse();
    }
  })(req);
}
