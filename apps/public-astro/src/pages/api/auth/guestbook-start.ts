import type { APIRoute } from 'astro';

const ADMIN_API_URL = import.meta.env.ADMIN_API_URL || 'http://localhost:3001';

export const GET: APIRoute = async ({ request, url }) => {
  const callbackUrl = url.searchParams.get('callbackUrl') || '/';
  const nextUrl = callbackUrl.startsWith('/') ? callbackUrl : '/';
  const returnTo = new URL(nextUrl, request.url);

  const adminSignInUrl = new URL('/public-auth/signin', ADMIN_API_URL);
  adminSignInUrl.searchParams.set(
    'callbackUrl',
    `/api/v1/public/auth/complete?returnTo=${encodeURIComponent(returnTo.toString())}`
  );

  return Response.redirect(adminSignInUrl.toString(), 302);
};
