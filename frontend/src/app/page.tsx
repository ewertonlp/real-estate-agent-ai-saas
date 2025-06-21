// frontend/src/app/page.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import {
  FaRocket,
  FaLightbulb,
  FaChartLine,
  FaShieldAlt,
  FaCheckCircle,
  FaWhatsapp,
  FaInstagram,
  FaFacebook,
  FaTelegramPlane,
  FaArrowDown,
} from "react-icons/fa"; // Novos ícones para persuasão
import { MdOutlineEmail } from "react-icons/md";
import PublicHeader from "@/components/publicHeader";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-text flex flex-col items-center justify-center overflow-hidden">
      <PublicHeader />
      {/* Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 relative text-start md:my-20 px-4 pt-20 max-w-7xl w-full">
        <div className="">
          <h1 className="text-4xl md:text-6xl font-medium mb-6 leading-[1.3] md:leading-[1.5] tracking-tight animate-fade-in-down">
            Domine o Mercado Imobiliário com Conteúdo Imbatível.
          </h1>
          {/* Ajustei o mb-16 para mb-8 aqui para transferir o espaçamento para o contêiner dos botões */}
          <p className="text-xl md:text-2xl mb-8 animate-fade-in-up md:max-w-3xl mx-auto">
            Gere conteúdo para posts, blog ou para sua lista de clientes, através de Inteligência Artificial. <br/>
            <strong>Fácil, Rápido e
            Direto!</strong>
          </p>

          <div className="flex flex-col md:flex-row gap-4 mb-16">
            <Link
              href="#plans"
              // w-full: Ocupa a largura total do seu contêiner flexível
              // Removido 'mr-4' pois 'gap-4' já cuida do espaçamento
              className="bg-button border border-button text-white text-center font-semibold py-4 rounded-lg text-lg shadow-2xl hover:bg-hover transition-all duration-300 transform hover:scale-102 active:scale-95 w-full md:w-[300px]"
            >
              Comece Hoje Mesmo!
            </Link>
            <Link
              href="/login"
              // w-full: Ocupa a largura total do seu contêiner flexível
              className="border border-button text-button text-center font-semibold py-4 px-10 rounded-lg text-lg shadow-xl hover:bg-white hover:text-blue-800 transition-all duration-300 transform hover:scale-102 active:scale-95 w-ful md:w-[300px]"
            >
              Já sou AuraSync AI
            </Link>
          </div>
        </div>
        <div className="bg-transparent mt-4 md:-mt-20 animate-fade-in-up md:ml-10">
          <Image
            src="/aurasync.jpg"
            alt="Corretora de imóveis"
            width={600}
            height={100}
          />
        </div>
      </section>

      {/* Benefits/Why Choose Us Section */}
      <section className="bg-card text-text border border-button mx-3 my-10 p-8 rounded-xl shadow-xl max-w-7xl transition-transform duration-500">
        <h2 className="text-[2.5rem] font-medium text-center mb-12 text-text">
          Por Que Escolher AuraSync AI?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-center p-6 rounded-lg  border border-blue-500 shadow-md text-center transform hover:scale-105 transition duration-300">
            <FaRocket className="text-button text-5xl mb-4 animate-bounce-slow" />
            <h3 className="text-2xl font-semibold mb-2 text-button">
              Acelere Suas Vendas
            </h3>
            <p className="text-text text-sm">
              Gere conteúdo otimizado instantaneamente e nunca mais perca uma
              oportunidade por falta de tempo.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 rounded-lg bg-card-light border border-green-400 shadow-md text-center transform hover:scale-105 transition duration-300">
            <FaLightbulb className="text-green-500 text-5xl mb-4 animate-pulse-slow" />
            <h3 className="text-2xl font-semibold mb-2 text-green-500">
              Inovação ao Seu Alcance
            </h3>
            <p className="text-text text-sm">
              Aproveite a Inteligência Artificial para criar textos que
              realmente se conectam com seu público.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 rounded-lg bg-card-light border border-purple-400 shadow-md text-center transform hover:scale-105 transition duration-300">
            <FaChartLine className="text-purple-500 text-5xl mb-4 animate-fade-in-left-slow" />
            <h3 className="text-2xl font-semibold mb-2 text-purple-500">
              Maximize Sua Visibilidade
            </h3>
            <p className="text-text text-sm">
              Conteúdo otimizado para SEO e redes sociais que coloca seus
              imóveis em destaque.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 rounded-lg bg-card-light border border-red-400 shadow-md text-center transform hover:scale-105 transition duration-300">
            <FaShieldAlt className="text-red-500 text-5xl mb-4 animate-fade-in-right-slow" />
            <h3 className="text-2xl font-semibold mb-2 text-red-500">
              Foque no Que Importa
            </h3>
            <p className="text-text text-sm">
              Deixe a criação de texto com a IA e dedique-se ao atendimento e
              fechamento de negócios.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section (Optional, but adds clarity) */}
      <section className="text-center my-16 max-w-4xl w-full animate-fade-in-up-slow">
        <h2 className="text-[2.25rem] font-medium mb-2 text-text">
          Como Funciona?
        </h2>
        <p className="text-[1.5rem]">Simples e Rápido!</p>
        <div className="relative flex justify-center items-center mt-10 mx-3">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-button -z-10 hidden md:block"></div>{" "}
          {/* Linha conectora */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center bg-card text-text border border-button p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 relative circle-step">
              <div className="w-16 h-16 rounded-full bg-button text-white flex items-center justify-center text-3xl font-bold mb-4 z-10 step-number">
                1
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-button">
                Descreva o Imóvel
              </h3>
              <p className="text-text text-md">
                Insira detalhes como tipo, quartos, localização e diferenciais.
              </p>
            </div>
            <div className="flex flex-col items-center bg-card text-text border border-button p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 relative circle-step">
              <div className="w-16 h-16 rounded-full bg-button text-white flex items-center justify-center text-3xl font-bold mb-4 z-10 step-number">
                2
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-button">
                Escolha o Estilo
              </h3>
              <p className="text-text text-md">
                Selecione tom de voz, plataforma e otimizações (SEO, CTA,
                Emojis).
              </p>
            </div>
            <div className="flex flex-col items-center bg-card text-text border border-button p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 relative circle-step">
              <div className="w-16 h-16 rounded-full bg-button text-white flex items-center justify-center text-3xl font-bold mb-4 z-10 step-number">
                3
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-button">
                Gere e Publique!
              </h3>
              <p className="text-text text-md">
                Receba seu conteúdo exclusivo em segundos e publique onde
                quiser!
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative text-center my-6 max-w-7xl mx-3 w-full flex flex-col items-center gap-10">
        <div className="relative flex justify-center w-full max-w-md p-4 rounded-lg bg-card shadow-xl z-10 border border-border hover:shadow-2xl transition-shadow duration-300">
          <Image
            src="/prompt-imoveis.png"
            alt="prompt para gerar conteudo por IA"
            width={400}
            height={100}
          />

          <FaArrowDown className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 text-3xl text-primary z-30 " />
        </div>

        <div className="relative flex justify-center w-full max-w-md p-4 rounded-lg bg-card shadow-xl z-10 border border-border hover:shadow-2xl transition-shadow duration-300">
          <Image
            src="/conteudo-imoveis.png"
            alt="prompt para gerar conteudo por IA"
            width={400}
            height={100}
          />

          <FaArrowDown className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 text-3xl text-primary z-30" />
        </div>

        <div className="relative flex-col justify-center w-full max-w-md mx-3 md:mx-0 px-4 py-8 rounded-lg bg-card shadow-xl z-10 border border-border hover:shadow-2xl transition-shadow duration-300">
          <div className="relative">
            <h3 className="text-3xl font-medium mb-4 text-text">Divulgue</h3>
            <p className="text-lg">
              Envie diretamente para sua lista de clientes ou use como legenda
              em seus posts.{" "}
            </p>
          </div>
          <div className="flex justify-center items-center gap-8 mt-12 ">
            <FaWhatsapp className="text-green-500 w-10 h-10" />
            <FaInstagram className="text-pink-600 w-10 h-10" />
            <FaFacebook className="text-blue-600 w-10 h-10" />
            <FaTelegramPlane className="text-blue-400 w-10 h-10" />
            <MdOutlineEmail className="text-slate-400 w-10 h-10" />
          </div>
        </div>
      </section>

      {/* Pricing Section - Highly Persuasive */}
      <section
        id="plans"
        className="my-16 py-12 px-8 rounded-xl bg-card border border-button shadow-xl max-w-7xl w-full animate-fadeIn"
      >
        <h2 className="text-4xl font-semibold text-center mb-20 text-text">
          Escolha o Plano Ideal
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 justify-center gap-12 md:gap-8">
          {/* Free Tier */}
          <div className="bg-background p-6 rounded-lg shadow-lg text-center flex flex-col justify-between transform hover:scale-105 transition duration-300 w-full border-2 border-slate-300 hover:border-blue-500">
            <div>
              <h3 className="text-3xl font-bold text-text mb-4">Grátis</h3>
              <p className="text-text mb-6">
                Experimente o poder da IA sem custo.
              </p>
              <div className="text-4xl font-extrabold text-blue-600 mb-6">
                R$0<span className="text-xl font-normal">/mês</span>
              </div>
              <p className="text-text text-lg  mb-6">
                5 Gerações de Conteúdo por Mês
              </p>
              <ul className="text-text text-left space-y-2 mb-8">
                <li className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2" /> Acesso
                  Completo ao Histórico
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
              className="bg-button text-md text-white hover:bg-blue-600 font-semibold py-3 px-6 rounded-lg cursor-pointer"
            >
              Comece Grátis
            </Link>
          </div>

          {/* Basic Tier - Example */}
          <div className="bg-background p-6 rounded-lg shadow-lg text-center flex flex-col justify-between transform hover:scale-105 transition duration-300 w-full border-2 border-slate-300 hover:border-blue-500">
            <div>
              <h3 className="text-3xl font-bold text-text mb-4">Basic</h3>
              <p className="text-text mb-6">
                Para agências e corretores com alto volume.
              </p>
              <div className="text-4xl font-extrabold text-blue-600 mb-6">
                R$20,00<span className="text-xl font-normal">/mês</span>
              </div>
              <p className="text-text text-lg  mb-6">
                Até 20 conteúdos por mês!
              </p>
              <ul className="text-text text-left space-y-2 mb-8">
                <li className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2" /> Tudo do
                  Plano Essencial
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
              className="bg-button text-md text-white font-semibold py-3 px-6 rounded-lg cursor-pointer hover:bg-blue-600 transition duration-300 active:scale-95"
            >
              Quero Assinar
            </Link>
          </div>

          {/* Premium Tier - Example (or Unlimited) */}
          <div className="bg-button text-white p-6 rounded-lg shadow-lg text-center flex flex-col justify-between transform hover:scale-105 transition duration-300 w-full  border-4 border-yellow-400 scale-105 relative z-10">
            <div>
              <div className="absolute -top-7 right-1/2 translate-x-1/2 bg-yellow-400 text-blue-900 text-md font-bold px-3 py-1 rounded-lg shadow-lg">
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
                  <FaCheckCircle className="text-yellow-400 mr-2" /> Tudo do
                  Plano Basic
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="text-yellow-400 mr-2" /> Acesso a
                  Templates Premium
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="text-yellow-400 mr-2" /> Suporte
                  Prioritário
                </li>
              </ul>
            </div>
            <Link
              href="/plans"
              className="bg-yellow-300 text-blue-800 font-semibold py-3 px-6 rounded-lg hover:bg-yellow-300 transition duration-300 transform hover:scale-105 active:scale-95 glow-button"
            >
              Escolher o Premium
            </Link>
          </div>

          {/* Premium Tier - Example (or Unlimited) */}
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
                  <FaCheckCircle className="text-green-500 mr-2" /> Tudo do
                  Plano Premium
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="text-green-400 mr-2" /> Suporte
                  Prioritário
                </li>
              </ul>
            </div>
            <Link
              href="/plans"
              className="bg-button text-md text-white font-semibold py-3 px-6 rounded-lg cursor-pointer hover:bg-blue-600 transition duration-300 active:scale-95"
            >
              Quero Assinar
            </Link>
          </div>
        </div>
      </section>

      {/* NEW ROI SECTION */}
      <section className="text-center px-6 md:px-12 py-16 bg-card border border-button text-text rounded-xl shadow-2xl max-w-4xl mx-3 animate-fade-in-up my-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-text leading-tight">
          Pense no Retorno do Seu Investimento
        </h2>
        <p className="text-xl md:text-2xl text-text mb-8 opacity-90 max-w-3xl mx-auto leading-[1.5]">
          Com um investimento de apenas R$40/mês, o AuraSync AI pode{" "}
          <strong>transformar seus resultados.</strong>
        </p>
        <p className="text-xl md:text-2xl text-text mb-8 opacity-90 max-w-3xl mx-auto leading-[1.5]">
          Se a ferramenta te ajudar a fechar apenas uma{" "}
          <strong>venda adicional de um imóvel</strong> de R$300.000, gerando
          uma comissão média de R$6.000, o seu custo mensal se revela{" "}
          <strong>totalmente superado</strong> pelo ganho, tornando-se um
          detalhe diante da <strong>escala do seu sucesso.</strong>
        </p>
        <p className="text-2xl md:text-3xl font-medium text-text mb-12 opacity-90 max-w-3xl mx-auto">
          Não é um custo, é um investimento para <strong>impulsionar</strong>{" "}
          suas vendas.
        </p>
        <Link
          href="/register"
          className="bg-yellow-400 text-blue-900 font-bold py-4 px-12 rounded-lg md:text-xl shadow-xl hover:bg-yellow-300 transition duration-300 transform hover:scale-105 active:scale-95 glow-button"
        >
        REGISTRE-SE AGORA!
        </Link>
      </section>
      {/* END NEW ROI SECTION */}

      {/* Final Call to Action */}
      <section className="text-center px-4 py-16 bg-card border border-button text-text rounded-xl shadow-xl max-w-4xl mx-3 animate-fade-in-up my-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-text leading-tight">
          Chega de Bloqueio Criativo
          <br />
        </h2>
        <h3 className="text-3xl md:text-4xl font-bold mb-6 text-text leading-tight">
          Comece a Vender Mais Hoje!
        </h3>
        <p className="text-xl md:text-2xl text-text mb-12 opacity-90 max-w-3xl mx-auto">
          Milhares de corretores já estão otimizando seu tempo e suas vendas com
          a IA. Qual será sua próxima Grande Venda?
        </p>
        <Link
          href="/register"
          className="bg-yellow-400 text-blue-900 font-bold py-4 px-12 rounded-lg md:text-xl shadow-2xl hover:bg-yellow-300 transition duration-300 transform hover:scale-105 active:scale-95 glow-button"
        >
          CADASTRE-SE GRÁTIS!
        </Link>
      </section>
      <Footer />

      {/* Global styles for animations and glow effect - Add to globals.css if preferred */}
      <style jsx global>{`
        .animate-fade-in-down {
          animation: fade-in-down 1s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
          animation-delay: 0.2s;
        }
        .animate-scale-in {
          animation: scale-in 0.8s ease-out forwards;
          animation-delay: 0.4s;
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
          animation-delay: 0.6s;
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s infinite ease-in-out;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s infinite ease-in-out;
        }
        .animate-fade-in-left-slow {
          animation: fade-in-left-slow 1.5s ease-out forwards;
          animation-delay: 0.8s;
        }
        .animate-fade-in-right-slow {
          animation: fade-in-right-slow 1.5s ease-out forwards;
          animation-delay: 1s;
        }
        .animate-fade-in-up-slow {
          animation: fade-in-up-slow 1.5s ease-out forwards;
          animation-delay: 1.2s;
        }

        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes pulse-slow {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }
        @keyframes fade-in-left-slow {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fade-in-right-slow {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fade-in-up-slow {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .glow-button {
          position: relative;
          z-index: 1;
        }
        .glow-button::before {
          content: "";
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(
            45deg,
            #ffd700,
            #ffa500,
            #ffd700
          ); /* Dourado */
          filter: blur(8px);
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s ease-in-out;
          border-radius: 9999px; /* Para coincidir com rounded-full */
        }
        .glow-button:hover::before {
          opacity: 1;
        }
        .circle-step {
          position: relative;
        }
        .step-number {
          border: 4px solid white; /* Borda branca para destacar o número */
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        /* Responsividade da linha conectora */
        @media (min-width: 768px) {
          /* md */
          .circle-step:nth-child(1)::after {
            content: "";
            position: absolute;
            top: 50%;
            right: -50px; /* Metade da distância entre os círculos */
            width: 100px; /* Distância entre os círculos */
            height: 2px;
            background-color: #60a5fa; /* Cor azul 400 */
            z-index: -1;
          }
          .circle-step:nth-child(2)::after {
            content: "";
            position: absolute;
            top: 50%;
            right: -50px;
            width: 100px;
            height: 2px;
            background-color: #60a5fa;
            z-index: -1;
          }
        }
      `}</style>
    </div>
  );
}
