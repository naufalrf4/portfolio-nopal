const DEFAULT_SITE_URL = 'https://naufalrf.net';

/**
 * Resolves the canonical site URL from environment configuration.
 *
 * Checks `process.env.SITE_URL` first (server/runtime env, e.g. Node adapter
 * at request time), then falls back to `import.meta.env.SITE_URL` (build-time
 * env exposed by Vite/Astro), and finally to the hardcoded production
 * domain. This is the single source of truth for the site's base URL -
 * every page/endpoint that needs an absolute URL should call this instead of
 * reading env vars or hardcoding the domain directly.
 */
export function getSiteUrl(): string {
  const fromProcessEnv = typeof process !== 'undefined' ? process.env.SITE_URL?.trim() : undefined;
  if (fromProcessEnv) return fromProcessEnv;

  const fromImportMetaEnv = import.meta.env.SITE_URL?.trim();
  if (fromImportMetaEnv) return fromImportMetaEnv;

  return DEFAULT_SITE_URL;
}

/**
 * A plain-text 503 response for pages whose critical data fetch failed
 * (e.g. the Admin API is unreachable or timed out). Used instead of
 * silently rendering the page with empty data as a 200, which would tell
 * crawlers and users "there is genuinely nothing here" rather than "we
 * couldn't load this right now, please retry".
 */
export function serviceUnavailableResponse(message = 'Service temporarily unavailable. Please try again shortly.'): Response {
  return new Response(message, {
    status: 503,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Retry-After': '30',
    },
  });
}

// NOTE: A `SITE_CONTENT_BUILD_TIME` (module-load timestamp) constant used to
// live here and was rendered on the About page as a "Last updated" label.
// It was removed because it reflected server/module load time, not any real
// content edit - `AboutData` (see packages/contracts/src/index.ts) has no
// `updatedAt`/`publishedAt` field. Re-add a real build-time constant only if
// paired with a genuine CMS `updatedAt` field for About content; do not
// reintroduce a fabricated date as a stand-in.
