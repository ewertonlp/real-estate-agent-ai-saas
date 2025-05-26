// frontend/src/app/history/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getGeneratedContentHistory } from "@/lib/api"; // Importa a função para buscar o histórico
import Link from "next/link";
import toast from "react-hot-toast";

interface GeneratedContentItem {
  id: number;
  prompt_used: string;
  generated_text: string;
  owner_id: number;
  created_at: string; // Como vem da API, pode ser string. Converte para Date se precisar formatar.
}

export default function HistoryPage() {
  const [history, setHistory] = useState<GeneratedContentItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  // Efeito para verificar autenticação e carregar histórico
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/login"); // Redireciona se não estiver autenticado
      return; // Interrompe a execução para evitar buscar histórico sem autenticação
    }

    if (isAuthenticated) {
      const fetchHistory = async () => {
        try {
          // ... (código existente para setar estados) ...
          const data = await getGeneratedContentHistory();
          setHistory(data);
          toast.success("Histórico carregado com sucesso!"); // <--- Toast de sucesso
        } catch (err: any) {
          console.error("Erro ao carregar histórico:", err);
          if (
            err.message === "Sessão expirada. Por favor, faça login novamente."
          ) {
            router.push("/login");
            toast.error("Sessão expirada. Por favor, faça login novamente."); // <--- Toast de erro
          } else {
            toast.error(
              err.message || "Ocorreu um erro ao carregar o histórico."
            ); // <--- Toast de erro
          }
          setError(err.message || "Ocorreu um erro ao carregar o histórico.");
        } finally {
          setIsLoadingHistory(false);
        }
      };

      fetchHistory();
    }
  }, [isAuthenticated, isAuthLoading, router]); // Dependências do useEffect

  // Exibe tela de carregamento da autenticação
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-700">Carregando autenticação...</p>
      </div>
    );
  }

  // Se não autenticado e carregamento terminou, redirecionamento já ocorreu
  // Então, se chegar aqui, o usuário está autenticado
  return (
    <div className="bg-stone-50 flex flex-col items-center justify-center py-10">
      <main className="bg-[#ffffff]  p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Meu Histórico de Conteúdo
        </h1>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4"
            role="alert"
          >
            <strong className="font-bold">Erro:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {isLoadingHistory ? (
          <div className="flex justify-center items-center h-48">
            <svg
              className="animate-spin h-8 w-8 text-blue-600"
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
            <p className="ml-3 text-gray-600">Carregando histórico...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center text-gray-600 py-10">
            <p>
              Nenhum conteúdo gerado ainda. Comece a criar na página inicial!
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Gerar meu primeiro conteúdo
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {history.map((item) => (
              <div
                key={item.id}
                className="bg-blue-50 border border-blue-200 rounded-lg shadow-inner p-6 relative"
              >
                <p className="text-xs text-gray-500 mb-2">
                  Gerado em: {new Date(item.created_at).toLocaleString("pt-BR")}
                </p>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Prompt Utilizado:
                </h3>
                <div className="whitespace-pre-wrap text-gray-700 text-sm mb-4 border-l-4 border-blue-300 pl-3 py-1 bg-white">
                  {item.prompt_used}
                </div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Conteúdo Gerado:
                </h3>
                <div
                  className="whitespace-pre-wrap text-gray-800 text-base"
                  style={{ lineHeight: "1.6" }}
                >
                  {item.generated_text}
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(item.generated_text);
                    toast.success(
                      "Conteúdo copiado para a área de transferência!"
                    );
                  }}
                  className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-2 rounded text-sm flex items-center space-x-1"
                  title="Copiar conteúdo gerado"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75m1.5 0h-.75A1.125 1.125 0 0 0 6 7.875v8.25c0 .621.504 1.125 1.125 1.125h8.25c.621 0 1.125-.504 1.125-1.125v-3.375m-1.5-1.5-.75.75-.75-.75m3-6v6m0 0-3-3m3 3L18 7.5"
                    />
                  </svg>
                  <span>Copiar</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
