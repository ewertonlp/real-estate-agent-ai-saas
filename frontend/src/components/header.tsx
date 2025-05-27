// frontend/src/components/Header.tsx
'use client'; // Necessário para usar hooks como useAuth e useRouter

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext'; // Importa o hook de autenticação
import { IoIosArchive, IoMdSettings } from "react-icons/io";

export default function Header() {
  const { logout } = useAuth(); // Obtém a função de logout do contexto de autenticação

  return (
    <header className="bg-white p-4 shadow-md w-full">
      <div className="container mx-auto flex justify-between items-center">
        {/* Título/Logo */}
        <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
          Corretor AI
        </Link>

        {/* Links de Navegação e Botões de Ação */}
        <nav>
          <ul className="flex items-center space-x-4">
            <li>
              <Link href="/history" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-3 rounded text-sm flex items-center space-x-1">
                <IoIosArchive />
                <span>Histórico</span>
              </Link>
            </li>
            <li>
              <Link href="/analytics" className="text-blue-600 hover:underline font-semibold">
    Ver Meus Analytics
  </Link>
            </li>
            <li>
              <Link href="/settings" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-3 rounded text-sm flex items-center space-x-1">
                <IoMdSettings />
                <span>Configurações</span>
              </Link>
            </li>
            <li>
              <button
                onClick={() => logout()}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm"
              >
                Sair
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}