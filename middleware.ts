import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get all cookies for debugging
  const cookies = request.cookies;
  const jwtCookie = cookies.get('jwt');
  
  console.log('Middleware - All Cookies:', cookies.getAll());
  console.log('Middleware - JWT Cookie:', jwtCookie);
  console.log('Middleware - Current Path:', request.nextUrl.pathname);

  const isAuthenticated = cookies.has('jwt');
  const isAuthPage = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register';

  if (!isAuthenticated && !isAuthPage) {
    console.log('Middleware - Redirecting to login (not authenticated)');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthenticated && isAuthPage) {
    console.log('Middleware - Redirecting to dashboard (already authenticated)');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
