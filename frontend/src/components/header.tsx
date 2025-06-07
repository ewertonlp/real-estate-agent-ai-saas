// frontend/src/components/Header.tsx
"use client"; // Necessário para usar hooks como useAuth e useRouter

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext"; // Importa o hook de autenticação
import { GiExitDoor } from "react-icons/gi";
import PopupModal from "./popupModal";

export default function Header() {
  const { logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

   const handleLogoutConfirm = () => {
    logout(); // Chama a função de logout do AuthContext
    setIsLogoutModalOpen(false); // Fecha o modal após a confirmação
  };

  return (
    <header className="bg-card py-4 px-10 shadow-md w-full flex z-10 sticky top-0 left-0">
      <div className="container mx-auto flex justify-between items-center">
        {/* Título/Logo */}
        <Link
          href="/dashboard"
          className="text-3xl font-bold text-button hover:text-hover transition-colors"
        >
          AuraSync
        </Link>
      </div>
      {/* Links de Navegação e Botões de Ação */}
      <div className="container mx-auto flex justify-end items-center gap-4">
        <Link
          href="/history"
          className="hover:text-blue-700 text-text font-medium py-1 px-2 mr-4 text-md flex items-center space-x-1 transition-all"
        >
          <span>Tutorial</span>
        </Link>

        <div>
          <button
            onClick={() => {
              setIsLogoutModalOpen(true); 
            }}
            className="flex items-center space-x-1 w-full text-left px-2 py-1 text-sm text-red-500 rounded-md hover:text-white hover:bg-red-500 transition-colors ease-out"
          >
            <GiExitDoor size={26} />
            <span className="text-[1rem]">Sair</span>
          </button>
        </div>
      </div>

       <PopupModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)} // Função para fechar o modal ao cancelar
        onConfirm={handleLogoutConfirm} // Função para executar ao confirmar
        title="Confirmar Saída"
        message="Tem certeza que deseja sair do sistema AuraSync AI?"
      />
    </header>
  );
}
