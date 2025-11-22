"use client"

import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";

function Pricing() {
  return (
  <section
    id="plans"
    className="my-16 py-[250px] md:pt-[96px] px-16 bg-gradient-to-tr from-[#2350cc] to-[#1C2792] clip-polygon-pricing  md:h-[880px]  border-button shadow-xl max-w-full w-full animate-fadeIn"
  >
    <h2 className="text-4xl font-semibold text-center mb-20 text-white">
      Escolha o Plano Ideal
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 justify-center gap-12 md:gap-8 my-12">
     
      <div className="bg-background p-6 rounded-lg shadow-lg text-center flex flex-col justify-between transform hover:scale-105 transition duration-300 w-full border-2 border-slate-300 hover:border-blue-500">
        <div>
          <h3 className="text-3xl font-bold text-text mb-4">Grátis</h3>
          <p className="text-text mb-6">Experimente o poder da IA sem custo.</p>
          <div className="text-4xl font-extrabold text-blue-600 mb-6">
            R$0<span className="text-xl font-normal">/mês</span>
          </div>
          <p className="text-text text-lg  mb-6">
            5 Gerações de Conteúdo por Mês
          </p>
          <ul className="text-text text-left space-y-2 mb-8">
            <li className="flex items-center">
              <FaCheckCircle className="text-green-500 mr-2" /> Acesso Completo
              ao Histórico
            </li>
            <li className="flex items-center">
              <FaCheckCircle className="text-green-500 mr-2" /> Geração de
              Textos Básicos
            </li>
            <li className="flex items-center text-gray-500 line-through">
              <FaCheckCircle className="text-gray-400 mr-2" /> Otimização
              Avançada (SEO/GMB)
            </li>
          </ul>
        </div>
        <Link
          href="/register"
          className="bg-blue-600 text-md text-white hover:bg-blue-800 font-semibold py-3 px-6 rounded-full cursor-pointer"
        >
          Comece Grátis
        </Link>
      </div>

      
      <div className="bg-background p-6 rounded-lg shadow-lg text-center flex flex-col justify-between transform hover:scale-105 transition duration-300 w-full border-2 border-slate-300 hover:border-blue-500">
        <div>
          <h3 className="text-3xl font-bold text-text mb-4">Basic</h3>
          <p className="text-text mb-6">
            Para agências e corretores com alto volume.
          </p>
          <div className="text-4xl font-extrabold text-blue-600 mb-6">
            R$20,00<span className="text-xl font-normal">/mês</span>
          </div>
          <p className="text-text text-lg  mb-6">Até 20 conteúdos por mês!</p>
          <ul className="text-text text-left space-y-2 mb-8">
            <li className="flex items-center">
              <FaCheckCircle className="text-green-500 mr-2" /> Tudo do Plano
              Essencial
            </li>
            <li className="flex items-center">
              <FaCheckCircle className="text-green-500 mr-2" /> Otimização
              Avançada (SEO/GMB)
            </li>
            <li className="flex items-center text-gray-500 line-through">
              <FaCheckCircle className="text-gray-400 mr-2" /> Suporte
              Prioritário
            </li>
          </ul>
        </div>
        <Link
          href="/plans"
          className="bg-blue-600 text-md text-white font-semibold py-3 px-6 rounded-full cursor-pointer hover:bg-blue-800 transition duration-300 active:scale-95"
        >
          Quero Assinar
        </Link>
      </div>

      
      <div className="bg-yellow-400 text-text p-6 rounded-lg shadow-lg text-center flex flex-col justify-between transform hover:scale-105 transition duration-300 w-full  border-4 border-white scale-105 relative z-10">
        <div>
          <div className="absolute -top-6 right-1/2 translate-x-1/2 bg-gradient-to-tr from-purple-700 to-pink-600 text-white text-md font-bold px-4 py-2 rounded-lg shadow-lg">
            MAIS POPULAR!
          </div>
          <h3 className="text-3xl font-bold my-4">Premium</h3>
          <p className="opacity-90 mb-6">
            Desbloqueie o potencial máximo de suas campanhas.
          </p>
          <div className="text-4xl font-extrabold mb-6">
            R$40,00<span className="text-xl font-normal">/mês</span>
          </div>
          <p className="mb-6 text-lg ">50 Gerações de Conteúdo por Mês</p>
          <ul className="text-left space-y-2 mb-8">
            <li className="flex items-center">
              <FaCheckCircle className="text-pink-700 mr-2" /> Tudo do Plano
              Basic
            </li>
            <li className="flex items-center">
              <FaCheckCircle className="text-pink-700 mr-2" /> Acesso a
              Templates Premium
            </li>
            <li className="flex items-center">
              <FaCheckCircle className="text-pink-700 mr-2" /> Suporte
              Prioritário
            </li>
          </ul>
        </div>
        <Link
          href="/plans"
          className="bg-gradient-tr bg-gradient-to-tr from-purple-700 to-pink-500 text-white font-semibold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105 active:scale-95"
        >
          Escolher o Premium
        </Link>
      </div>

      <div className="bg-background p-6 rounded-lg shadow-lg text-center flex flex-col justify-between transform hover:scale-105 transition duration-300 w-full border-2 border-slate-300 hover:border-blue-500">
        <div>
          <h3 className="text-3xl font-bold text-text mb-4">Unlimited</h3>
          <p className="text-text mb-6">
            Para agências, Imobiliárias e corretores com alto volume.
          </p>
          <div className="text-4xl font-extrabold text-blue-600 mb-6">
            R$100,00<span className="text-xl font-normal">/mês</span>
          </div>
          <p className="text-text text-lg mb-6">Gerações ILIMITADAS!</p>
          <ul className="text-text text-left space-y-2 mb-8">
            <li className="flex items-center">
              <FaCheckCircle className="text-green-500 mr-2" /> Tudo do Plano
              Premium
            </li>
            <li className="flex items-center">
              <FaCheckCircle className="text-green-400 mr-2" /> Suporte
              Prioritário
            </li>
          </ul>
        </div>
        <Link
          href="/plans"
          className="bg-blue-600 text-md text-white font-semibold py-3 px-6 rounded-full cursor-pointer hover:bg-blue-800 transition duration-300 active:scale-95"
        >
          Quero Assinar
        </Link>
      </div>
    </div>
  </section>
  )
};

export default Pricing;
