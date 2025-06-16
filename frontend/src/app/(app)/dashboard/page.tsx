// frontend/src/app/(app)/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import PropertyDetailsForm from '@/components/propertyDetailsForm';
import { PropertyDetailsFormSchema } from '@/components/propertyDetailsForm';
import { generateContent, PropertyDetailsInput, TextGenerationOutput } from '@/lib/api';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

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

    const [generatedContent, setGeneratedContent] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [showCopyMessage, setShowCopyMessage] = useState<boolean>(false); // <<< ESTADO showCopyMessage

    // NOVO ESTADO: para passar valores iniciais ao PropertyDetailsForm
    const [initialFormValues, setInitialFormValues] = useState<Partial<PropertyDetailsFormSchema>>({});

    // Efeito para preencher o formulário com dados do histórico, se presentes na URL
    // OU para lidar com status de pagamento
    useEffect(() => {
        const promptFromHistory = searchParams.get("prompt");
        const generatedTextFromHistory = searchParams.get("generatedText");
        const templateTextFromUrl = searchParams.get("templateText");

        if (templateTextFromUrl) {
            setInitialFormValues(prev => ({
                ...prev,
                additionalDetails: decodeURIComponent(templateTextFromUrl)
            }));
            toast.success("Template aplicado ao campo 'Outros Detalhes Importantes'!");
            router.replace("/dashboard", undefined);

        } else if (promptFromHistory) {
            setInitialFormValues(prev => ({
                ...prev,
                additionalDetails: decodeURIComponent(promptFromHistory)
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
            setError("Você não está logado ou a sessão expirou. Por favor, faça login novamente.");
            console.error("Erro: Usuário não autenticado no handleSubmit. isAuthenticated:", isAuthenticated, "userToken:", userToken);
            return;
        }

        setLoading(true);
        setError('');
        setGeneratedContent("");

        const isBasicFormEmpty =
            !formData.propertyType && !formData.bedrooms && !formData.bathrooms &&
            !formData.propertyValue && !formData.condoFee && !formData.iptuValue &&
            !formData.location && !formData.specialFeatures && !formData.tone &&
            !formData.purpose && !formData.targetAudience && !formData.length &&
            !formData.language && !formData.additionalDetails;

        const isSeoGmbFormEmpty = !(
            formData.seoKeywords || formData.contactPhone || formData.contactEmail ||
            formData.contactWebsite || formData.propertyAddress
        );

        if (isBasicFormEmpty && (!formData.optimizeForSeoGmb || (formData.optimizeForSeoGmb && isSeoGmbFormEmpty))) {
            setError("Por favor, preencha pelo menos um campo para gerar o conteúdo.");
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
            property_value: formData.propertyValue ? parseFloat(formData.propertyValue) : undefined,
            condo_fee: formData.condoFee ? parseFloat(formData.condoFee) : undefined,
            iptu_value: formData.iptuValue ? parseFloat(formData.iptuValue) : undefined,
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
                <p className="ml-2 text-gray-700 dark:text-gray-300">Carregando autenticação...</p>
            </div>
        );
    }

    // Redireciona se não estiver autenticado após o carregamento
    if (!isAuthenticated) {
        router.push('/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-card dark:bg-card text-text dark:text-gray-100 p-4 sm:p-6 lg:p-8 rounded-lg">
            <h1 className="text-3xl font-semibold mb-12 text-center">Gerar Conteúdo para Imóveis</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                <div className='bg-card p-6 rounded-lg border border-border'>
                    <PropertyDetailsForm onSubmit={handleSubmit} loading={loading} initialData={initialFormValues} />
                    {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
                </div>

                <div className="bg-background dark:bg-background p-6 rounded-lg border border-border flex flex-col">
                    <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Conteúdo Gerado</h2>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center flex-grow">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                            <p className="mt-2 text-gray-600 dark:text-gray-400">Gerando seu conteúdo...</p>
                        </div>
                    ) : (
                        <div className="flex-grow">
                            {generatedContent ? (
                                <>
                                    <div className="border border-gray-300 dark:border-gray-600 rounded-md p-4 bg-gray-50 dark:bg-gray-700 h-full overflow-auto">
                                        <p className="whitespace-pre-wrap">{generatedContent}</p>
                                    </div>
                                    <button
                                        onClick={handleCopy} // <<< USANDO handleCopy AQUI
                                        className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition duration-300 ease-in-out"
                                    >
                                        {showCopyMessage ? "Copiado!" : "Copiar Conteúdo"}
                                    </button>
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
        </div>
    );
}