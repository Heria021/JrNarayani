import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: 'somesorts' });
  console.log('Middleware token check: ',token)
  const publicPaths = ['/auth/signin'];
  const isAuthenticated = !!token;
  if (!isAuthenticated && !publicPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|favicon.ico).*)'],
};