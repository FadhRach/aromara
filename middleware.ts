import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/register', '/api', '/about', '/explore-suppliers'];
  
  // Check if the current path is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
  
  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // For all other routes, check if user is logged in
  const userCookie = request.cookies.get('user');
  
  if (!userCookie) {
    // Redirect to login if not authenticated
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Parse user data
  let userData;
  try {
    userData = JSON.parse(userCookie.value);
  } catch (e) {
    // Invalid cookie, redirect to login
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }

  // Role-based routing protection
  const isSupplierRoute = pathname.startsWith('/supplier');
  const isBuyerRoute = pathname.startsWith('/buyer') || pathname.startsWith('/request-quote');
  
  // If supplier trying to access buyer routes or vice versa
  if (userData.role === 'supplier' && isBuyerRoute) {
    return NextResponse.redirect(new URL('/supplier/dashboard', request.url));
  }
  
  if (userData.role === 'buyer' && isSupplierRoute) {
    return NextResponse.redirect(new URL('/explore-suppliers', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|images|.*\\..*$).*)',
  ],
};
