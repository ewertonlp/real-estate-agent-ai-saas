import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.get('access_token')?.value; 


  const protectedRoutes = ['/dashboard', '/history', '/settings', '/templates', '/analytics', '/plans']; 
  const authRoutes = ['/login', '/register'];

  if (protectedRoutes.some(route => pathname.startsWith(route)) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if ((authRoutes.includes(pathname) || pathname === '/') && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }


  return NextResponse.next();
}

export const config = {
  matcher: [
    '/', 
    '/login', 
    '/register', 
    '/dashboard/:path*', 
    '/history/:path*', 
    '/settings/:path*', 
    '/templates/:path*', 
    '/analytics/:path*', 
    '/plans/:path*', 

    
    '/politica-de-privacidade',
    '/termos-de-servico',
    '/politica-de-reembolso-e-cancelamento',
    '/contato',
    '/aboutUs',
    '/faq',
    '/services' 
};