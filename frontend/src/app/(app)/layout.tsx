// frontend/src/app/(app)/layout.tsx
"use client"; // Mantenha esta diretiva

import { useState } from 'react'; // Importe useState
import { FaBars, FaTimes } from 'react-icons/fa'; // Importe os ícones do hambúrguer/X
import Sidebar from "@/components/sidebar"; // Importe o componente Sidebar
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/providers/theme-provider"; // next-themes provider
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from '@/components/header';




export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 1. Estado para controlar se o sidebar móvel está aberto
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body> {/* Use flex para o layout principal */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {/* 2. Botão Hambúrguer para Mobile (visível apenas em telas pequenas) */}
           <Header />
          <button
            className="fixed top-4 right-2 z-50 text-text md:hidden text-2xl p-2 rounded-md bg-card" // Posicione e estilize o botão
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? <FaTimes /> : <FaBars />} {/* Ícone muda conforme o estado */}
          </button>

          {/* 3. Sidebar Component - Passe o estado e a função de fechar */}
          <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

          {/* 4. Overlay para Mobile quando o Sidebar está aberto */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-60 z-40 md:hidden" // Z-40 para ficar abaixo do sidebar
              onClick={closeSidebar} // Clicar no overlay fecha o sidebar
            ></div>
          )}

          {/* 5. Conteúdo Principal */}
          {/*
            - flex-1: Faz com que o conteúdo ocupe o espaço restante
            - md:ml-64: Adiciona margem à esquerda em desktop para acomodar o sidebar
            - p-4 md:p-8: Padding geral para o conteúdo
            - pt-20 md:pt-8: Adiciona um padding-top em mobile para dar espaço ao botão hambúrguer fixo
          */}
          <main className="flex-1 overflow-y-auto p-4 md:ml-64 md:p-8 pt-20 md:pt-8">
          
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
              />
              {children}
            
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}