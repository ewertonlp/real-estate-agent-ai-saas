// frontend/src/components/publicHeader.tsx
"use client"; 

import Link from "next/link";

export default function PublicHeader() {
  return (
    <header className="bg-card-light py-6 shadow-sm w-full">
      <div className=" max-w-7xl w-full flex justify-between items-center mx-auto">
        {/* Título/Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-text hover:text-slate-300 transition-colors"
        >
          AuraSync AI
        </Link>
        <nav className="">
          <ul className="flex items-center justify-center gap-4">
            <li>
              <Link
                href="/services"
                className="  text-text hover:text-hover font-medium py-1 px-3 text-md flex items-center space-x-1 transition-all"
              >
                <span>Serviços</span>
              </Link>
            </li>
            <li>
              <Link
                href="/aboutUs"
                className=" text-text hover:text-hover font-medium py-1 px-3 text-md flex items-center space-x-1 transition-all"
              >
                Sobre nós
              </Link>
            </li>
            <li>
              <Link
                href="/#plans"
                className=" text-text hover:text-hover  font-medium py-1 px-3 text-md flex items-center space-x-1 transition-all"
              >
                Preços
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="  text-text hover:text-hover font-medium py-1 px-3  text-md flex items-center space-x-1 transition-all"
              >
                <span>Contato</span>
              </Link>
            </li>
            
          </ul>
        </nav>
        <div className="flex">
          <nav className="">
            <ul className="flex items-center justify-center gap-4">
              <li>
                <Link
                  href="/login"
                  className="  text-text hover:text-hover font-medium py-1 px-3 rounded-md text-md flex items-center space-x-1 transition-all"
                >
                  <span>Login</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className=" text-white bg-button hover:bg-hover font-medium py-2 px-3 rounded-lg text-md flex items-center space-x-1 transition-all"
                >
                  Cadastre-se
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}