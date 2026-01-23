import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { retrieverService } from '../services/retriever.service';
import { sessionService } from '../services/session.service';
import { llmService } from '../services/llm.service';

export async function healthRoute(app: FastifyInstance): Promise<void> {
  app.get('/health', async (_request: FastifyRequest, reply: FastifyReply) => {
    const qdrantInfo = await retrieverService.getCollectionInfo();

    return reply.send({
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
          qdrant: {
            connected: true,
            vectorCount: qdrantInfo.vectorCount,
          },
          llm: {
            providers: llmService.getAvailableProviders(),
          },
          sessions: {
            active: sessionService.getActiveSessions(),
          },
        },
      },
    });
  });
}
