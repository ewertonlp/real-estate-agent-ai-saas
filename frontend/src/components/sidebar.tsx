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
import { IoIosExit } from "react-icons/io";
import { FiUser } from "react-icons/fi";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { logout, userEmail, userNome } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
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

  const linkClass = (path: string) =>
    `flex items-center space-x-3 p-2 rounded-md transition-colors ${
      pathname === path
        ? "bg-background text-primary font-medium"
        : "hover:bg-background text-text"
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

  return (
    <aside
      id="main-sidebar"
      className={cn(
        "h-screen w-64 bg-card text-text shadow-lg px-4 py-2 flex flex-col transition-transform duration-300",
        "fixed top-0 left-0 z-50",
        isOpen ? "translate-x-0" : "-translate-x-full",

        "md:translate-x-0 md:fixed md:w-64 md:z-0"
      )}
    >
      <div className="flex-shrink-0 mt-10 mb-10"></div>

      <nav className="flex-grow">
        <ul className="space-y-2">
          <li>
            <Link
              href="/dashboard"
              className={linkClass("/dashboard")}
              onClick={onClose}
            >
              <FaWpforms className="text-lg" />
              <span>Gerar Conteúdo</span>
            </Link>
          </li>
          <li>
            <Link
              href="/history"
              className={linkClass("/history")}
              onClick={onClose}
            >
              <FaHistory className="text-lg" />
              <span>Histórico</span>
            </Link>
          </li>
          <li>
            <Link
              href="/analytics"
              className={linkClass("/analytics")}
              onClick={onClose}
            >
              <FaChartBar className="text-lg" />
              <span>Analytics</span>
            </Link>
          </li>
          <li>
            <Link
              href="/templates"
              className={linkClass("/templates")}
              onClick={onClose}
            >
              <FaStar className="text-lg" />
              <span>Templates</span>
            </Link>
          </li>
          <li>
            <Link
              href="/plans"
              className={cn(
                `flex items-center space-x-3 p-2 rounded-md transition-colors font-medium`,
                pathname === "/plans"
                  ? "text-white bg-button"
                  : "bg-button hover:bg-primary text-white"
              )}
              onClick={onClose}
            >
              <FaCrown className="text-lg" />
              <span>Upgrade Plano</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="mt-auto relative border-t pt-2" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center justify-between w-full py-2 px-1 rounded-md hover:bg-background transition-colors"
        >
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-button text-white text-[0.5rem] font-medium">
              {userEmail ? getUserInitials(userEmail) : <FiUser size={18} />}
            </div>
            <span className="text-xs font-normal truncate">
              {userNome || getEmailDisplay(userEmail) || "Usuario"}
            </span>
          </div>
          <FaCog className="text-xl text-text ml-1" />
        </button>

        {isDropdownOpen && (
          <div className="absolute bottom-full mb-2 left-0 w-full bg-background rounded-md shadow-lg py-1 z-20 border border-border">
            <Link
              href="/settings"
              className="flex items-center space-x-3 px-4 py-2 text-sm text-text hover:bg-card"
              onClick={() => {
                setIsDropdownOpen(false);
                onClose();
              }}
            >
              <FaCog className="text-lg" />
              <span>Configurações da Conta</span>
            </Link>
            <div
              className="flex items-center justify-between px-4 py-2 text-sm text-text hover:bg-card cursor-pointer"
              onClick={handleToggleTheme}
            >
              <div className="flex items-center space-x-3">
                {theme === "light" ? (
                  <FaMoon className="text-lg" />
                ) : (
                  <FaSun className="text-lg text-yellow-500" />
                )}
                <span>Alternar Tema</span>
              </div>
              <span className="text-xs text-gray-500 capitalize">{theme}</span>
            </div>

            <button
              onClick={() => {
                logout();
                setIsDropdownOpen(false);
                onClose();
              }}
              className="flex items-center space-x-3 px-4 py-2 text-sm text-red-500 hover:bg-card w-full text-left"
            >
              <IoIosExit className="text-lg" />
              <span>Sair</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
