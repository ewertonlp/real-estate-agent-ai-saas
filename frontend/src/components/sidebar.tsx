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
import { useTheme } from "@/context/ThemeContext";
import { usePathname } from "next/navigation"; // Importa o hook

export default function Sidebar() {
  const { logout, userEmail } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname(); // Hook que pega o caminho atual

  const getUserInitials = (email: string | null) => {
    if (!email) return "US";
    const parts = email.split("@")[0];
    if (parts.length === 0) return "US";
    return parts.substring(0, 2).toUpperCase();
  };

  const linkClass = (path: string) =>
    `flex items-center space-x-3 p-2 rounded-md transition-colors ${
      pathname === path
        ? "text-blue-500 font-medium"
        : "hover:bg-card text-text"
    }`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-card text-text shadow-lg p-6 flex flex-col z-0 transition-all duration-300 transform -translate-x-full md:translate-x-0">
      <div className="flex-shrink-0 mt-10 mb-10"></div>

      <nav className="flex-grow">
        <ul className="space-y-4">
          <li>
            <Link href="/dashboard" className={linkClass("/dashboard")}>
              <FaWpforms className="text-xl" />
              <span>Gerar Conteúdo</span>
            </Link>
          </li>
          <li>
            <Link href="/history" className={linkClass("/history")}>
              <FaHistory className="text-xl" />
              <span>Histórico</span>
            </Link>
          </li>
          <li>
            <Link href="/analytics" className={linkClass("/analytics")}>
              <FaChartBar className="text-xl" />
              <span>Analytics</span>
            </Link>
          </li>
          <li>
            <Link href="/templates" className={linkClass("/templates")}>
              <FaStar className="text-xl" />
              <span>Templates</span>
            </Link>
          </li>
          <li>
            <Link
              href="/plans"
              className={`flex items-center space-x-3 p-2 rounded-md transition-colors font-medium
          ${
              pathname === "/plans"
          ? "text-text bg-button/25"
          : "bg-button/50 hover:bg-button/40 text-text"
           }
            `}
            >
              <FaCrown className="text-xl" />
              <span>Upgrade Plano</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Dropdown do usuário */}
      <div className="mt-auto relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center justify-between w-full p-2 rounded-md hover:bg-card transition-colors"
        >
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-button text-white text-sm font-medium">
              {userEmail ? getUserInitials(userEmail) : <FiUser size={18} />}
            </div>
            <span className="text-xs font-medium truncate">
              {userEmail || "Usuário"}
            </span>
          </div>
          <FaCog className="text-lg text-text" />
        </button>

        {isDropdownOpen && (
          <div className="absolute bottom-full mb-2 left-0 w-full bg-card-light rounded-md shadow-lg py-1 z-20 border border-border">
            <Link
              href="/settings"
              className="flex items-center space-x-3 px-4 py-2 text-sm text-text hover:bg-card"
              onClick={() => setIsDropdownOpen(false)}
            >
              <FaCog className="text-lg" />
              <span>Configurações da Conta</span>
            </Link>
            <div
              className="flex items-center justify-between px-4 py-2 text-sm text-text hover:bg-card cursor-pointer"
              onClick={toggleTheme}
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
          </div>
        )}
      </div>
    </aside>
  );
}
