import { NextRequest } from 'next/server';
import { withAdminAuth } from '@/lib/api/middleware/auth';
import { aboutService } from '@/lib/api/handlers/about.service';
import { successResponse, validationErrorResponse, serverErrorResponse } from '@/lib/api/responses';
import { updateAboutSchema } from '@/lib/validations/about.schema';

async function handleGet() {
  try {
    const aboutMe = await aboutService.get();
    return successResponse(aboutMe);
  } catch {
    return serverErrorResponse();
  }
}

async function handlePut(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = updateAboutSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.format());
    }

    const aboutMe = await aboutService.update(validation.data);
    return successResponse(aboutMe, 'About me updated successfully');
  } catch {
    return serverErrorResponse();
  }
}

export const GET = withAdminAuth(handleGet);
export const PUT = withAdminAuth(handlePut);
