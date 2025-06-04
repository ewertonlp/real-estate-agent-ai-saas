// frontend/src/app/(app)/templates/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getPromptTemplates, PromptTemplate } from '@/lib/api';
import toast from 'react-hot-toast';
import { FaStar, FaLock } from 'react-icons/fa'; // Import icons
import Link from 'next/link'; // Certifique-se de importar Link

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isAuthenticated, isLoading: isAuthLoading, userPlanName } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      const fetchTemplates = async () => {
        try {
          const fetchedTemplates = await getPromptTemplates();
          setTemplates(fetchedTemplates);
        } catch (err: any) {
          setError(err.message || 'Erro ao carregar templates.');
          toast.error(err.message || 'Erro ao carregar templates.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchTemplates();
    }
  }, [isAuthenticated, isAuthLoading, router]);

  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-text">Carregando templates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const isPremiumUser = userPlanName === 'Premium' || userPlanName === 'Unlimited';

  return (
    <main className="bg-card p-8 rounded-lg shadow-md w-full max-w-4xl">
      <h1 className="text-2xl font-medium text-text text-center mb-10">
        Nossos Templates de Conteúdo
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`bg-card-light rounded-lg shadow-lg p-6 flex flex-col justify-between
              ${template.is_premium && !isPremiumUser ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-xl transition-shadow duration-300'}
              border border-border
            `}
          >
            <div>
              <h2 className="text-xl font-semibold text-text mb-2">
                {template.name}
                {template.is_premium && (
                  <span className="ml-2 text-yellow-400">
                    <FaStar className="inline-block" /> Premium
                  </span>
                )}
              </h2>
              <p className="text-sm text-text mb-4">
                {template.description || 'Sem descrição.'}
              </p>
              <div className="text-sm text-gray-400 whitespace-pre-wrap max-h-32 overflow-hidden mb-4">
                {template.template_text.substring(0, 150)}...
                {/* Opcional: Adicione um "Ver mais" aqui se o texto for muito longo */}
              </div>
            </div>

            {template.is_premium && !isPremiumUser ? (
              <div className="text-center mt-4">
                <button
                  disabled
                  className="w-full py-2 px-4 rounded-md font-semibold text-sm bg-gray-500 text-white flex items-center justify-center"
                >
                  <FaLock className="mr-2" />
                  Apenas para Planos Premium
                </button>
                <Link href="/plans" className="mt-2 block text-button hover:underline text-sm">
                  Fazer Upgrade
                </Link>
              </div>
            ) : (
              <button
                onClick={() => {
                  // Codifica o template_text para passá-lo na URL
                  const encodedTemplateText = encodeURIComponent(template.template_text);
                  // Redireciona para o dashboard com o template como parâmetro
                  router.push(`/dashboard?templateText=${encodedTemplateText}`);
                  toast.success(`Template "${template.name}" selecionado! Preencha os detalhes e gere seu conteúdo.`);
                }}
                className="w-full py-2 px-4 rounded-md font-semibold text-sm bg-button text-white hover:bg-hover transition-colors"
              >
                Usar Template
              </button>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}