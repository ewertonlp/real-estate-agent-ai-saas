// frontend/src/app/page.tsx
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 text-white flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="text-center mb-16 px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4 animate-fade-in-down">
          Corretor AI: Seu Assistente Imobiliário Inteligente
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in-up">
          Gere conteúdo de marketing imobiliário de alta qualidade em segundos, otimizado para redes sociais e SEO.
        </p>
        <div className="space-x-4 animate-scale-in">
          <Link
            href="/register"
            className="bg-yellow-400 text-blue-900 font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:bg-yellow-300 transition duration-300 transform hover:scale-105"
          >
            Comece Grátis Agora!
          </Link>
          <Link
            href="/login"
            className="border-2 border-white text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:bg-white hover:text-blue-800 transition duration-300 transform hover:scale-105"
          >
            Login
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white text-gray-800 p-10 rounded-lg shadow-2xl max-w-4xl w-full mb-16 animate-fade-in">
        <h2 className="text-4xl font-bold text-center mb-10 text-blue-700">Recursos Poderosos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-start p-4 rounded-md bg-gray-50 shadow-sm">
            <Image src="/icons/ai-content.svg" alt="AI Content" width={50} height={50} className="mr-4" />
            <div>
              <h3 className="text-2xl font-semibold mb-2">Geração de Conteúdo Inteligente</h3>
              <p className="text-gray-600">Crie descrições de imóveis, legendas para redes sociais e textos para anúncios com IA avançada.</p>
            </div>
          </div>
          <div className="flex items-start p-4 rounded-md bg-gray-50 shadow-sm">
            <Image src="/icons/seo-optimized.svg" alt="SEO Optimized" width={50} height={50} className="mr-4" />
            <div>
              <h3 className="text-2xl font-semibold mb-2">Otimização para SEO e GMB</h3>
              <p className="text-gray-600">Conteúdo otimizado para motores de busca e Google Meu Negócio, aumentando sua visibilidade online.</p>
            </div>
          </div>
          <div className="flex items-start p-4 rounded-md bg-gray-50 shadow-sm">
            <Image src="/icons/social-media.svg" alt="Social Media" width={50} height={50} className="mr-4" />
            <div>
              <h3 className="text-2xl font-semibold mb-2">Adaptação para Plataformas</h3>
              <p className="text-gray-600">Gere conteúdo personalizado para Instagram, Facebook, WhatsApp e blogs.</p>
            </div>
          </div>
          <div className="flex items-start p-4 rounded-md bg-gray-50 shadow-sm">
            <Image src="/icons/history.svg" alt="History" width={50} height={50} className="mr-4" />
            <div>
              <h3 className="text-2xl font-semibold mb-2">Histórico e Favoritos</h3>
              <p className="text-gray-600">Acesse e organize todo o seu conteúdo gerado, marque favoritos e reutilize-os facilmente.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Simplified for this example */}
      <section className="bg-white text-gray-800 p-10 rounded-lg shadow-2xl max-w-4xl w-full mb-16 animate-fade-in">
        <h2 className="text-4xl font-bold text-center mb-10 text-blue-700">Planos Flexíveis</h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          {/* Free Tier */}
          <div className="bg-gray-50 p-8 rounded-lg shadow-lg text-center transform hover:scale-105 transition duration-300 w-full md:w-1/2">
            <h3 className="text-3xl font-bold text-blue-600 mb-4">Gratuito</h3>
            <p className="text-5xl font-extrabold mb-4">R$0<span className="text-xl font-normal">/mês</span></p>
            <ul className="text-gray-600 mb-6 space-y-2">
              <li>5 Geração de Conteúdo/Mês</li>
              <li>Acesso ao Histórico</li>
              <li>Otimização Básica</li>
            </ul>
            <Link href="/register" className="bg-blue-600 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-700 transition duration-300">
              Comece Grátis
            </Link>
          </div>
          {/* Pro Tier - Example */}
          <div className="bg-blue-600 text-white p-8 rounded-lg shadow-lg text-center transform hover:scale-105 transition duration-300 w-full md:w-1/2 border-4 border-yellow-400">
            <h3 className="text-3xl font-bold mb-4">Premium</h3>
            <p className="text-5xl font-extrabold mb-4">R$49<span className="text-xl font-normal">/mês</span></p>
            <ul className="mb-6 space-y-2">
              <li>Gerações Ilimitadas</li>
              <li>Todos os Recursos Premium</li>
              <li>Suporte Prioritário</li>
              <li>Novos Recursos Exclusivos</li>
            </ul>
            <button className="bg-yellow-400 text-blue-900 font-bold py-3 px-6 rounded-full hover:bg-yellow-300 transition duration-300">
              Assinar Premium
            </button>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="text-center px-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Pronto para Alavancar Suas Vendas?</h2>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          Junte-se a centenas de corretores que já estão transformando seu marketing!
        </p>
        <Link
          href="/register"
          className="bg-yellow-400 text-blue-900 font-bold py-4 px-10 rounded-full text-xl shadow-xl hover:bg-yellow-300 transition duration-300 transform hover:scale-105"
        >
          Cadastre-se Agora!
        </Link>
      </section>

      {/* Footer */}
      <footer className="mt-16 text-center text-white text-opacity-80">
        <p>&copy; {new Date().getFullYear()} Corretor AI. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}