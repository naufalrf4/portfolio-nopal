export interface FetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  timeoutMs?: number;
}

export interface Probe {
  status: number;
  text: string;
  headers: Headers;
  json: <T = unknown>() => T | null;
}

export async function probe(url: string, options: FetchOptions = {}): Promise<Probe> {
  const { method = 'GET', headers = {}, body, timeoutMs = 15_000 } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const init: RequestInit = { method, headers, signal: controller.signal, redirect: 'manual' };
    if (body !== undefined) init.body = body;
    const res = await fetch(url, init);
    const text = await res.text();
    return {
      status: res.status,
      text,
      headers: res.headers,
      json: <T,>() => {
        try {
          return JSON.parse(text) as T;
        } catch {
          return null;
        }
      },
    };
  } finally {
    clearTimeout(timer);
  }
}

export function postJson(url: string, body: unknown, headers: Record<string, string> = {}) {
  return probe(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
}

export function describeResponse(res: Probe): string {
  return `status=${res.status} body=${res.text.slice(0, 400)}`;
}

export async function waitForHealthy(url: string, timeoutMs = 90_000): Promise<boolean> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await probe(url, { timeoutMs: 3_000 });
      if (res.status < 500) return true;
    } catch {
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  return false;
}

export async function isUp(url: string): Promise<boolean> {
  try {
    const res = await probe(url, { timeoutMs: 2_000 });
    return res.status < 500;
  } catch {
    return false;
  }
}
