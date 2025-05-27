// frontend/src/app/(app)/layout.tsx
'use client';

import Header from '@/components/header';
import { useAuth } from '@/context/AuthContext';
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
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-gray-700">Carregando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    // ESTE É O CONTAINER GLOBAL PARA TODAS AS PÁGINAS AUTENTICADAS
    // Ele terá o fundo cinza, altura mínima, e flexbox para o cabeçalho e conteúdo.
    <div className="flex flex-col min-h-screen">
     
      <Header/>
      {/* O main-content-wrapper dará o espaçamento horizontal e centralizará o conteúdo */}
      <div className="flex-grow flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8 bg-slate-100 ">
        {children} {/* Aqui as páginas filhas serão renderizadas */}
      </div>
  
     
    </div>
  );
}