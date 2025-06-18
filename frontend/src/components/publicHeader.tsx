// frontend/src/components/publicHeader.tsx
"use client"; // Mantenha esta diretiva

import Link from "next/link";
import { useState } from "react"; // Importe useState para controlar o estado do menu móvel
import { FaBars, FaTimes } from "react-icons/fa"; // Importe ícones para o hambúrguer e fechar

export default function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para controlar a abertura/fechamento do menu móvel

  return (
    <header className="bg-card py-6 shadow-sm w-full relative"> {/* Adicione 'relative' para posicionamento absoluto do menu móvel */}
      <div className="max-w-7xl w-full flex justify-between items-center mx-auto px-4 sm:px-6 lg:px-8"> {/* Adicionado px para padding em telas pequenas */}
        {/* Título/Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-text hover:text-primary transition-colors z-20" // z-index para ficar acima do menu móvel
        >
          AuraSync AI
        </Link>

        {/* Ícone do Hambúrguer para Mobile */}
        <button
          className="md:hidden text-text text-2xl z-20" // Visível apenas em telas menores que 'md'
          onClick={() => setIsMenuOpen(!isMenuOpen)} // Alterna o estado do menu
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />} {/* Mostra X quando aberto, Hambúrguer quando fechado */}
        </button>

        {/* Navegação e Botões para Desktop (visíveis apenas em telas maiores que 'md') */}
        <nav className="hidden md:flex items-center justify-center gap-4"> {/* Oculta em telas pequenas, exibe em flex em md+ */}
          <ul className="flex items-center justify-center gap-4">
            <li>
              <Link
                href="/services"
                className="text-text hover:text-primary font-medium py-1 px-3 text-md flex items-center space-x-1 transition-all"
              >
                <span>Serviços</span>
              </Link>
            </li>
            <li>
              <Link
                href="/aboutUs"
                className="text-text hover:text-primary font-medium py-1 px-3 text-md flex items-center space-x-1 transition-all"
              >
                Sobre nós
              </Link>
            </li>
            <li>
              <Link
                href="/#plans"
                className="text-text hover:text-primary font-medium py-1 px-3 text-md flex items-center space-x-1 transition-all"
              >
                Preços
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-text hover:text-primary font-medium py-1 px-3 text-md flex items-center space-x-1 transition-all"
              >
                <span>Contato</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Botões de Login/Cadastro para Desktop */}
        <div className="hidden md:flex"> {/* Oculta em telas pequenas, exibe em flex em md+ */}
          <nav>
            <ul className="flex items-center justify-center gap-4">
              <li>
                <Link
                  href="/login"
                  className="text-text hover:text-primary font-medium py-1 px-3 rounded-md text-md flex items-center space-x-1 transition-all"
                >
                  <span>Login</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-white bg-button hover:bg-my-button-hover font-medium py-2 px-3 rounded-lg text-md flex items-center space-x-1 transition-all ease-in-out"
                >
                  Cadastro
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Menu Móvel (Overlay) */}
      {/* Renderizado condicionalmente baseado no estado isMenuOpen */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-card shadow-lg py-6 border-t border-border z-10">
          <ul className="flex flex-col items-center gap-4">
            <li>
              <Link
                href="/services"
                className="text-text hover:text-primary font-medium py-2 px-4 block w-full text-center"
                onClick={() => setIsMenuOpen(false)} // Fecha o menu ao clicar no link
              >
                Serviços
              </Link>
            </li>
            <li>
              <Link
                href="/aboutUs"
                className="text-text hover:text-primary font-medium py-2 px-4 block w-full text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre nós
              </Link>
            </li>
            <li>
              <Link
                href="/#plans"
                className="text-text hover:text-primary font-medium py-2 px-4 block w-full text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Preços
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-text hover:text-primary font-medium py-2 px-4 block w-full text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Contato
              </Link>
            </li>
            {/* Separador visual para os botões de autenticação */}
            <li className="w-full border-t border-border pt-4 mt-4">
              <Link
                href="/login"
                className="text-text hover:text-primary font-medium py-2 px-4 block w-full text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                href="/register"
                // Ajuste de classes para centralizar o botão de cadastro no mobile
                className="text-white bg-button hover:bg-my-button-hover font-medium py-2 px-12 block w-full text-center rounded-lg mx-auto "
                onClick={() => setIsMenuOpen(false)}
              >
                Cadastre-se
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}