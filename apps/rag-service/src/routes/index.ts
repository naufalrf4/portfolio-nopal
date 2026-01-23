import type { FastifyInstance } from 'fastify';
import { healthRoute } from './health.route';
import { chatRoute } from './chat.route';
import { ingestRoute } from './ingest.route';

export async function registerRoutes(app: FastifyInstance): Promise<void> {
  await app.register(healthRoute);
  await app.register(chatRoute);
  await app.register(ingestRoute);
}
