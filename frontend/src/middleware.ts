// frontend/src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.get('access_token')?.value; // Verifica se o token está nos cookies

  // Rotas protegidas (exigem autenticação)
  // Certifique-se de que as páginas institucionais NÃO estão aqui.
  const protectedRoutes = ['/dashboard', '/history', '/settings', '/templates', '/analytics', '/plans']; 
  // Rotas de autenticação (não devem ser acessadas se já logado)
  const authRoutes = ['/login', '/register'];

  // Redireciona para login se tentar acessar rota protegida sem autenticação
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redireciona para o dashboard se tentar acessar rota de auth ou a raiz já autenticado
  if ((authRoutes.includes(pathname) || pathname === '/') && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Se não há redirecionamento, continue para a próxima rota
  return NextResponse.next();
}

// Configura o middleware para rodar em todas as rotas relevantes
export const config = {
  matcher: [
    '/', // Manter aqui para redirecionar da landing page para o dashboard SE LOGADO
    '/login', //
    '/register', //
    '/dashboard/:path*', //
    '/history/:path*', //
    '/settings/:path*', //
    '/templates/:path*', // Já estava na sua protectedRoutes, adicionei no matcher também.
    '/analytics/:path*', // Já estava na sua protectedRoutes, adicionei no matcher também.
    '/plans/:path*', // Já estava na sua protectedRoutes, adicionei no matcher também.

    // NOVAS ROTAS INSTITUCIONAIS - Adicione-as aqui para que o middleware seja executado,
    // mas sem que sejam protegidas ou redirecionadas se já logado.
    '/politica-de-privacidade',
    '/termos-de-servico',
    '/politica-de-reembolso-e-cancelamento',
    '/contato',
    '/aboutUs',
    '/faq',
    '/services' // Já existe na home page, adicionei aqui para consistência.
  ],
};