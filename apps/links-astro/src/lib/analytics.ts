import { buildProxyHeaders } from '@naufalrf/http';

export function buildAnalyticsProxyHeaders({
  request,
  sourcePath,
  timezone,
}: {
  request: Request;
  sourcePath: string;
  timezone?: string;
}): Headers {
  return buildProxyHeaders('links-astro', sourcePath, request.headers, timezone);
}
