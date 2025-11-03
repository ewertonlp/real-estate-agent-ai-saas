import Footer from "@/components/footer";
import PublicHeader from "@/components/publicHeader";

export default function TermosDeUso() {
  return (
    <>
    <PublicHeader/>
    <div className="max-w-5xl mx-auto px-4 py-12 text-gray-800 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6">Termos de Uso – AuraSync AI</h1>
      <p className="mb-6">Última atualização: 06 de julho de 2025</p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">1. Aceitação dos Termos</h2>
      <p className="mb-6">
        Ao acessar e utilizar a AuraSync AI, você declara ter lido, compreendido e aceitado estes Termos de Uso e nossa{" "}
        <a href="/privacidade" className="text-blue-600 underline">Política de Privacidade</a>.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">2. Descrição do Serviço</h2>
      <p className="mb-6">
        A AuraSync AI é uma plataforma digital voltada para profissionais do mercado imobiliário. O serviço oferece funcionalidades baseadas em inteligência artificial para marketing e gestão.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">3. Cadastro do Usuário</h2>
      <p className="mb-6">
        Para utilizar a plataforma, é necessário criar uma conta com nome, e-mail e, opcionalmente, CRECI. O usuário é responsável pela veracidade das informações e pela segurança de suas credenciais.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">4. Responsabilidades do Usuário</h2>
      <ul className="list-disc list-inside mb-6">
        <li>Utilizar a plataforma de forma ética e legal;</li>
        <li>Não compartilhar sua conta com terceiros;</li>
        <li>Não utilizar a plataforma para fins ilícitos;</li>
        <li>Não tentar acessar áreas não autorizadas.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-2">5. Pagamentos</h2>
      <p className="mb-6">
        Recursos pagos são processados via Stripe. O usuário concorda com os valores e condições de pagamento apresentados no momento da contratação.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">6. Cancelamento e Encerramento</h2>
      <p className="mb-6">
        O usuário pode encerrar sua conta a qualquer momento. A AuraSync AI poderá suspender ou excluir contas em caso de violação dos termos.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">7. Propriedade Intelectual</h2>
      <p className="mb-6">
        Todo o conteúdo da AuraSync AI é protegido por direitos autorais. É proibido reproduzir ou distribuir qualquer parte sem autorização.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">8. Limitação de Responsabilidade</h2>
      <p className="mb-6">
        A AuraSync AI não se responsabiliza por falhas técnicas, indisponibilidades ou perdas decorrentes do uso indevido da plataforma.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">9. Modificações dos Termos</h2>
      <p className="mb-6">
        Estes termos podem ser modificados a qualquer momento. Notificações serão feitas por e-mail em caso de mudanças relevantes.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">10. Legislação Aplicável</h2>
      <p className="mb-6">
        Os termos são regidos pelas leis brasileiras. Qualquer disputa será resolvida no foro da comarca do usuário.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">11. Contato</h2>
      <p className="mb-6">
        Para dúvidas ou solicitações:{" "}
        <a href="mailto:info@aurasyncai.com" className="text-blue-600 underline">info@aurasyncai.com</a>
      </p>

      <p className="mt-12 font-medium">AuraSync AI – Potencialize sua presença digital com inteligência.</p>
    </div>
    <Footer/>
    </>
  );
}
