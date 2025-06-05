"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <div className="relative w-full  mx-auto overflow-hidden bg-white">
      {/* Fundo com esferas azuis */}
      <div className="absolute top-4 left-4 w-28 h-56 bg-button opacity-20 rounded-full blur-3xl pointer-events-none " />
      <div className="absolute bottom-0 right-2 w-24 h-40 bg-button opacity-20 rounded-full blur-3xl pointer-events-none " />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl w-full mx-auto mt-8 z-10">
        {" "}
        <Link
          href="/"
          className="text-2xl font-bold text-text hover:text-slate-300 transition-colors"
        >
          AuraSync
        </Link>
        <div className="">
          <h2 className="mb-8 font-medium">Produto</h2>
          <nav className="">
            <ul className="flex-col gap-4">
              <li>
                <Link
                  href="/services"
                  className="  text-text hover:text-hover  py-1 text-sm flex items-center space-x-1 transition-all"
                >
                  <span>Serviços</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/tutorial"
                  className=" text-text hover:text-hover py-1  text-sm flex items-center space-x-1 transition-all"
                >
                  Tutorial
                </Link>
              </li>
              <li>
                <Link
                  href="/#plans"
                  className=" text-text hover:text-hover  py-1 text-sm flex items-center space-x-1 transition-all"
                >
                  Preços
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="  text-text hover:text-hover py-1  text-sm flex items-center space-x-1 transition-all"
                >
                  <span>FAQ</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="">
          <h2 className="mb-8 font-medium">Navegação</h2>
          <nav className="">
            <ul className="flex-col gap-4 list-none -pl-2">
              <li>
                <Link
                  href="/aboutUs"
                  className=" text-text hover:text-hover py-1  text-sm flex items-center space-x-1 transition-all"
                >
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link
                  href="/politica-reembolso"
                  className=" text-text hover:text-hover  py-1  text-sm flex items-center space-x-1 transition-all"
                >
                  Reembolso
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="  text-text hover:text-hover py-1  text-sm flex items-center space-x-1 transition-all"
                >
                  <span>Contato</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="  text-text hover:text-hover py-1 text-sm flex items-center space-x-1 transition-all"
                >
                  <span>FAQ</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="">
          <h2 className="mb-8 font-medium">Contate-nos</h2>
          <nav className="">
            <ul className="flex gap-4 list-none pl-0">
              <li>
                <Link
                  href="www.instagram.com/aurasync"
                  className="text-text hover:text-hover py-1 text-sm flex items-center space-x-1 transition-all"
                >
                  Instagram
                </Link>
              </li>
              <li>
                <Link
                  href="mailto:info@aurasyncai.com"
                  className=" text-text hover:text-hover py-1  text-sm flex items-center space-x-1 transition-all"
                >
                  Email
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="mt-8 border-t-[1px] border-white/25 max-w-7xl w-full mx-auto pb-4">
        <div className="flex justify-between items-center mt-4">
          <div className="flex-1 md:flex justify-start gap-4">
            <Link
              href="/politica-privacidade"
              className="text-text hover:text-hover py-1  text-sm  transition-all"
            >
              Privacidade
            </Link>

            <Link
              href="/termos-uso"
              className=" text-text hover:text-hover  py-1  text-sm transition-all"
            >
              Termos de Uso
            </Link>
          </div>
          <div className="flex-1 md:flex justify-end gap-4">
            <p className="text-xs text-text">&copy; 2025 - AuraSync AI</p>
          </div>
        </div>
      </div>
    </div>
  );
}
