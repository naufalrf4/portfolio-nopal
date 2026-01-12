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
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
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
