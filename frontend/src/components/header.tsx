"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "next-themes";
import PopupModal from "./popupModal";
import { IoIosExit, IoMdHelpCircleOutline } from "react-icons/io";
import { FaMoon, FaSun } from "react-icons/fa";

export default function Header() {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const {
    isLoading,
    userPlanName,
    userGenerationsCount,
    userMaxGenerations,
    logout,
  } = useAuth();

  const handleToggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    setIsLogoutModalOpen(false);
  };

  return (
    <header className="bg-white dark:bg-card py-4 pl-4 pr-10 md:px-10 shadow-md w-full flex z-10 sticky top-0 left-0">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          href="/dashboard"
          className="text-3xl font-bold text-text hover:text-primary transition-colors ease-in-out"
        >
          AuraSync
        </Link>
      </div>

      <div className="container mx-auto pr-3 md:pr-0 flex justify-end items-center gap-2">
        <div className="hidden md:flex items-center justify-between gap-3">
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
          className="hidden md:flex hover:text-primary text-text font-medium py-1 px-2 text-md items-center space-x-2 transition-all"
        >
          <IoMdHelpCircleOutline size={24} />
          <span className="text-sm">Ajuda</span>
        </Link>

        <div
          className="hidden md:flex items-center justify-between px-4 py-2 text-sm text-text hover:bg-card cursor-pointer"
          onClick={handleToggleTheme}
        >
          <div className="flex items-center space-x-3">
            {theme === "light" ? (
              <FaMoon className="text-lg" />
            ) : (
              <FaSun className="text-lg text-yellow-500" />
            )}
          </div>
          
        </div>

        <div className="hidden md:block ml-4">
          <button
            onClick={() => {
              handleLogoutClick();
            }}
            className="flex items-center space-x-2 px-2 py-1 rounded-sm border border-red-500 text-sm font-medium text-red-500 hover:bg-red-200 transition w-full text-left"
          >
            <IoIosExit className="text-xl" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      <PopupModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
        title="Confirmar Saída"
        message="Tem certeza que deseja sair do sistema?"
      />
    </header>
  );
}
