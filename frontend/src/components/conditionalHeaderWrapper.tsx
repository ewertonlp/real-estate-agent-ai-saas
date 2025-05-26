// frontend/src/components/ConditionalHeaderWrapper.tsx
'use client'; 

import { usePathname } from 'next/navigation';
import Header from './header'; // Importa o Header do mesmo diretório
import React from 'react'; // Importa React para ReactNode

interface ConditionalHeaderWrapperProps {
  children: React.ReactNode;
}

export default function ConditionalHeaderWrapper({ children }: ConditionalHeaderWrapperProps) {
  const pathname = usePathname();

  // Defina as rotas onde o Header NÃO deve aparecer
  const noHeaderRoutes = ['/login', '/register'];
  const shouldShowHeader = !noHeaderRoutes.includes(pathname);

  return (
    <>
      {shouldShowHeader && <Header />}
      {children}
    </>
  );
}