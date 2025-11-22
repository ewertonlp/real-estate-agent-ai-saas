"use client"; 

import Link from "next/link";
import { useState } from "react"; 
import { FaBars, FaTimes } from "react-icons/fa"; 

export default function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); 

  return (
    <header className="bg-transparent relative py-6 w-full top-0 left-0">
      <div className="max-w-7xl w-full flex justify-between items-center mx-auto px-4 sm:px-6 lg:px-8"> 
        
        <Link
          href="/"
          className="text-2xl font-bold text-white hover:scale-110 transition-all  ease-out z-20" 
        >
          Realtor AI
        </Link>

       
        <button
          className="md:hidden text-white text-2xl z-20" 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        
        <nav className="hidden md:flex items-center justify-center gap-4"> 
          <ul className="flex items-center justify-center gap-4">
            <li>
              <Link
                href="/services"
                className="text-white hover:scale-110 font-medium py-1 px-3 text-md flex items-center space-x-1 transition-all ease-out"
              >
                <span>Serviços</span>
              </Link>
            </li>
            <li>
              <Link
                href="/aboutUs"
                className="text-white hover:scale-110 font-medium py-1 px-3 text-md flex items-center space-x-1 transition-all ease-out"
              >
                Sobre nós
              </Link>
            </li>
            <li>
              <Link
                href="/#plans"
                className="text-white hover:scale-110 font-medium py-1 px-3 text-md flex items-center space-x-1 transition-all ease-out"
              >
                Preços
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-white hover:scale-110 font-medium py-1 px-3 text-md flex items-center space-x-1 transition-all ease-out"
              >
                <span>Contato</span>
              </Link>
            </li>
          </ul>
        </nav>

       
        <div className="hidden md:flex"> 
          <nav>
            <ul className="flex items-center justify-center gap-4">
              <li>
                <Link
                  href="/login"
                  className="text-white hover:scale-110 font-medium py-1 px-3 rounded-md text-md flex items-center space-x-1 transition-all ease-out"
                >
                  <span>Login</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-white border border-white/70 bg-transparent hover:scale-110 font-medium py-2 px-6 rounded-full text-md flex items-center space-x-1 transition-all ease-in-out"
                >
                  Cadastro
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 h-screen right-0 bg-gradient-to-tr from-[#2350cc] to-[#1C2792] shadow-lg py-6 border-t border-white/50 z-50">
          <ul className="flex flex-col items-center gap-4 text-white">
            <li>
              <Link
                href="/services"
                className="hover:text-neutral-200 font-medium py-2 px-4 block w-full text-center"
                onClick={() => setIsMenuOpen(false)} 
              >
                Serviços
              </Link>
            </li>
            <li>
              <Link
                href="/aboutUs"
                className="hover:text-neutral-200 font-medium py-2 px-4 block w-full text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre nós
              </Link>
            </li>
            <li>
              <Link
                href="/#plans"
                className="hover:text-neutral-200  font-medium py-2 px-4 block w-full text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Preços
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-neutral-200  font-medium py-2 px-4 block w-full text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Contato
              </Link>
            </li>
          
            <li className="w-full border-t border-white/50 pt-4 mt-4">
            
              <Link
                href="/login"
                className="hover:text-neutral-200  font-medium py-2 px-4 block w-full text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                href="/register"
                className="bg-gradient-to-tr from-purple-700 to-pink-500  text-white font-medium py-3 px-12 block w-full text-center rounded-full mx-auto "
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