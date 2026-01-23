import 'dotenv/config';
import Fastify from 'fastify';
import { env } from './config/env';
import { logger } from './utils/logger';
import { registerCors } from './plugins/cors.plugin';
import { registerRateLimit } from './plugins/rate-limit.plugin';
import { registerErrorHandler } from './plugins/error-handler.plugin';
import { registerRoutes } from './routes';
import { retrieverService } from './services/retriever.service';
import { sessionService } from './services/session.service';

async function bootstrap() {
  const app = Fastify({
    logger: false,
  });

  await registerCors(app);
  await registerRateLimit(app);
  await registerErrorHandler(app);
  await registerRoutes(app);

  try {
    await retrieverService.ensureCollection();
    logger.info('Qdrant collection ensured');
  } catch (error) {
    logger.warn({ error }, 'Failed to connect to Qdrant - will retry on first request');
  }

  sessionService.start();

  const shutdown = async (signal: string) => {
    logger.info({ signal }, 'Shutting down...');
    sessionService.stop();
    await app.close();
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  try {
    await app.listen({ port: env.PORT, host: env.HOST });
    logger.info(
      {
        port: env.PORT,
        host: env.HOST,
        env: env.NODE_ENV,
        primaryLLM: env.PRIMARY_LLM,
        fallbackLLM: env.FALLBACK_LLM,
      },
      'RAG Service started'
    );
  } catch (error) {
    logger.error({ error }, 'Failed to start server');
    process.exit(1);
  }
}

bootstrap();
