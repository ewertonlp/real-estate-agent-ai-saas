'use client';

import Link from 'next/link';

export default function AjudaPage() {
  return (
    <main className="max-w-4xl mx-auto p-8 bg-card rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-text mb-12 text-center">
        Central de Ajuda - Gerador de Conteúdo
      </h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-text mb-2">O que é o Gerador de Conteúdo?</h2>
        <p className="text-text">
          Esta ferramenta cria automaticamente textos para descrever imóveis, anúncios, posts em redes sociais, e muito mais, com base nas informações que você fornece.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-text mb-2">Como usar o Gerador de Conteúdo</h2>
        <ol className="list-decimal list-inside text-text space-y-2">
          <li>Acesse o <Link href="/dashboard" className="text-primary hover:underline">Dashboard</Link>.</li>
          <li>Preencha os detalhes do imóvel no formulário: tipo, localização, quartos, banheiros, características especiais e outros.</li>
          <li>Opcionalmente, escolha o tom, idioma, público-alvo e outras informações para personalizar o texto.</li>
          <li>Clique no botão <strong>Gerar Conteúdo</strong>.</li>
          <li>Aguarde a geração e veja o conteúdo aparecer ao lado.</li>
          <li>Use o botão <strong>Copiar Conteúdo</strong> para salvar o texto gerado.</li>
          <li>O conteúdo gerado fica salvo na página <Link href="/history" className="text-primary hover:underline">Histórico</Link>.</li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-text mb-2">Limitações e Planos</h2>
        <p className="text-text mb-2">
          O número de gerações disponíveis depende do seu plano atual. Você pode verificar seu plano e quantas gerações já usou no painel superior do Dashboard ou na página <Link href="/settings" className="text-primary hover:underline">Configurações da Conta</Link>.
        </p>
        <p className="text-text">
          Para aumentar a quantidade de gerações permitodas, faça um <Link href="/plans" className="text-primary hover:underline">upgrade do seu plano</Link>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-text mb-2">Dicas para obter melhores resultados</h2>
        <ul className="list-disc list-inside text-text space-y-2">
          <li>Preencha o máximo possível dos campos para que o texto gerado seja mais completo e personalizado.</li>
          <li>Seja específico nos detalhes para que a IA entenda melhor o contexto do imóvel.</li>
          <li>Use os campos opcionais como tom e público-alvo para direcionar o conteúdo conforme sua necessidade.</li>
          <li>Revise o conteúdo gerado e faça pequenas edições se necessário.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-text mb-2">Precisa de ajuda?</h2>
        <p className="text-text">
          Caso tenha dúvidas ou problemas, entre em contato com nosso suporte pelo e-mail: <a href="mailto:info@aurasyncai.com" className="text-button hover:underline">info@aurasyncai.com</a>
        </p>
      </section>
    </main>
  );
}
