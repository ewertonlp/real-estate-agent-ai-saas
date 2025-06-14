// frontend/src/app/(app)/layout.tsx
'use client';

import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import { useAuth } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated && !pathname.startsWith('/login')) {
      router.push('/login');
    }
  }, [isAuthenticated, isAuthLoading, router, pathname]);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-text">Carregando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    // ESTE É O CONTAINER GLOBAL PARA TODAS AS PÁGINAS AUTENTICADAS
    // Ele terá o fundo cinza, altura mínima, e flexbox para o cabeçalho e conteúdo.
    <div className="flex flex-col min-h-screen bg-background">
    
      <Header/>
      <Sidebar />
      {/* O main-content-wrapper dará o espaçamento horizontal e centralizará o conteúdo */}
      <div className="flex-grow flex flex-col bg-background py-10 px-4 sm:px-6 lg:px-8 ml-0 md:ml-64 transition-all duration-300">
        {children} {/* Aqui as páginas filhas serão renderizadas */}
      </div>
    </div>
  );
}