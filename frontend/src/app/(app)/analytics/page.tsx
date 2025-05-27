"use client";

import { useState, useEffect } from "react";
import { getUserAnalytics } from "@/lib/api"; // Certifique-se de que este caminho está correto
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function AnalyticsPage() {
  const [totalGeneratedContent, setTotalGeneratedContent] = useState<number | null>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);

  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      const fetchAnalytics = async () => {
        try {
          const data = await getUserAnalytics();
          setTotalGeneratedContent(data.total_generated_content);
        } catch (err) {
          console.error("Erro ao carregar analytics:", err);
          toast.error("Não foi possível carregar os dados de analytics.");
        } finally {
          setIsLoadingAnalytics(false);
        }
      };
      fetchAnalytics();
    }
  }, [isAuthenticated, isAuthLoading]);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-700">Carregando autenticação...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirecionamento já deve ter ocorrido pelo AuthContext,
    // mas é bom ter uma mensagem fallback
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-700">Você precisa estar logado para ver esta página.</p>
      </div>
    );
  }

  return (
    <main className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold text-gray-700 text-center mb-6">
        Seus Dados de Analytics
      </h1>

      <div className="mb-6 p-4 bg-blue-100 rounded-md text-blue-800 font-semibold text-center">
        {isLoadingAnalytics ? (
          <span>Carregando estatísticas...</span>
        ) : (
          <span>Conteúdos Gerados no Total: {totalGeneratedContent !== null ? totalGeneratedContent : 'N/A'}</span>
        )}
      </div>

      {/* Você pode adicionar mais gráficos ou informações de analytics aqui */}
      <div className="mt-8 text-center text-gray-600">
        <p>Mais métricas e funcionalidades de analytics serão adicionadas em breve!</p>
      </div>
    </main>
  );
}