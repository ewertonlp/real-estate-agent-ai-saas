"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRef, useState, useEffect } from "react";
import {
  FaHistory,
  FaChartBar,
  FaStar,
  FaCrown,
  FaCog,
  FaMoon,
  FaSun,
  FaWpforms,
} from "react-icons/fa";
import { IoExit } from "react-icons/io5";
import { FiUser } from "react-icons/fi";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import PopupModal from "../popupModal";
import { IoMdHelpCircleOutline } from "react-icons/io";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { logout, userEmail, userNome, userPlanName } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const getUserInitials = (email: string | null) => {
    if (!email) return "US";
    const parts = email.split("@")[0];
    if (parts.length === 0) return "US";
    return parts.substring(0, 2).toUpperCase();
  };

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

  const linkClass = (path: string) =>
    `flex items-center gap-4 px-4 py-2 rounded-lg transition-colors ${
      pathname === path
        ? "bg-gradient-to-tr from-primary to-primary/15 text-white font-medium shadow-md"
        : "hover:bg-gradient-to-br from-primary to-primary/25 text-foreground border border-gray-300 "
    }`;

  useEffect(() => {
    const handleClickOutsideDropdown = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideDropdown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideDropdown);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      const handleOutsideClick = (event: MouseEvent) => {
        const sidebarElement = document.getElementById("main-sidebar");

        if (sidebarElement && !sidebarElement.contains(event.target as Node)) {
          onClose();
        }
      };
      document.addEventListener("mousedown", handleOutsideClick);
      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    }
  }, [isOpen, onClose]);

  const getEmailDisplay = (email: string | null) => {
    if (!email) return "Usuário";
    const [name, domain] = email.split("@");
    const shortenedName = name.length > 15 ? name.slice(0, 8) + "…" : name;
    return `${shortenedName}@${domain}`;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // ou um placeholder de mesma estrutura, mas sem conteúdo dinâmico
  }

  return (
    <aside
      id="main-sidebar"
      className={cn(
        "h-screen flex flex-col w-2/3 bg-card text-foreground shadow-lg px-4 py-2  transition-transform duration-300",
        "fixed top-0 left-0 z-50",
        isOpen ? "translate-x-0" : "-translate-x-full",

        "md:translate-x-0 md:fixed md:w-64 md:z-0",
      )}
    >
      <div className="flex-shrink-0 mt-5 md:mt-10"></div>

      <div className="mt-4 mb-8 flex flex-col items-center space-x-2 space-y-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-tr from-primary to-primary/25 text-foreground text-[1rem] font-medium">
          {userEmail ? getUserInitials(userEmail) : <FiUser size={18} />}
        </div>
        <span className="text-xs font-normal truncate">
          {userNome || getEmailDisplay(userEmail) || "Usuario"}
        </span>
        <p>
            <strong>Plano Atual:</strong> {userPlanName || "Carregando..."}
          </p>
      </div>

      <div className="overflow-y-auto">
        <nav className="">
          <ul className="flex flex-col space-y-2 text-foreground">
            <li>
              <Link
                href="/dashboard"
                className={linkClass("/dashboard")}
                onClick={onClose}
              >
                <FaWpforms className="text-lg" />
                <span className="text-sm">Gerar</span>
              </Link>
            </li>
            <li>
              <Link
                href="/history"
                className={linkClass("/history")}
                onClick={onClose}
              >
                <FaHistory className="text-lg" />
                <span className="text-sm">Histórico</span>
              </Link>
            </li>
            <li>
              <Link
                href="/analytics"
                className={linkClass("/analytics")}
                onClick={onClose}
              >
                <FaChartBar className="text-lg" />
                <span className="text-sm">Analytics</span>
              </Link>
            </li>
            <li>
              <Link
                href="/templates"
                className={linkClass("/templates")}
                onClick={onClose}
              >
                <FaStar className="text-lg" />
                <span className="text-sm">Templates</span>
              </Link>
            </li>
            <li>
              <Link
                href="/settings"
                className={linkClass("/settings")}
                onClick={onClose}
              >
                <FaCog className="text-lg" />
                <span className="text-sm">Configurações</span>
              </Link>
            </li>
            <li>
              <Link
                href="/plans"
                className={cn(
                  `flex items-center gap-4 px-4 py-2 rounded-lg transition-colors text-sm font-medium`,
                  pathname === "/plans"
                    ? "text-foreground bg-warning"
                    : "bg-gradient-to-tr from-warning to-warning/15 hover:bg-ai text-foreground",
                )}
                onClick={onClose}
              >
                <FaCrown className="text-lg" />
                <span className="text-sm">Upgrade</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="mt-40 border-t py-2 space-y-2">
        <div
          className="md:hidden flex items-center justify-between pt-4 text-sm text-text hover:bg-card cursor-pointer"
          onClick={handleToggleTheme}
        >
          <div className="flex items-center space-x-3">
            {theme === "light" ? (
              <FaMoon className="text-lg" />
            ) : (
              <FaSun className="text-lg text-warning" />
            )}
            <span>Alternar Tema</span>
          </div>
          <span className="text-xs text-gray-500 capitalize">{theme}</span>
        </div>
        
          <Link
            href="/ajuda"
            className="flex items-center space-x-2 hover:text-primary text-foreground font-medium py-1 text-md transition-all"
          >
            <IoMdHelpCircleOutline size={22} />
            <span className="text-sm">Ajuda</span>
          </Link>
     


          <button
            onClick={() => {
              handleLogoutClick();
            }}
            className="flex items-center space-x-2 rounded-sm text-sm font-medium text-red-500 hover:bg-red-200 transition w-full text-left"
          >
            <IoExit className="text-xl" />
            <span>Sair</span>
          </button>

      </div>
      <PopupModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
        title="Confirmar Saída"
        message="Tem certeza que deseja sair do sistema?"
      />
    </aside>
  );
}
