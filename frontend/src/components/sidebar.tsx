// frontend/src/components/sidebar.tsx
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

// 1. Crie uma interface para as props que o Sidebar vai receber do seu pai (layout.tsx)
interface SidebarProps {
  isOpen: boolean; // Estado booleano que indica se o sidebar deve estar aberto (true) ou fechado (false)
  onClose: () => void; // Função para fechar o sidebar, passada pelo componente pai
}

// 2. Modifique a exportação do componente para receber as novas props
export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { logout, userEmail } = useAuth();
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
        ? "bg-background text-button font-medium"
        : "hover:bg-background text-text"
    }`;

  // Lógica existente para fechar o dropdown do usuário ao clicar fora
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

  // 3. Adicione uma lógica para fechar o sidebar ao clicar fora dele no mobile
  useEffect(() => {
    if (isOpen) { // Apenas se o sidebar estiver aberto
      const handleOutsideClick = (event: MouseEvent) => {
        // Obtenha a referência ao próprio elemento aside
        const sidebarElement = document.getElementById('main-sidebar'); // Vamos adicionar este ID ao aside
        // Se o clique não foi dentro do sidebar, e o sidebar existe, feche-o
        if (sidebarElement && !sidebarElement.contains(event.target as Node)) {
          onClose(); // Chama a função onClose passada pelo pai (layout.tsx)
        }
      };
      document.addEventListener('mousedown', handleOutsideClick);
      return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
      };
    }
  }, [isOpen, onClose]); // Depende de isOpen e onClose

  return (
    // 4. Ajuste as classes da tag <aside> para controlar a visibilidade e transição
    // 'z-50' para sobrepor o conteúdo e o overlay no mobile. 'md:z-0' para desktop.
    // 'cn' é usado para mesclar classes condicionalmente e as passadas externamente
    <aside
      id="main-sidebar"
      className={cn(
        // Classes base que se aplicam em todos os tamanhos, mas podem ser sobrescritas
        "h-screen w-64 bg-card text-text shadow-lg p-6 flex flex-col transition-transform duration-300",
        // Classes específicas para mobile (fixed, translate-x para esconder/mostrar)
        "fixed top-0 left-0 z-50", // z-50 para mobile
        isOpen ? "translate-x-0" : "-translate-x-full", // Controle de slide mobile
        // Classes para desktop (md:), que sobrescrevem as de mobile
        "md:translate-x-0 md:fixed md:w-64 md:z-0" // md:static aqui para garantir que sai do fixed
      )}
    >
      <div className="flex-shrink-0 mt-10 mb-10"></div> {/* Conteúdo do cabeçalho do sidebar */}

      <nav className="flex-grow">
        <ul className="space-y-4">
          <li>
            <Link href="/dashboard" className={linkClass("/dashboard")} onClick={onClose}> {/* 5. Adicione onClick={onClose} para fechar o sidebar ao clicar no link */}
              <FaWpforms className="text-lg" />
              <span>Gerar Conteúdo</span>
            </Link>
          </li>
          <li>
            <Link href="/history" className={linkClass("/history")} onClick={onClose}>
              <FaHistory className="text-lg" />
              <span>Histórico</span>
            </Link>
          </li>
          <li>
            <Link href="/analytics" className={linkClass("/analytics")} onClick={onClose}>
              <FaChartBar className="text-lg" />
              <span>Analytics</span>
            </Link>
          </li>
          <li>
            <Link href="/templates" className={linkClass("/templates")} onClick={onClose}>
              <FaStar className="text-lg" />
              <span>Templates</span>
            </Link>
          </li>
          <li>
            <Link
              href="/plans"
              className={cn( // Usando cn para melhor legibilidade
                `flex items-center space-x-3 p-2 rounded-md transition-colors font-medium`,
                pathname === "/plans"
                  ? "text-text bg-button"
                  : "bg-button hover:bg-button text-text"
              )}
              onClick={onClose}
            >
              <FaCrown className="text-lg" />
              <span>Upgrade Plano</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Dropdown do usuário */}
      <div className="mt-auto relative border-t pt-2" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center justify-between w-full p-2 rounded-md hover:bg-background transition-colors"
        >
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-button text-white text-xs font-medium">
              {userEmail ? getUserInitials(userEmail) : <FiUser size={18} />}
            </div>
            <span className="text-sm font-normal truncate">
              {userEmail || "Usuário"}
            </span>
          </div>
          <FaCog className="text-xl text-text ml-1" />
        </button>

        {isDropdownOpen && (
          <div className="absolute bottom-full mb-2 left-0 w-full bg-background rounded-md shadow-lg py-1 z-20 border border-border">
            <Link
              href="/settings"
              className="flex items-center space-x-3 px-4 py-2 text-sm text-text hover:bg-card"
              onClick={() => { setIsDropdownOpen(false); onClose(); }} // Fecha dropdown E sidebar
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
            {/* 6. Mova o botão de Logout para dentro do dropdown para melhor organização no mobile */}
            <button
              onClick={() => { logout(); setIsDropdownOpen(false); onClose(); }} // Fecha tudo ao deslogar
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