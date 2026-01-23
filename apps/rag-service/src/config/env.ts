import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3004),
  HOST: z.string().default('0.0.0.0'),

  QDRANT_URL: z.string().url().default('http://localhost:6333'),
  QDRANT_API_KEY: z.string().optional(),
  QDRANT_COLLECTION: z.string().default('portfolio_knowledge'),

  OPENAI_API_KEY: z.string().optional(),
  GOOGLE_API_KEY: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),
  DEEPSEEK_API_KEY: z.string().optional(),

  PRIMARY_LLM: z.enum(['openai', 'google', 'groq', 'deepseek']).default('groq'),
  FALLBACK_LLM: z.enum(['openai', 'google', 'groq', 'deepseek']).default('google'),
  EMBEDDING_PROVIDER: z.enum(['openai', 'google']).default('openai'),

  ADMIN_API_URL: z.string().url().default('http://localhost:3001'),
  ADMIN_SERVICE_TOKEN: z.string().min(1),

  RATE_LIMIT_MAX: z.coerce.number().default(30),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),

  SESSION_TTL_MS: z.coerce.number().default(1800000),
  MAX_HISTORY_MESSAGES: z.coerce.number().default(10),

  CHUNK_SIZE: z.coerce.number().default(512),
  CHUNK_OVERLAP: z.coerce.number().default(50),
});

function validateEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const errorMsg = JSON.stringify(parsed.error.flatten().fieldErrors);
    throw new Error(`Invalid environment variables: ${errorMsg}`);
  }

  return parsed.data;
}

export const env = validateEnv();
export type Env = z.infer<typeof envSchema>;
