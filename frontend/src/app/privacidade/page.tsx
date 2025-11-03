import Footer from "@/components/footer";
import PublicHeader from "@/components/publicHeader";

export default function PoliticaDePrivacidade() {
  return (
    <>
    <PublicHeader/>
        <div className="max-w-5xl mx-auto px-4 py-12 text-gray-800 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6">Política de Privacidade – AuraSync AI</h1>
      <p className="mb-4">Data de vigência: 06 de julho de 2025</p>

      <p className="mb-6">
        A AuraSync AI valoriza a privacidade de seus usuários e está comprometida em proteger os dados pessoais coletados por meio de sua plataforma. Esta Política de Privacidade explica como coletamos, usamos, armazenamos e compartilhamos suas informações pessoais ao acessar nosso site <a href="https://aurasyncai.com" className="text-blue-600 underline">aurasyncai.com</a>.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">1. Informações que Coletamos</h2>
      <p className="mb-4">
        Ao utilizar a AuraSync AI, podemos coletar as seguintes informações:
      </p>
      <ul className="list-disc list-inside mb-6">
        <li>Nome</li>
        <li>E-mail (obrigatório para cadastro)</li>
        <li>CRECI (opcional)</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-2">2. Finalidade da Coleta de Dados</h2>
      <ul className="list-disc list-inside mb-6">
        <li>Envio de e-mails relacionados à sua conta ou à operação da plataforma;</li>
        <li>Campanhas de marketing e comunicação;</li>
        <li>Acesso e autenticação do usuário na plataforma;</li>
        <li>Melhoria da experiência do usuário.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-2">3. Compartilhamento com Terceiros</h2>
      <p className="mb-4">
        Compartilhamos seus dados com terceiros apenas quando necessário:
      </p>
      <ul className="list-disc list-inside mb-6">
        <li>Stripe – para processar pagamentos;</li>
        <li>Serviços de hospedagem e autenticação.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-2">4. Uso de Cookies</h2>
      <p className="mb-6">
        Utilizamos cookies para manter você conectado, armazenar preferências e melhorar a experiência. Você pode desativá-los no navegador, mas isso pode afetar a funcionalidade da plataforma.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">5. Idade Mínima para Utilização</h2>
      <p className="mb-6">O uso da AuraSync AI é permitido apenas para maiores de 18 anos.</p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">6. Segurança dos Dados</h2>
      <p className="mb-6">
        Adotamos medidas técnicas e administrativas para proteger seus dados contra acessos não autorizados, perdas ou alterações.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">7. Seus Direitos</h2>
      <p className="mb-4">
        Conforme a LGPD, você pode:
      </p>
      <ul className="list-disc list-inside mb-6">
        <li>Acessar seus dados;</li>
        <li>Corrigir informações incorretas;</li>
        <li>Solicitar exclusão de dados;</li>
        <li>Revogar consentimentos dados.</li>
      </ul>
      <p className="mb-6">
        Para exercer seus direitos, envie um e-mail para: <a href="mailto:info@aurasyncai.com" className="text-blue-600 underline">info@aurasyncai.com</a>.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">8. Alterações nesta Política</h2>
      <p className="mb-6">
        Esta política poderá ser atualizada a qualquer momento. Notificações relevantes serão feitas por e-mail ou pela própria plataforma.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">9. Contato</h2>
      <p className="mb-6">
        Dúvidas ou solicitações podem ser encaminhadas para: <a href="mailto:info@aurasyncai.com" className="text-blue-600 underline">info@aurasyncai.com</a>.
      </p>

      <p className="mt-12 font-medium">AuraSync AI – Cuidando da sua experiência com ética e segurança.</p>
    </div>
    <Footer/>
    </>
  );
}
