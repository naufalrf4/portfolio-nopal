import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ingestService } from '../services/ingest.service';
import { ingestRequestSchema, ingestJsonSchema } from '../schemas/ingest.schema';
import { env } from '../config/env';

interface IngestBody {
  documentId?: string;
  type: 'knowledge' | 'project' | 'about' | 'all';
}

export async function ingestRoute(app: FastifyInstance): Promise<void> {
  app.post<{ Body: IngestBody }>(
    '/ingest',
    {
      schema: ingestJsonSchema,
      preHandler: async (request: FastifyRequest, reply: FastifyReply) => {
        const token = request.headers['x-service-token'];
        if (token !== env.ADMIN_SERVICE_TOKEN) {
          return reply.status(401).send({
            success: false,
            error: {
              code: 'UNAUTHORIZED',
              message: 'Invalid service token',
            },
          });
        }
      },
    },
    async (request: FastifyRequest<{ Body: IngestBody }>, reply: FastifyReply) => {
      const validation = ingestRequestSchema.safeParse(request.body);

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

      const result = await ingestService.ingest(validation.data);

      return reply.send({
        success: true,
        data: result,
      });
    }
  );
}
