import { env } from './env';
import { isUp } from './http';

export type ServiceName = 'admin' | 'public' | 'links' | 'ngl' | 'rag' | 'presence' | 'webhook';

interface ServiceDef {
  name: ServiceName;
  cwd: string;
  command: readonly string[];
  healthUrl: string;
}

export const SERVICES: Record<ServiceName, ServiceDef> = {
  admin: {
    name: 'admin',
    cwd: 'apps/admin',
    command: ['bun', 'run', 'dev'],
    healthUrl: env.ADMIN_URL,
  },
  public: {
    name: 'public',
    cwd: 'apps/public-astro',
    command: ['bun', 'run', 'dev'],
    healthUrl: env.PUBLIC_URL,
  },
  links: {
    name: 'links',
    cwd: 'apps/links-astro',
    command: ['bun', 'run', 'dev'],
    healthUrl: env.LINKS_URL,
  },
  ngl: {
    name: 'ngl',
    cwd: 'apps/ngl-svelte',
    command: ['bun', 'run', 'dev'],
    healthUrl: env.NGL_URL,
  },
  rag: {
    name: 'rag',
    cwd: 'apps/rag-service',
    command: ['bun', 'run', 'dev'],
    healthUrl: `${env.RAG_URL}/health`,
  },
  presence: {
    name: 'presence',
    cwd: 'apps/live-presence',
    command: ['bun', 'run', 'src/server.ts'],
    healthUrl: `${env.PRESENCE_URL}/health`,
  },
  webhook: {
    name: 'webhook',
    cwd: '.',
    command: ['python3', 'scripts/github_webhook_server.py'],
    healthUrl: env.WEBHOOK_URL,
  },
};

export function healthUrl(name: ServiceName): string {
  return SERVICES[name].healthUrl;
}

export function available(name: ServiceName): Promise<boolean> {
  return isUp(SERVICES[name].healthUrl);
}
