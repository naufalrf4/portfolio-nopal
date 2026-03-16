const FORWARDED_HEADER_NAMES = [
  'x-forwarded-for',
  'x-real-ip',
  'x-vercel-forwarded-for',
  'cf-connecting-ip',
  'user-agent',
  'accept-language',
  'referer',
] as const;

interface ProxyHeadersOptions {
  request: Request;
  sourcePath: string;
  timezone?: string;
}

function normalizeValue(value: string | null | undefined, maxLength: number): string | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim();
  if (!normalized) {
    return null;
  }

  return normalized.slice(0, maxLength);
}

export function getBrowserTimezone(): string | undefined {
  if (typeof Intl === 'undefined') {
    return undefined;
  }

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return normalizeValue(timezone, 100) ?? undefined;
}

export function buildSubmissionProxyHeaders({
  request,
  sourcePath,
  timezone,
}: ProxyHeadersOptions): Headers {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'x-portfolio-source-app': 'public-astro',
    'x-portfolio-source-path': sourcePath,
  });

  for (const headerName of FORWARDED_HEADER_NAMES) {
    const headerValue = request.headers.get(headerName);
    if (headerValue) {
      headers.set(headerName, headerValue);
    }
  }

  const normalizedTimezone = normalizeValue(timezone, 100);
  if (normalizedTimezone) {
    headers.set('x-portfolio-timezone', normalizedTimezone);
  }

  return headers;
}
