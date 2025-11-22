'use client'; 

import { usePathname } from 'next/navigation';
import Header from './header'; 
import React from 'react'; 

interface ConditionalHeaderWrapperProps {
  children: React.ReactNode;
}

export default function ConditionalHeaderWrapper({ children }: ConditionalHeaderWrapperProps) {
  const pathname = usePathname();

  const noHeaderRoutes = ['/login', '/register'];
  const shouldShowHeader = !noHeaderRoutes.includes(pathname);

  return (
    <>
      {shouldShowHeader && <Header />}
      {children}
    </>
  );
}