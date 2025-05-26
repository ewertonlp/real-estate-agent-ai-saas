// frontend/src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.get('access_token')?.value; // Verifica se o token está nos cookies

  // Rotas protegidas (exigem autenticação) - Remova '/' daqui!
  const protectedRoutes = ['/dashboard', '/history', '/settings'];
  // Rotas de autenticação (não devem ser acessadas se já logado)
  const authRoutes = ['/login', '/register'];

  // Redireciona para login se tentar acessar rota protegida sem autenticação
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !isAuthenticated) { // Use startsWith para rotas com :path*
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redireciona para o dashboard se tentar acessar rota de auth ou a raiz já autenticado
  if ((authRoutes.includes(pathname) || pathname === '/') && isAuthenticated) { // Adicione || pathname === '/' aqui
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Se não há redirecionamento, continue para a próxima rota
  return NextResponse.next();
}

// Configura o middleware para rodar em todas as rotas relevantes
export const config = {
  matcher: [
    '/', // Manter aqui para redirecionar da landing page para o dashboard SE LOGADO
    '/login',
    '/register',
    '/dashboard/:path*',
    '/history/:path*',
    '/settings/:path*',
  ],
};