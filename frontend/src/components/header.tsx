// frontend/src/components/Header.tsx
"use client"; // Necessário para usar hooks como useAuth e useRouter

import Link from "next/link";
import { useAuth } from "@/context/AuthContext"; // Importa o hook de autenticação
import { IoIosArchive, IoIosExit, IoMdPerson} from "react-icons/io";
import { FiUser } from "react-icons/fi"; 
import { useRef, useState, useEffect } from "react";
import { FaCrown } from "react-icons/fa";

export default function Header() {
  const { logout, userEmail } = useAuth(); // Obtém a função de logout do contexto de autenticação
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Estado para controlar o dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Função para obter as iniciais do e-mail
  const getUserInitials = (email: string | null) => {
    if (!email) return "US"; // Padrão se não houver e-mail
    const parts = email.split("@")[0]; // Pega a parte antes do '@'
    if (parts.length === 0) return "US";
    return parts.substring(0, 2).toUpperCase(); // Pega as duas primeiras letras e transforma em maiúsculas
  };

  // Efeito para fechar o dropdown ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Se o dropdown está aberto e o clique não foi dentro do dropdown
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    // Adiciona o event listener ao montar
    document.addEventListener("mousedown", handleClickOutside);
    // Remove o event listener ao desmontar
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]); // Depende do dropdownRef

  return (
    <header className="bg-white py-4 px-10 shadow-md w-full flex ">
      <div className="container mx-auto flex justify-between items-center">
        {/* Título/Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-gray-800 hover:text-slate-600 transition-colors"
        >
          Corretor AI
        </Link>
      </div>
      {/* Links de Navegação e Botões de Ação */}
      <div className="container mx-auto flex justify-end items-center gap-4">
        <nav>
          <ul className="flex items-center space-x-4">
            <li>
              <Link
                href="/history"
                className="border border-slate-500 hover:bg-slate-300 text-gray-800 font-medium py-1 px-3 rounded-md text-md flex items-center space-x-1 transition-all">
              
                <IoIosArchive />
                <span>Histórico</span>
              </Link>
            </li>
            <li>
              <Link
                href="/analytics"
                className="border border-slate-500 hover:bg-slate-300 text-gray-800 font-medium py-1 px-3 rounded-md text-md flex items-center space-x-1 transition-all"
              >
                Analytics
              </Link>
            </li>
             {/* Novo link para a página de planos */}
            <li>
              <Link
                href="/plans"
                className="border border-orange-500 bg-orange-400 hover:bg-orange-500 text-slate-50 font-medium py-1 px-3 rounded-md text-md flex items-center space-x-1 transition-all"
              >
                <FaCrown /> {/* Ícone da coroa */}
                <span>Upgrade</span>
              </Link>
            </li>
          </ul>
        </nav>
        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          {" "}
          {/* <-- Adiciona ref aqui */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-center w-9 h-9 rounded-md bg-slate-700 text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            title={userEmail || "Perfil do Usuário"} // Mostra o e-mail no tooltip
          >
            {/* Exibe as iniciais do e-mail ou um ícone de usuário */}
            {userEmail ? getUserInitials(userEmail) : <FiUser size={20} />}
          </button>
          {isDropdownOpen && ( // <-- Renderiza o dropdown condicionalmente
            <div className="absolute right-0 mt-2 w-auto flex-1 justify-end items-center bg-white rounded-md shadow-lg py-1 z-20">
              {/* Exibe o e-mail do usuário no topo do dropdown */}
              <div className="block px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                {userEmail || "Usuário"}
              </div>
              <Link
                href="/settings"
                className="flex justify-end items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)} // Fecha o dropdown ao clicar
              >
                <IoMdPerson />
                Minha Conta
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsDropdownOpen(false); // Fecha o dropdown ao fazer logout
                }}
                className="flex justify-end items-center w-full gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                <IoIosExit />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
