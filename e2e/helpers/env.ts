import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const ROOT = join(import.meta.dir, '..', '..');

const ENV_FILES = [
  '.env.docker.dev',
  'apps/admin/.env.local',
  'apps/rag-service/.env',
  'apps/live-presence/.env',
];

const ADMIN_PREFIXED = new Set([
  'ADMIN_EMAILS',
  'ADMIN_INTERNAL_API_TOKEN',
  'ADMIN_PUBLIC_API_ALLOWED_ORIGINS',
  'ADMIN_PUBLIC_URL',
  'ADMIN_PORT',
  'ADMIN_SERVICE_TOKEN',
]);

function parseEnvFile(path: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const rawLine of readFileSync(path, 'utf8').split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

function loadEnvFiles(): Record<string, string> {
  const merged: Record<string, string> = {};
  for (const rel of ENV_FILES) {
    const path = join(ROOT, rel);
    if (!existsSync(path)) continue;
    Object.assign(merged, parseEnvFile(path));
  }
  for (const [key, value] of Object.entries(merged)) {
    if (!key.startsWith('ADMIN_') || ADMIN_PREFIXED.has(key)) continue;
    const stripped = key.slice('ADMIN_'.length);
    if (merged[stripped] === undefined) merged[stripped] = value;
  }
  return merged;
}

const fileEnv = loadEnvFiles();

function read(key: string): string | undefined {
  const value = process.env[key] ?? fileEnv[key];
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function url(key: string, port: number): string {
  return (read(key) ?? `http://localhost:${port}`).replace(/\/$/, '');
}

export const env = {
  ADMIN_URL: url('E2E_ADMIN_URL', Number(read('ADMIN_PORT') ?? 3001)),
  PUBLIC_URL: url('E2E_PUBLIC_URL', Number(read('PUBLIC_PORT') ?? 3000)),
  LINKS_URL: url('E2E_LINKS_URL', Number(read('LINKS_PORT') ?? 3002)),
  NGL_URL: url('E2E_NGL_URL', Number(read('NGL_PORT') ?? 3003)),
  RAG_URL: url('E2E_RAG_URL', Number(read('RAG_PORT') ?? 3005)),
  PRESENCE_URL: url('E2E_PRESENCE_URL', Number(read('PRESENCE_PORT') ?? 3006)),
  WEBHOOK_URL: url('E2E_WEBHOOK_URL', Number(read('PORTFOLIO_WEBHOOK_PORT') ?? 9010)),

  CRON_SECRET: read('CRON_SECRET'),
  IP_HASH_SECRET: read('IP_HASH_SECRET'),
  RAG_INGEST_SERVICE_TOKEN: read('RAG_INGEST_SERVICE_TOKEN'),
  INTERNAL_API_TOKEN: read('ADMIN_INTERNAL_API_TOKEN') ?? read('INTERNAL_API_TOKEN'),
  WEBHOOK_SECRET: read('PORTFOLIO_WEBHOOK_SECRET'),
  DEMO_AUTH_ENABLED: read('DEMO_AUTH_ENABLED') === 'true',
  DEMO_AUTH_PASSWORD: read('DEMO_AUTH_PASSWORD'),
  ADMIN_EMAIL: read('ADMIN_EMAILS')?.split(',')[0]?.trim(),
  TURNSTILE_SECRET_KEY: read('TURNSTILE_SECRET_KEY'),
  DATABASE_URL: read('DATABASE_URL'),

  PRESENCE_ORIGIN: read('E2E_PRESENCE_ORIGIN') ?? url('E2E_PUBLIC_URL', 3000),
} as const;

export function requireEnv(keys: readonly (keyof typeof env)[]): string | null {
  const missing = keys.filter((key) => !env[key]);
  if (missing.length === 0) return null;
  return `missing env: ${missing.join(', ')} (set in .env.docker.dev or apps/admin/.env.local)`;
}
