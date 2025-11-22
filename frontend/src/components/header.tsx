"use client"; 

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext"; 

import PopupModal from "./popupModal";
import { IoMdHelpCircleOutline } from "react-icons/io";

export default function Header() {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const {
    isLoading: 
    userPlanName,
    userGenerationsCount,
    userMaxGenerations,
    logout,
  } = useAuth();

  const handleLogoutConfirm = () => {
    logout(); 
    setIsLogoutModalOpen(false); 
  };

  return (
    <header className="bg-white py-4 pl-4 pr-10 md:px-10 shadow-md w-full flex z-10 sticky top-0 left-0">
      <div className="container mx-auto flex justify-between items-center">
        
        <Link
          href="/dashboard"
          className="text-3xl font-bold text-text hover:text-primary transition-colors ease-in-out"
        >
          AuraSync
        </Link>
      </div>

      
      <div className="container mx-auto pr-3 md:pr-0 flex justify-end items-center gap-2">
        <div className="flex items-center justify-between gap-3">
          <p>
            <strong>Plano Atual:</strong> {userPlanName || "Carregando..."}
          </p>
          {userPlanName && userMaxGenerations !== null && (
            <p>
              <strong>Gerações Utilizadas no período:</strong>{" "}
              {userGenerationsCount} de{" "}
              {userMaxGenerations === 0 ? "Ilimitadas" : userMaxGenerations}
            </p>
          )}
          {/* Opcional: Link para Upgrade de Plano, similar ao da página de Settings */}
          {userPlanName && userPlanName !== "Unlimited" && (
            <Link
              href="/plans"
              className=" inline-block bg-button hover:bg-primary text-white font-medium py-2 px-4 rounded-md transition duration-300"
            >
              Upgrade
            </Link>
          )}
        </div>
        <Link
          href="/ajuda"
          className="hover:text-primary text-text font-medium py-1 px-2 text-md flex items-center space-x-2 transition-all"
        >
          <IoMdHelpCircleOutline size={24} />
          <span>Ajuda</span>
        </Link>

        <div></div>
      </div>

      <PopupModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)} 
        onConfirm={handleLogoutConfirm} 
        title="Confirmar Saída"
        message="Tem certeza que deseja sair do sistema AuraSync AI?"
      />
    </header>
  );
}
