import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const publicPaths = ['/auth/signin'];
  const isAuthenticated = !!token;
  const isAdmin = token?.role === 'admin';

  // Allow access to public paths
  if (publicPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // Redirect to signin if not authenticated
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // Redirect to signin if not admin
  if (!isAdmin) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|favicon.ico).*)'],
};