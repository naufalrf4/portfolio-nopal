import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = [
  '/dashboard',
  '/projects',
  '/blogs',
  '/links',
  '/guestbook',
  '/messages',
  '/analytics',
  '/settings',
];
const authRoutes = ['/auth/signin'];

export async function proxy(req: NextRequest) {
  const { nextUrl } = req;
  const sessionCookie =
    req.cookies.get('authjs.session-token') || req.cookies.get('__Secure-authjs.session-token');
  const isLoggedIn = !!sessionCookie;

  const isProtectedRoute = protectedRoutes.some((route) => nextUrl.pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => nextUrl.pathname.startsWith(route));
  const isApiAdminRoute = nextUrl.pathname.startsWith('/api/v1/admin');
  const isApiPublicRoute = nextUrl.pathname.startsWith('/api/v1/public');

  if (isApiPublicRoute) {
    return NextResponse.json(
      {
        success: false,
        error: 'Public API not yet available',
        message:
          'This endpoint will be available soon. The public API is currently under development.',
        code: 'SERVICE_UNAVAILABLE',
      },
      { status: 503 }
    );
  }

  if (isProtectedRoute || isApiAdminRoute) {
    if (!isLoggedIn) {
      const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search);
      return NextResponse.redirect(new URL(`/auth/signin?callbackUrl=${callbackUrl}`, nextUrl));
    }
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
