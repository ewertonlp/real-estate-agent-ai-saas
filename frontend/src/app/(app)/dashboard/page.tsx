// frontend/src/app/(app)/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import PropertyDetailsForm from "@/components/propertyDetailsForm";
import { PropertyDetailsFormSchema } from "@/components/propertyDetailsForm";
import {
  generateContent,
  PropertyDetailsInput,
  TextGenerationOutput,
} from "@/lib/api";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import Modal from "@/components/modal";
import { FaWpforms } from "react-icons/fa";
import Link from "next/link";

export default function DashboardPage() {
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
    userToken,
    userPlanName,
    userGenerationsCount,
    userMaxGenerations,
    fetchUserData,
  } = useAuth();

  const router = useRouter();
  const searchParams = useSearchParams();
  const { userEmail } = useAuth();

  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showCopyMessage, setShowCopyMessage] = useState<boolean>(false); // <<< ESTADO showCopyMessage
  // Estados para controlar o modal de onboarding
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);

  // NOVO ESTADO: para passar valores iniciais ao PropertyDetailsForm
  const [initialFormValues, setInitialFormValues] = useState<
    Partial<PropertyDetailsFormSchema>
  >({});

  // Efeito para verificar se é um novo usuário e iniciar o onboarding
  useEffect(() => {
    // Verifica se o usuário já completou o onboarding nesta versão
    const onboardingCompleted = localStorage.getItem("onboarding_completed_v1");

    // Verifica se o usuário não completou o onboarding E se o email do usuário já foi carregado
    // userEmail é um bom proxy para saber se o AuthContext já carregou
    if (!onboardingCompleted && userEmail) {
      setShowOnboarding(true);
      setOnboardingStep(0); // Começa do primeiro passo
    }
  }, [userEmail]);

  // Função para avançar para o próximo passo do onboarding ou finalizar
  const handleNextOnboardingStep = () => {
    if (onboardingStep < onboardingStepsData.length - 1) {
      // Se não for o último passo, avança
      setOnboardingStep((prev) => prev + 1);
    } else {
      // Se for o último passo, finaliza o onboarding
      localStorage.setItem("onboarding_completed_v1", "true"); // Marca como completo no localStorage
      setShowOnboarding(false); // Fecha o modal
    }
  };

  // Função para pular ou fechar o onboarding a qualquer momento
  const handleSkipOnboarding = () => {
    localStorage.setItem("onboarding_completed_v1", "true"); // Marca como completo
    setShowOnboarding(false); // Fecha o modal
  };

  // Efeito para preencher o formulário com dados do histórico, se presentes na URL
  // OU para lidar com status de pagamento
  useEffect(() => {
    const promptFromHistory = searchParams.get("prompt");
    const generatedTextFromHistory = searchParams.get("generatedText");
    const templateTextFromUrl = searchParams.get("templateText");

    if (templateTextFromUrl) {
      setInitialFormValues((prev) => ({
        ...prev,
        additionalDetails: decodeURIComponent(templateTextFromUrl),
      }));
      toast.success(
        "Template aplicado ao campo 'Outros Detalhes Importantes'!"
      );
      router.replace("/dashboard", undefined);
    } else if (promptFromHistory) {
      setInitialFormValues((prev) => ({
        ...prev,
        additionalDetails: decodeURIComponent(promptFromHistory),
      }));
      if (generatedTextFromHistory) {
        setGeneratedContent(decodeURIComponent(generatedTextFromHistory));
      }
      toast.success("Conteúdo do histórico carregado. Edite e gere novamente!");
      router.replace("/dashboard", undefined);
    }

    const paymentStatus = searchParams.get("payment_status");
    if (paymentStatus === "success") {
      toast.success(
        "Pagamento realizado com sucesso! Seu plano foi atualizado."
      );
      fetchUserData();
      router.replace("/dashboard", undefined);
    } else if (paymentStatus === "cancelled") {
      toast.error(
        "Pagamento cancelado. Tente novamente ou entre em contato com o suporte."
      );
      router.replace("/dashboard", undefined);
    }
  }, [searchParams, router, fetchUserData]);

  const handleSubmit = async (formData: PropertyDetailsFormSchema) => {
    // ... (sua lógica handleSubmit, que está correta) ...
    if (!isAuthenticated || !userToken) {
      setError(
        "Você não está logado ou a sessão expirou. Por favor, faça login novamente."
      );
      console.error(
        "Erro: Usuário não autenticado no handleSubmit. isAuthenticated:",
        isAuthenticated,
        "userToken:",
        userToken
      );
      return;
    }

    setLoading(true);
    setError("");
    setGeneratedContent("");

    const isBasicFormEmpty =
      !formData.propertyType &&
      !formData.bedrooms &&
      !formData.bathrooms &&
      !formData.propertyValue &&
      !formData.condoFee &&
      !formData.iptuValue &&
      !formData.location &&
      !formData.specialFeatures &&
      !formData.tone &&
      !formData.purpose &&
      !formData.targetAudience &&
      !formData.length &&
      !formData.language &&
      !formData.additionalDetails;

    const isSeoGmbFormEmpty = !(
      formData.seoKeywords ||
      formData.contactPhone ||
      formData.contactEmail ||
      formData.contactWebsite ||
      formData.propertyAddress
    );

    if (
      isBasicFormEmpty &&
      (!formData.optimizeForSeoGmb ||
        (formData.optimizeForSeoGmb && isSeoGmbFormEmpty))
    ) {
      setError(
        "Por favor, preencha pelo menos um campo para gerar o conteúdo."
      );
      setLoading(false);
      return;
    }

    const propertyDetailsForApi: PropertyDetailsInput = {
      property_type: formData.propertyType,
      bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
      bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : undefined,
      location: formData.location,
      special_features: formData.specialFeatures || undefined,
      purpose: formData.purpose,
      target_audience: formData.targetAudience || undefined,
      tone: formData.tone || undefined,
      length: formData.length || undefined,
      language: formData.language || undefined,
      property_value: formData.propertyValue
        ? parseFloat(formData.propertyValue)
        : undefined,
      condo_fee: formData.condoFee ? parseFloat(formData.condoFee) : undefined,
      iptu_value: formData.iptuValue
        ? parseFloat(formData.iptuValue)
        : undefined,
    };

    try {
      const result = await generateContent(propertyDetailsForApi, userToken);
      setGeneratedContent(result.generated_text);
      toast.success("Conteúdo de texto gerado e salvo com sucesso!");
      await fetchUserData();
    } catch (err: any) {
      console.error("Erro na geração de conteúdo:", err);
      if (err.message === "Sessão expirada. Por favor, faça login novamente.") {
        router.push("/login");
        toast.error("Sessão expirada. Por favor, faça login novamente.");
      } else if (err.message.includes("atingiu o limite")) {
        toast.error(err.message);
        setError(err.message);
      } else {
        toast.error(err.message || "Ocorreu um erro ao gerar o conteúdo.");
      }
      setError(
        err.message || "Ocorreu um erro ao gerar o conteúdo. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  // <<< FUNÇÃO handleCopy DEVE ESTAR AQUI >>>
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setShowCopyMessage(true);
    setTimeout(() => setShowCopyMessage(false), 2000);
  };

  // Renderização condicional enquanto a autenticação está sendo carregada
  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="ml-2 text-gray-700 dark:text-gray-300">
          Carregando autenticação...
        </p>
      </div>
    );
  }

  // Redireciona se não estiver autenticado após o carregamento
  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-card text-text p-4 sm:p-6 lg:p-8 rounded-lg">
      <div className="flex items-center justify-between gap-4 mb-12 mx-auto">
        <div className="flex items-center gap-4">
          <FaWpforms className="text-2xl" />
          <h1 className="text-lg lg:text-3xl font-medium ">Gerar Conteúdo</h1>
        </div>
        <div>
          <p>
            <strong>Plano Atual:</strong> {userPlanName || "Carregando..."}
          </p>
          {userPlanName && userMaxGenerations !== null && (
            <p>
              <strong>Gerações Utilizadas este período:</strong>{" "}
              {userGenerationsCount} de{" "}
              {userMaxGenerations === 0 ? "Ilimitadas" : userMaxGenerations}
            </p>
          )}
          {/* Opcional: Link para Upgrade de Plano, similar ao da página de Settings */}
          {userPlanName && userPlanName !== 'Unlimited' && (
            <Link
              href="/plans"
              className="mt-4 inline-block bg-button hover:bg-hover text-text font-medium py-2 px-4 rounded-md transition duration-300"
            >
              Fazer Upgrade do Plano
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-8xl mx-auto">
        <div className="bg-card dark:bg-card p-6 rounded-lg border border-border overflow-hidden">
          <PropertyDetailsForm
            onSubmit={handleSubmit}
            loading={loading}
            initialData={initialFormValues}
          />
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </div>

        <div className="bg-background p-6 rounded-lg border border-border flex flex-col">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
            Conteúdo Gerado
          </h2>
          {loading ? (
            <div className="flex flex-col items-center justify-center flex-grow">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Gerando seu conteúdo...
              </p>
            </div>
          ) : (
            <div className="flex-grow">
              {generatedContent ? (
                <>
                  <div className="flex flex-col justify-center border border-gray-300 dark:border-gray-600 rounded-md p-4 bg-card dark:bg-card h-full overflow-auto">
                    <p className="whitespace-pre-wrap">{generatedContent}</p>
                  <button
                    onClick={handleCopy} 
                    className="mt-4 px-6 py-2 mx-auto bg-primary hover:bg-blue-600 text-text font-semibold rounded-md shadow-md transition duration-300 ease-in-out"
                  >
                    {showCopyMessage ? "Copiado!" : "Copiar Conteúdo"}
                  </button>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center flex items-center justify-center h-full">
                  Preencha os detalhes do imóvel e clique em Gerar Conteúdo.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      <Modal
        isOpen={showOnboarding}
        onClose={handleSkipOnboarding} // O botão de fechar do modal chama 'Pular Tour'
        title={onboardingStepsData[onboardingStep].title} // Título do passo atual
        content={
          <>
            <p className="mb-4">
              {onboardingStepsData[onboardingStep].message}
            </p>
            <div className="flex justify-between mt-6">
              {/* Botão Próximo (mostra em todos os passos, exceto o último) */}
              {onboardingStep < onboardingStepsData.length - 1 && (
                <button
                  onClick={handleNextOnboardingStep}
                  className="bg-button hover:bg-hover text-white font-medium py-2 px-4 rounded-md transition duration-300"
                >
                  Próximo {onboardingStep + 1}/{onboardingStepsData.length}
                </button>
              )}
              {/* Botão Começar/Finalizar (aparece apenas no último passo) */}
              {onboardingStep === onboardingStepsData.length - 1 && (
                <button
                  onClick={handleNextOnboardingStep} // No último passo, ele também finaliza o tour
                  className="bg-button hover:bg-hover text-white font-medium py-2 px-4 rounded-md transition duration-300"
                >
                  Começar!
                </button>
              )}
              {/* Botão Pular Tour / Fechar */}
              <button
                onClick={handleSkipOnboarding}
                className="text-text hover:underline py-2 px-4 rounded-md"
              >
                {onboardingStep < onboardingStepsData.length - 1
                  ? "Pular Tour"
                  : "Fechar"}
              </button>
            </div>
          </>
        }
        className="max-w-xl" // Classe opcional para a caixa do modal (pode ajustar o tamanho)
      />
    </div>
  );
}

// No topo do seu frontend/src/app/(app)/dashboard/page.tsx, ou em um arquivo de dados separado
const onboardingStepsData = [
  {
    title: "Bem-vindo ao Gerador de Conteúdo!",
    message:
      "Este pequeno tour irá te ajudar a dar os primeiros passos na criação de conteúdo para imóveis.",
  },
  {
    title: "1. Escolha seu Template",
    message:
      "Aqui você seleciona o tipo de conteúdo que deseja gerar. Temos modelos para diversos tipos de imóveis, como 'Descrição de Imóvel para Venda' ou 'Anúncio para Redes Sociais'.",
  },
  {
    title: "2. Preencha os Detalhes do Imóvel",
    message:
      "Use este formulário para inserir todas as informações importantes sobre o imóvel: tipo, localização, quartos, banheiros, vagas de garagem, e quaisquer detalhes adicionais. Quanto mais detalhes, melhor o conteúdo gerado!",
  },
  {
    title: "3. Gere e Revise",
    message:
      "Após preencher tudo, clique no botão 'Gerar Conteúdo'. A IA criará o texto para você, que aparecerá nesta área. Você poderá revisar e copiar o texto gerado aqui.",
  },
  {
    title: "4. Salve e Compartilhe",
    message:
      "Se gostou do conteúdo, não se esqueça de salvá-lo no seu histórico. De lá, você pode editá-lo para refinar ainda mais, ou compartilhá-lo facilmente em diversas plataformas!",
  },
  {
    title: "Pronto para Criar?",
    message:
      "Agora você está pronto para criar conteúdos incríveis em segundos! Explore os templates e deixe a IA trabalhar por você. Se precisar de ajuda, acesse a seção de Configurações no menu lateral.",
  },
];
