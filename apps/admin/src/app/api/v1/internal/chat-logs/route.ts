import { NextRequest } from 'next/server';
import { withServiceAuth } from '@/lib/api/middleware/auth';
import { chatLogsService } from '@/lib/api/handlers/chat-logs.service';
import { successResponse, validationErrorResponse, serverErrorResponse } from '@/lib/api/responses';
import { createChatLogSchema } from '@/lib/validations/chat-log.schema';

async function handlePost(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = createChatLogSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.format());
    }

    const chatLog = await chatLogsService.upsert(validation.data);
    return successResponse(chatLog);
  } catch {
    return serverErrorResponse('Failed to save chat log');
  }
}

export const POST = withServiceAuth(handlePost);
