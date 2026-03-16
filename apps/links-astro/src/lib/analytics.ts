const FORWARDED_HEADER_NAMES = [
  'x-forwarded-for',
  'x-real-ip',
  'x-vercel-forwarded-for',
  'cf-connecting-ip',
  'user-agent',
  'accept-language',
  'referer',
] as const;

function normalizeValue(value: string | null, maxLength = 255) {
  if (!value) return null;
  const normalized = value.trim();
  return normalized ? normalized.slice(0, maxLength) : null;
}

export function buildAnalyticsProxyHeaders({
  request,
  sourcePath,
  timezone,
}: {
  request: Request;
  sourcePath: string;
  timezone?: string;
}) {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'x-portfolio-source-app': 'links-astro',
    'x-portfolio-source-path': sourcePath,
  });

  for (const headerName of FORWARDED_HEADER_NAMES) {
    const value = normalizeValue(
      request.headers.get(headerName),
      headerName === 'referer' ? 512 : 255
    );
    if (value) {
      headers.set(headerName, value);
    }
  }

  const normalizedTimezone = normalizeValue(timezone, 100);
  if (normalizedTimezone) {
    headers.set('x-portfolio-timezone', normalizedTimezone);
  }

  return headers;
}
