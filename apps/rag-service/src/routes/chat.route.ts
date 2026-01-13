import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { chatService } from '../services/chat.service';
import { chatRequestSchema, chatJsonSchema } from '../schemas/chat.schema';

interface ChatBody {
  sessionId?: string;
  message: string;
}

export async function chatRoute(app: FastifyInstance): Promise<void> {
  app.post<{ Body: ChatBody }>(
    '/chat',
    { schema: chatJsonSchema },
    async (request: FastifyRequest<{ Body: ChatBody }>, reply: FastifyReply) => {
      const validation = chatRequestSchema.safeParse(request.body);

      if (!validation.success) {
        return reply.status(400).send({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request',
            details: validation.error.flatten().fieldErrors,
          },
        });
      }

      const result = await chatService.chat(validation.data);

      return reply.send({
        success: true,
        data: result,
      });
    }
  );
}
