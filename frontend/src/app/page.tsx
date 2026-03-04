// frontend/src/app/page.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import {
  FaRocket,
  FaLightbulb,
  FaChartLine,
  FaShieldAlt,
  FaWhatsapp,
  FaInstagram,
  FaFacebook,
  FaTelegramPlane,
  FaArrowDown,
} from "react-icons/fa"; 
import { MdOutlineEmail } from "react-icons/md";
import PublicHeader from "@/components/publicHeader";
import Footer from "@/components/footer";
import FAQ from "@/components/FAQ";
import Pricing from "@/components/pricing";

export default function Home() {
  return (
    <div className="min-h-screen mx-auto text-white bg-gray-50 flex flex-col items-center justify-center overflow-hidden">
      <div className="min-h-screen w-full clip-polygon bg-gradient-to-tr from-primary to-primary/75 drop-shadow-lg">
        <div className="absolute top-0 left-0 w-96 h-48 bg-primary rounded-full blur-3xl opacity-40"></div>

        <div className="absolute top-0 right-0 w-[768px] h-48 bg-#ffffff rounded-full blur-3xl opacity-50"></div>

        <div className="absolute bottom-0 right-60 w-96 h-48 bg-#8B5CF6 rounded-full blur-2xl opacity-75"></div>
        <PublicHeader />
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center mx-auto relative text-center md:my-12 px-4 pt-8 max-w-7xl w-full ">
          <div className="mb-12 px-2">
            <h1 className="text-3xl md:text-5xl font-semibold mb-6 md:leading-[1.25] tracking-tight animate-fade-in-down leading-tight drop-shadow-md">
              Gere descrições de imóveis irresistíveis em segundos com IA
            </h1>

            <p className="text-white text-xl md:text-2xl mb-8 animate-fade-in-up md:max-w-3xl mx-auto">
              Cancele o bloqueio criativo. Crie anúncios para redes sociais, legendas e descrições completas para seus imóveis com um clique, mesmo que você não seja um expert em redação. <br />
              <br />
              <strong>Fácil, Rápido e Direto!</strong>
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-12">
              <Link
                href="#plans"
                className="bg-gradient-to-tr from-orange-700 to-pink-600  text-white text-center font-semibold py-4 rounded-md text-lg shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-100 w-full md:w-[300px]"
              >
                Experimente Grátis
              </Link>
              
              <Link
                href="/login"
                className="border border-white/70 bg-transparent text-white text-center font-semibold py-4 px-10 rounded-md text-lg shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 w-full md:w-[300px]"
              >
                Já Tenho Cadastro
              </Link>
            </div>
          </div>
          <div className="bg-transparent mt-4  animate-fade-in-up md:ml-10">
          </div>
        </section>
      </div>

      <section className="bg-gray-50 text-text border-button my-12 py-12 px-16 max-w-full transition-transform duration-500">
        <h2 className="text-[2.5rem] font-medium text-center mb-8 text-gray-800">
          Por Que Escolher AuraSync AI?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="flex flex-col items-center p-6 rounded-lg border border-primary shadow-md text-center transform hover:scale-105 hover:shadow-xl transition duration-300">
            <FaRocket className="text-primary text-5xl mb-4 animate-bounce-slow" />
            <h3 className="text-2xl font-semibold mb-2 text-primary">
              Acelere Suas Vendas
            </h3>
            <p className="text-gray-700 text-sm">
              Gere conteúdo otimizado instantaneamente e nunca mais perca uma
              oportunidade por falta de tempo.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 rounded-lg bg-card-light border border-green-400 shadow-md text-center transform hover:scale-105 hover:shadow-xl transition duration-300">
            <FaLightbulb className="text-secondary text-5xl mb-4 animate-pulse-slow" />
            <h3 className="text-2xl font-semibold mb-2 text-secondary">
              Inovação ao Seu Alcance
            </h3>
            <p className="text-gray-700 text-sm">
              Aproveite a Inteligência Artificial para criar textos que
              realmente se conectam com seu público.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 rounded-lg bg-card-light border border-ai shadow-md text-center transform hover:scale-105 hover:shadow-xl transition duration-300">
            <FaChartLine className="text-ai text-5xl mb-4 animate-fade-in-left-slow" />
            <h3 className="text-2xl font-semibold mb-2 text-ai">
              Maximize Sua Visibilidade
            </h3>
            <p className="text-gray-700 text-sm">
              Conteúdo otimizado para SEO e redes sociais que coloca seus
              imóveis em destaque.
            </p>
          </div>
          <div className="flex flex-col items-center p-6 rounded-lg bg-card-light border border-red-400 shadow-md text-center transform hover:scale-105 hover:shadow-xl transition duration-300">
            <FaShieldAlt className="text-red-500 text-5xl mb-4 animate-fade-in-right-slow" />
            <h3 className="text-2xl font-semibold mb-2 text-red-500">
              Foque no Que Importa
            </h3>
            <p className="text-gray-700 text-sm">
              Deixe a criação de texto com a IA e dedique-se ao atendimento e
              fechamento de negócios.
            </p>
          </div>
        </div>
      </section>

      <section className="text-center my-16 max-w-4xl w-full animate-fade-in-up-slow">
        <h2 className="text-[2.25rem] font-medium mb-2 text-gray-800">
          Como Funciona?
        </h2>
        <p className="text-[1.5rem] text-gray-800">Simples e Rápido!</p>
        <div className="relative flex justify-center items-center mt-10 mx-3">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-button -z-10 hidden md:block"></div>{" "}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center bg-gray-50 text-text border border-button p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 relative circle-step">
              <div className="w-16 h-16 rounded-full bg-button text-white flex items-center justify-center text-3xl font-bold mb-4 z-10 step-number">
                1
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-primary">
                Descreva o Imóvel
              </h3>
              <p className="text-gray-800 text-md">
                Insira detalhes como tipo, quartos, localização e diferenciais.
              </p>
            </div>
            <div className="flex flex-col items-center bg-gray-50 border border-button p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 relative circle-step">
              <div className="w-16 h-16 rounded-full bg-button text-white flex items-center justify-center text-3xl font-bold mb-4 z-10 step-number">
                2
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-primary">
                Escolha o Estilo
              </h3>
              <p className="text-gray-700 text-md">
                Selecione tom de voz, plataforma e otimizações (SEO, CTA,
                Emojis).
              </p>
            </div>
            <div className="flex flex-col items-center bg-gray-50  border border-button p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 relative circle-step">
              <div className="w-16 h-16 rounded-full bg-button text-white flex items-center justify-center text-3xl font-bold mb-4 z-10 step-number">
                3
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-primary">
                Gere e Publique!
              </h3>
              <p className="text-gray-700 text-md">
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

        <div className="relative flex-col justify-center w-full max-w-md mx-3 md:mx-0 px-4 py-8 rounded-lg bg-gray-50 shadow-xl z-10 border border-border hover:shadow-2xl transition-shadow duration-300">
          <div className="relative">
            <h3 className="text-3xl font-medium mb-4 text-gray-700">Divulgue</h3>
            <p className="text-lg text-gray-700">
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

      <Pricing />

      
      <section className="text-center px-6 md:px-12 py-16 bg-gray-100 border border-border text-text rounded-lg shadow-xl max-w-4xl mx-3 animate-fade-in-up my-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-700 leading-tight">
          Pense no Retorno do Seu Investimento
        </h2>
        <p className="text-xl md:text-2xl text-gray-700 mb-8 opacity-90 max-w-3xl mx-auto leading-[1.5]">
          Com um investimento de apenas R$40/mês, o AuraSync AI pode{" "}
          <strong>transformar seus resultados.</strong>
        </p>
        <p className="text-xl md:text-2xl text-gray-700 mb-8 opacity-90 max-w-3xl mx-auto leading-[1.5]">
          Se a ferramenta te ajudar a fechar apenas uma{" "}
          <strong>venda adicional de um imóvel</strong> de R$300.000, gerando
          uma comissão média de R$6.000, o seu custo mensal se revela{" "}
          <strong>totalmente superado</strong> pelo ganho, tornando-se um
          detalhe diante da <strong>escala do seu sucesso.</strong>
        </p>
        <p className="text-2xl md:text-3xl font-medium text-gray-700 mb-12 opacity-90 max-w-3xl mx-auto">
          Não é um custo, é um investimento para <strong>impulsionar</strong>{" "}
          suas vendas.
        </p>
        <Link
          href="/register"
          className="bg-gradient-to-tr from-orange-700 to-pink-500 text-white  font-bold py-4 px-12 rounded-sm md:text-xl shadow-xl transition duration-300 hover:scale-105 active:scale-95"
        >
          REGISTRE-SE AGORA!
        </Link>
      </section>

      <section className="text-center px-4 py-16 bg-gray-100 border border-border  text-text rounded-lg shadow-xl max-w-4xl mx-3 animate-fade-in-up my-16">
        <FAQ />
      </section>

      <section className="bg-gray-100 text-center shadow-xl border border-border rounded-lg my-12 py-12 px-16 max-w-full transition-transform duration-500">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-700 leading-tight">
          Chega de Bloqueio Criativo
          <br />
        </h2>
        <h3 className="text-3xl md:text-4xl font-bold mb-6 text-gray-700 leading-tight">
          Comece a Vender Mais Hoje!
        </h3>
        <p className="text-xl md:text-2xl text-gray-700 mb-12 opacity-90 max-w-3xl mx-auto">
          Milhares de corretores já estão otimizando seu tempo e suas vendas com
          a IA. Qual será sua próxima Grande Venda?
        </p>
        <Link
          href="/register"
          className="bg-gradient-to-tr from-orange-700 to-pink-500 text-white hover:scale-110  font-bold py-4 px-12 rounded-sm md:text-xl shadow-2xl transition duration-300 transform active:scale-95"
        >
          CADASTRE-SE GRÁTIS!
        </Link>
      </section>
      <Footer />

      
    </div>
  );
}
