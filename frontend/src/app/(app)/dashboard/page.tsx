"use client";

import { useState } from "react";
import { generateContent } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  // Estados para os novos campos
  const [propertyType, setPropertyType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState(""); // Novo: Banheiros
  const [location, setLocation] = useState("");
  const [specialFeatures, setSpecialFeatures] = useState("");
  const [tone, setTone] = useState(""); // Novo: Tom de voz
  const [additionalDetails, setAdditionalDetails] = useState(""); // Renomeado de 'prompt' para clareza

  const [platform, setPlatform] = useState(""); // Instagram, Facebook, WhatsApp
  const [targetAudience, setTargetAudience] = useState(""); // Famílias, Jovens casais, Investidores, etc.
  const [includeHashtags, setIncludeHashtags] = useState(true); // Checkbox para hashtags

  const [optimizeForSeoGmb, setOptimizeForSeoGmb] = useState(false);
  const [seoKeywords, setSeoKeywords] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactWebsite, setContactWebsite] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');

  // NOVO ESTADO: Para controlar a visibilidade das opções avançadas
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false); 

  const [includeEmojis, setIncludeEmojis] = useState(true); // Checkbox para emojis
  const [includeCta, setIncludeCta] = useState(true);     // Checkbox para CTA
  const [contentType, setContentType] = useState(''); 

  const [generatedContent, setGeneratedContent] = useState("");
  // const [generatedImageSrc, setGeneratedImageSrc] = useState<string | null>(null);
  // const [selectedImageTemplate, setSelectedImageTemplate] = useState('padrao');
  // const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isAuthenticated, isLoading: isAuthLoading} = useAuth();
  const router = useRouter();

  // Função para construir o prompt completo para a IA
  const buildPrompt = () => {
    let basePrompt = `Gere conteúdo para redes sociais sobre um imóvel.`;

    if (propertyType) basePrompt += ` Tipo de imóvel: ${propertyType}.`;
    if (bedrooms) basePrompt += ` Quartos: ${bedrooms}.`;
    if (bathrooms) basePrompt += ` Banheiros: ${bathrooms}.`;
    if (location) basePrompt += ` Localização: ${location}.`;
    if (specialFeatures)
      basePrompt += ` Características especiais: ${specialFeatures}.`;
    if (tone) basePrompt += ` O tom do conteúdo deve ser: ${tone}.`;
    if (additionalDetails)
      basePrompt += ` Detalhes adicionais importantes: ${additionalDetails}.`;

    // Adiciona as novas opções ao prompt
    if (platform) basePrompt += ` Otimize para a plataforma: ${platform}.`;
    if (targetAudience) basePrompt += ` O público-alvo é: ${targetAudience}.`;
    
    if (includeEmojis) basePrompt += ` Use emojis relevantes.`;
    if (includeCta) basePrompt += ` Inclua uma chamada para ação (CTA).`;
    if (contentType) basePrompt += ` O formato do conteúdo deve ser: ${contentType}.`;
    if (includeHashtags) basePrompt += ` Inclua hashtags relevantes.`;

    if (optimizeForSeoGmb) {
      basePrompt += ` **Otimize o conteúdo para SEO e Google My Business.**`;
      if (seoKeywords) basePrompt += ` Inclua as seguintes palavras-chave SEO: "${seoKeywords}".`;
      if (propertyAddress) basePrompt += ` O endereço do imóvel é: "${propertyAddress}".`;
      
      basePrompt += ` Inclua informações de contato:`;
      if (contactPhone) basePrompt += ` Telefone: ${contactPhone}.`;
      if (contactEmail) basePrompt += ` Email: ${contactEmail}.`;
      if (contactWebsite) basePrompt += ` Website: ${contactWebsite}.`;
    }

    basePrompt += ` O objetivo é atrair compradores e despertar interesse.`;

    return basePrompt;
  };

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingContent(true);
    setError(null);
    setGeneratedContent("");

    const finalPrompt = buildPrompt();

    // // Atualize a validação para incluir os novos campos
    // if (
    //   !propertyType && !bedrooms && !bathrooms && !location && !specialFeatures && 
    //   !tone && !additionalDetails && !platform && !targetAudience && !contentType
    // ) {
    //   setError('Por favor, preencha pelo menos um campo para gerar o conteúdo.');
    //   setIsLoadingContent(false);
    //   return;
    // }

    // Validação principal: pelo menos um campo básico preenchido
    // OU pelo menos um campo de SEO/GMB preenchido SE a opção de SEO/GMB estiver ativa.
    const isBasicFormEmpty = !propertyType && !bedrooms && !bathrooms && !location && !specialFeatures && 
                             !tone && !additionalDetails && !platform && !targetAudience && !contentType;
    
    const isSeoGmbFormEmpty = !(seoKeywords || contactPhone || contactEmail || contactWebsite || propertyAddress);

    if (isBasicFormEmpty && (!optimizeForSeoGmb || (optimizeForSeoGmb && isSeoGmbFormEmpty))) {
        setError('Por favor, preencha pelo menos um campo para gerar o conteúdo.');
        setIsLoadingContent(false);
        return;
    }

      try {
      // 1. Gerar o Conteúdo de Texto se não houver ou se não for apenas para imagem
      // Se não tiver texto já gerado E o usuário não está gerando SÓ uma imagem sem detalhes textuais
      // Ou se o usuário quiser um novo texto para a imagem
       const contentText = await generateContent(finalPrompt);
      setGeneratedContent(contentText);
      toast.success('Conteúdo de texto gerado e salvo com sucesso!');


      // // 2. Gerar a Imagem, SE um arquivo de imagem foi selecionado E TEMOS TEXTO para overlay
      // if (selectedImageFile && contentText) { // Só gera imagem se tiver arquivo E texto
      //   const imageBlob = await generateImageWithTextOverlay(selectedImageFile, contentText, selectedImageTemplate);
      //   const imageUrl = URL.createObjectURL(imageBlob); // Cria uma URL para o Blob da imagem
      //   setGeneratedImageSrc(imageUrl);
      //   toast.success('Imagem gerada com sucesso!'); // Toast para a imagem
      // } else if (selectedImageFile && !contentText) {
      //   // Cenário: imagem selecionada mas não há detalhes textuais para gerar texto/usar como overlay.
      //   // Isso pode ser uma validação mais específica se você quiser.
      //   toast.error('Imagem selecionada, mas nenhum texto para sobreposição. Gerando apenas texto.');
      //   // Aqui, o 'generateContent' acima já deve ter gerado o texto, mas se o usuário não preencheu nada...
      // }
      
    } catch (err: any) {
      console.error("Erro no componente:", err);
      if (err.message === 'Sessão expirada. Por favor, faça login novamente.') {
        router.push('/login');
        toast.error('Sessão expirada. Por favor, faça login novamente.');
      } else {
        toast.error(err.message || 'Ocorreu um erro ao gerar o conteúdo.');
      }
      setError(err.message || 'Ocorreu um erro ao gerar o conteúdo. Tente novamente.');
    } finally {
      setIsLoadingContent(false);
    }
  };

  return (
      <main className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-700 text-center mb-4">
          Vamos criar o seu conteúdo
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo de Imóvel */}
          <div>
            <label
              htmlFor="propertyType"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Tipo de Imóvel:
            </label>
            <select
              id="propertyType"
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
            >
              <option value="">Selecione</option>
              <option value="Apartamento">Apartamento</option>
              <option value="Casa">Casa</option>
              <option value="Terreno">Terreno</option>
              <option value="Comercial">Imóvel Comercial</option>
              <option value="Cobertura">Cobertura</option>
              <option value="Sobrado">Sobrado</option>
            </select>
          </div>

          {/* Quartos e Banheiros (em uma linha) */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <label
                htmlFor="bedrooms"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Quartos:
              </label>
              <input
                id="bedrooms"
                type="number"
                min="0"
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 3"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="bathrooms"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Banheiros:
              </label>
              <input
                id="bathrooms"
                type="number"
                min="0"
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 2"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
              />
            </div>
          </div>

          {/* Localização */}
          <div>
            <label
              htmlFor="location"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Localização (Bairro/Cidade):
            </label>
            <input
              id="location"
              type="text"
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Moema, São Paulo"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Características Específicas */}
          <div>
            <label
              htmlFor="specialFeatures"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Características Específicas (separar por vírgulas):
            </label>
            <input
              id="specialFeatures"
              type="text"
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Piscina, Varanda Gourmet, Pet-friendly, Mobiliado"
              value={specialFeatures}
              onChange={(e) => setSpecialFeatures(e.target.value)}
            />
          </div>

          {/* Tom de Voz */}
          <div>
            <label
              htmlFor="tone"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Tom de Voz:
            </label>
            <select
              id="tone"
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              <option value="">Neutro</option>
              <option value="Profissional e Informativo">
                Profissional e Informativo
              </option>
              <option value="Descontraído e Amigável">
                Descontraído e Amigável
              </option>
              <option value="Luxuoso e Exclusivo">Luxuoso e Exclusivo</option>
              <option value="Familiar e Acolhedor">Familiar e Acolhedor</option>
              <option value="Moderno e Inovador">Moderno e Inovador</option>
            </select>
          </div>

          {/* Plataforma */}
          <div>
            <label
              htmlFor="platform"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Otimizar para Plataforma:
            </label>
            <select
              id="platform"
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            >
              <option value="">Nenhuma (Geral)</option>
              <option value="Instagram">
                Instagram (foco em engajamento visual)
              </option>
              <option value="Facebook">
                Facebook (mais descritivo, público amplo)
              </option>
              <option value="WhatsApp">WhatsApp (conciso e direto)</option>
              <option value="Site/Blog">
                Site/Blog (detalhado e SEO-friendly)
              </option>
            </select>
          </div>

          {/* Público-Alvo */}
          <div>
            <label
              htmlFor="targetAudience"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Público-Alvo:
            </label>
            <select
              id="targetAudience"
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
            >
              <option value="">Geral</option>
              <option value="Famílias com crianças">
                Famílias com crianças
              </option>
              <option value="Jovens casais">Jovens casais</option>
              <option value="Investidores">Investidores</option>
              <option value="Solteiros/Profissionais liberais">
                Solteiros/Profissionais liberais
              </option>
              <option value="Aposentados">Aposentados</option>
            </select>
          </div>

 <div className="border-t pt-4 mt-4"> {/* Separador visual */}
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Opções Avançadas de Conteúdo</h2>
            
            {/* Formato de Conteúdo */}
            <div>
                <label htmlFor="contentType" className="block text-gray-700 text-sm font-bold mb-2">
                    Formato do Conteúdo:
                </label>
                <select
                    id="contentType"
                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value)}
                >
                    <option value="">Padrão (Geral)</option>
                    <option value="Descrição Detalhada para Site">Descrição Detalhada para Site</option>
                    <option value="Legenda Curta para Instagram">Legenda Curta para Instagram</option>
                    <option value="Mensagem Direta para WhatsApp">Mensagem Direta para WhatsApp</option>
                    <option value="Roteiro para Stories/Reels">Roteiro para Stories/Reels</option>
                </select>
            </div>

            {/* Incluir Emojis */}
            <div className="flex items-center mt-4">
                <input
                    id="includeEmojis"
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600"
                    checked={includeEmojis}
                    onChange={(e) => setIncludeEmojis(e.target.checked)}
                />
                <label htmlFor="includeEmojis" className="ml-2 block text-gray-700 text-sm font-bold">
                    Incluir Emojis ✨
                </label>
            </div>

            {/* Incluir CTA */}
            <div className="flex items-center mt-2">
                <input
                    id="includeCta"
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600"
                    checked={includeCta}
                    onChange={(e) => setIncludeCta(e.target.checked)}
                />
                <label htmlFor="includeCta" className="ml-2 block text-gray-700 text-sm font-bold">
                    Incluir Chamada para Ação (CTA) 📞
                </label>
            </div>

            {/* Incluir Hashtags (mantido aqui para agrupamento visual) */}
            <div className="flex items-center mt-2">
                <input
                    id="includeHashtags"
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600"
                    checked={includeHashtags}
                    onChange={(e) => setIncludeHashtags(e.target.checked)}
                />
                <label htmlFor="includeHashtags" className="ml-2 block text-gray-700 text-sm font-bold">
                    Incluir Hashtags (#)
                </label>
            </div>
        </div>

      {/* --- NOVO: CHECKBOX PARA HABILITAR/DESABILITAR OPÇÕES DE SEO/GMB --- */}
        <div className="border-t pt-4 mt-4">
            <div className="flex items-center">
                <input
                    id="toggleAdvancedSeoGmb"
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600"
                    checked={showAdvancedOptions}
                    onChange={(e) => setShowAdvancedOptions(e.target.checked)}
                />
                <label htmlFor="toggleAdvancedSeoGmb" className="ml-2 block text-blue-700 text-lg font-bold">
                    Mostrar Opções de SEO / Google Meu Negócio
                </label>
            </div>

            {/* CAMPOS DE SEO/GMB (VISÍVEIS CONDICIONALMENTE) */}
            {showAdvancedOptions && (
                <div className="space-y-4 mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Configurações Específicas de SEO / GMB</h2>
                    {/* Otimizar para SEO/GMB (checkbox agora é de exibição) */}
                    <div className="flex items-center">
                        <input
                            id="optimizeForSeoGmb"
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-blue-600"
                            checked={optimizeForSeoGmb}
                            onChange={(e) => setOptimizeForSeoGmb(e.target.checked)}
                        />
                        <label htmlFor="optimizeForSeoGmb" className="ml-2 block text-gray-700 text-sm font-bold">
                            Ativar Otimização SEO / Google Meu Negócio
                        </label>
                    </div>

                    {/* Campos condicionalmente visíveis se optimizeForSeoGmb for true */}
                    {optimizeForSeoGmb && (
                        <div className="space-y-4 mt-4">
                            <div>
                                <label htmlFor="seoKeywords" className="block text-gray-700 text-sm font-bold mb-2">
                                    Palavras-chave SEO (separar por vírgulas):
                                </label>
                                <input
                                    id="seoKeywords"
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Ex: apartamento à venda mogilar, imobiliária mogi das cruzes"
                                    value={seoKeywords}
                                    onChange={(e) => setSeoKeywords(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="propertyAddress" className="block text-gray-700 text-sm font-bold mb-2">
                                    Endereço Completo do Imóvel:
                                </label>
                                <input
                                    id="propertyAddress"
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Ex: Rua das Flores, 123, Mogilar, Mogi das Cruzes - SP"
                                    value={propertyAddress}
                                    onChange={(e) => setPropertyAddress(e.target.value)}
                                />
                            </div>
                            
                            <h3 className="text-md font-semibold text-gray-700 mb-2">Informações de Contato para GMB:</h3>
                            <div>
                                <label htmlFor="contactPhone" className="block text-gray-700 text-sm font-bold mb-2">
                                    Telefone:
                                </label>
                                <input
                                    id="contactPhone"
                                    type="tel"
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Ex: (11) 99999-9999"
                                    value={contactPhone}
                                    onChange={(e) => setContactPhone(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="contactEmail" className="block text-gray-700 text-sm font-bold mb-2">
                                    Email:
                                </label>
                                <input
                                    id="contactEmail"
                                    type="email"
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Ex: contato@imobiliaria.com"
                                    value={contactEmail}
                                    onChange={(e) => setContactEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="contactWebsite" className="block text-gray-700 text-sm font-bold mb-2">
                                    Website:
                                
                                </label>
                                <input
                                    id="contactWebsite"
                                    type="url"
                                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Ex: www.suaimobiliaria.com.br"
                                    value={contactWebsite}
                                    onChange={(e) => setContactWebsite(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>

          {/* Detalhes Adicionais (antigo prompt) */}
          <div>
            <label
              htmlFor="additionalDetails"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Outros Detalhes Importantes (opcional):
            </label>
            <textarea
              id="additionalDetails"
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
              placeholder="Ex: Próximo a escolas e metrô, vista para o parque."
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
            />
          </div>


          {/* <div className="border-t pt-4 mt-4"> 
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Gerar Imagem com Conteúdo</h2>
            <div>
                <label htmlFor="imageUpload" className="block text-gray-700 text-sm font-bold mb-2">
                    Upload de Imagem do Imóvel (opcional):
                </label>
                <input
                    id="imageUpload"
                    type="file"
                    accept="image/png, image/jpeg"
                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onChange={(e) => setSelectedImageFile(e.target.files ? e.target.files[0] : null)}
                />
                {selectedImageFile && (
                    <p className="text-sm text-gray-600 mt-2">Arquivo selecionado: {selectedImageFile.name}</p>
                )}
            </div>
            <div className="mt-4">
                <label htmlFor="imageTemplate" className="block text-gray-700 text-sm font-bold mb-2">
                    Template da Imagem:
                </label>
                <select
                    id="imageTemplate"
                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={selectedImageTemplate}
                    onChange={(e) => setSelectedImageTemplate(e.target.value)}
                >
                    <option value="padrao">Padrão (Texto no Topo)</option>
                    <option value="destaque_inferior">Destaque Inferior</option>
                    
                </select>
            </div>
        </div> */}

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={isLoadingContent || (
            !propertyType && !bedrooms && !bathrooms && !location && !specialFeatures && 
            !tone && !additionalDetails && !platform && !targetAudience && !contentType 
          )}
          >
            {isLoadingContent ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Gerando...
              </>
            ) : (
              "Gerar Conteúdo"
            )}
          </button>
        </form>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-6"
            role="alert"
          >
            <strong className="font-bold">Erro:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {generatedContent && (
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg shadow-inner relative">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">
              Conteúdo Gerado:
            </h2>
           {/* BOTÕES DE COMPARTILHAMENTO AQUI */}
          <div className="flex flex-wrap gap-2 mb-4"> {/* Adicionado flex-wrap para quebra de linha em telas menores */}
            {/* Botão Copiar Texto (já existente, talvez apenas ajuste a classe) */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedContent);
                toast.success("Conteúdo copiado para a área de transferência!");
              }}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded text-sm flex items-center space-x-1"
              title="Copiar texto gerado"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75m1.5 0h-.75A1.125 1.125 0 0 0 6 7.875v8.25c0 .621.504 1.125 1.125 1.125h8.25c.621 0 1.125-.504 1.125-1.125v-3.375m-1.5-1.5-.75.75-.75-.75m3-6v6m0 0-3-3m3 3L18 7.5" />
              </svg>
              <span>Copiar Texto</span>
            </button>

            {/* Botão Compartilhar no WhatsApp */}
            <button
              onClick={() => {
                const whatsappText = encodeURIComponent(generatedContent);
                // Ajuste a URL para o WhatsApp Web ou API (para mobile)
                // Usando web.whatsapp.com para desktop, ou api.whatsapp.com/send para mobile
                const whatsappUrl = `https://web.whatsapp.com/send?text=${whatsappText}`;
                // Abrir em nova aba
                window.open(whatsappUrl, '_blank');
                toast('Abrindo WhatsApp para compartilhar!');
              }}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm flex items-center space-x-1"
              title="Compartilhar no WhatsApp"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" className="w-4 h-4">
                <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76.957 3.96L.06 16l4.204-1.102a7.933 7.933 0 0 0 3.79.998h.006c4.366 0 7.92-3.558 7.923-7.925a8.032 8.032 0 0 0-1.504-4.555zm-1.884 9.183c-.114-.038-.3-.074-.531-.11-.227-.035-1.157-.353-1.339-.39-.182-.036-.315-.038-.448.038-.133.076-.424.353-.523.47-.099.118-.197.125-.365.074-.168-.05-.717-.264-1.365-.837-.47-.424-.785-.944-.877-1.103-.093-.159-.006-.174.067-.245.064-.069.15-.159.225-.267.075-.109.1-.186.14-.247.04-.06.02-.115-.004-.165-.024-.05-.227-.54-.306-.722-.078-.18-.085-.159-.078-.353.007-.194.324-.466.398-.535.074-.069.17-.094.257-.093.088.004.16.004.229.01.07.006.1.034.148.15.048.118.171.466.195.535.024.07.025.076-.006.13-.031.056-.109.117-.165.171-.055.055-.10.125-.13.186-.03.06-.01.107.026.16.036.052.367.597.525.79.158.192.29.31.407.398.117.087.27.116.407.098.133-.018.851-.355.99-.413.139-.057.254-.117.387-.156.133-.039.25-.114.367-.075.117.039.789.333.903.385.114.052.197.045.222.027.024-.018.069-.069.122-.178.053-.108.125-.264.18-.353z" />
              </svg>
              <span>WhatsApp</span>
            </button>

            {/* Botão Compartilhar no Instagram */}
            <button
              onClick={() => {
                const instagramText = generatedContent;
                navigator.clipboard.writeText(instagramText);
                toast.success('Texto para Instagram copiado! Cole na legenda e adicione a imagem.');
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded text-sm flex items-center space-x-1"
              title="Copiar texto para Instagram"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" className="w-4 h-4">
                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.269.087 3.85.048 4.703.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.95.923 1.417.444.445.869.718 1.417.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16c2.172 0 2.444-.01 3.297-.048.852-.04 1.433-.174 1.942-.372.526-.205.95-.478 1.417-.923.445-.444.718-.869.923-1.417.198-.51.333-1.09.372-1.942.04-1.065.04-1.373.04-3.297 0-2.172-.01-2.444-.048-3.297-.04-.852-.174-1.433-.372-1.942a3.917 3.917 0 0 0-.923-1.417A3.927 3.927 0 0 0 13.24 0.42c-.51-.198-1.09-.333-1.942-.372C10.444.01 10.172 0 8 0zm0 1.5c2.16 0 2.414.008 3.29.046.78.036 1.203.166 1.485.276.276.109.54.255.79.50.25.25.391.514.50.79.11.282.24.705.276 1.485.038.876.046 1.14.046 3.29s-.008 2.414-.046 3.29c-.036.78-.166 1.203-.276 1.485a2.47 2.47 0 0 1-.50.79c-.25.25-.514.391-.79.50-.282.11-.705.24-1.485.276-.876.038-1.14.046-3.29.046s-2.414-.008-3.29-.046c-.78-.036-1.203-.166-1.485-.276a2.47 2.47 0 0 1-.79-.50c-.25-.25-.391-.514-.50-.79-.11-.282-.24-.705-.276-1.485C.59 10.444.582 10.172.582 8s.008-2.414.046-3.29c.036-.78.166-1.203.276-1.485a2.47 2.47 0 0 1 .50-.79c.25-.25.514-.391.79-.50.282-.11.705-.24 1.485-.276C5.555 1.5 5.827 1.5 8 1.5z" />
                <path d="M12.5 7.75c0-.138.112-.25.25-.25h1.5a.25.25 0 0 1 .25.25v1.5a.25.25 0 0 1-.25.25h-1.5a.25.25 0 0 1-.25-.25v-1.5z" />
                <path d="M8 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm0 1a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
              </svg>
              <span>Instagram</span>
            </button>
          </div>
            <div
              className="whitespace-pre-wrap text-gray-800"
              style={{ lineHeight: "1.6" }}
            >
              {generatedContent}
            </div>
          </div>
        )}

        {/* {generatedImageSrc && (
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg shadow-inner">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">Imagem Gerada:</h2>
              <img src={generatedImageSrc} alt="Conteúdo Visual Gerado" className="max-w-full h-auto rounded-md shadow-md" />
              
              <a 
                href={generatedImageSrc} 
                download="conteudo_imobiliario.png" 
                className="mt-4 inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Download Imagem
              </a>
          </div>
      )} */}
      </main>
     );
}
