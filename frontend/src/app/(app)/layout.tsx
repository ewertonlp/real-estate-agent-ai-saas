// frontend/src/app/(app)/layout.tsx
"use client";

import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";

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
    <div>
      {/* 2. Botão Hambúrguer para Mobile (visível apenas em telas pequenas) */}
      <Header />
      <button
        className="fixed top-4 right-2 z-50 text-text md:hidden text-2xl p-2 rounded-md bg-card" // Posicione e estilize o botão
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <FaTimes /> : <FaBars />}{" "}
        {/* Ícone muda conforme o estado */}
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
      <main className="flex-1 overflow-y-auto p-4 md:ml-64 md:p-8 pt-20 md:pt-8">
        {children}
      </main>
    </div>
  );
}
