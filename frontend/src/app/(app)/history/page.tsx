// frontend/src/app/(app)/history/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react"; // Import useCallback
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getGeneratedContentHistory, toggleFavoriteStatus } from "@/lib/api"; // Import toggleFavoriteStatus
import Link from "next/link";
import toast from "react-hot-toast";

// Importar ícones para os botões de ação
import {
  FaEdit,
  FaShareAlt,
  FaWhatsapp,
  FaFacebook,
  FaEnvelope,
  FaClipboard,
  FaStar, // Icone de estrela para favorito
  FaRegStar, // Icone de estrela vazia
  FaSearch, // Icone de busca
  FaFilter, // Icone de filtro
} from "react-icons/fa";
import { IoIosArchive, IoMdStar } from "react-icons/io";

interface GeneratedContentItem {
  id: number;
  prompt_used: string;
  generated_text: string;
  owner_id: number;
  created_at: string;
  is_favorite: boolean;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<GeneratedContentItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para filtros
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false); //
  const [searchTerm, setSearchTerm] = useState(""); //
  const [startDate, setStartDate] = useState(""); //
  const [endDate, setEndDate] = useState(""); //

  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  // Função para buscar o histórico com base nos filtros (memoizada com useCallback)
  const fetchHistory = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsLoadingHistory(true);
    setError(null);
    try {
      const data = await getGeneratedContentHistory(
        showFavoritesOnly ? true : null, // Only send true if checkbox is checked
        searchTerm,
        startDate,
        endDate
      );
      setHistory(data);
      toast.success("Histórico carregado com sucesso!");
    } catch (err: any) {
      console.error("Erro ao carregar histórico:", err);
      if (err.message === "Sessão expirada. Por favor, faça login novamente.") {
        router.push("/login");
        toast.error("Sessão expirada. Por favor, faça login novamente.");
      } else {
        toast.error(err.message || "Ocorreu um erro ao carregar o histórico.");
      }
      setError(err.message || "Ocorreu um erro ao carregar o histórico.");
    } finally {
      setIsLoadingHistory(false);
    }
  }, [
    isAuthenticated,
    showFavoritesOnly,
    searchTerm,
    startDate,
    endDate,
    router,
  ]); // Dependencies for useCallback

  // Efeito para carregar histórico na montagem e quando filtros mudam
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated) {
      fetchHistory(); // Call the memoized fetch function
    }
  }, [isAuthenticated, isAuthLoading, fetchHistory, router]);

  // Função para lidar com a alternância de favorito
const handleToggleFavorite = async (item: GeneratedContentItem) => {
  const newFavoriteStatus = !item.is_favorite;
  
  // Atualização otimista imediata na UI
  setHistory(prevHistory => 
    prevHistory.map(h => 
      h.id === item.id ? { ...h, is_favorite: newFavoriteStatus } : h
    )
  );

  try {
    // Chamada à API sem esperar por retorno
    toggleFavoriteStatus(item.id, newFavoriteStatus);
    
    // Toast de sucesso imediato
    toast.success(
      newFavoriteStatus
        ? "Conteúdo adicionado aos favoritos!"
        : "Conteúdo removido dos favoritos."
    );
  } catch (err: any) {
    console.error("Erro ao alternar favorito:", err);
    
    // Reverter em caso de erro
    setHistory(prevHistory => 
      prevHistory.map(h => 
        h.id === item.id ? { ...h, is_favorite: item.is_favorite } : h
      )
    );
    
    toast.error(err.message || "Falha ao atualizar favorito.");
  }
};

  // Função para lidar com a edição/reutilização de um item do histórico
  const handleEdit = (item: GeneratedContentItem) => {
    const promptParam = encodeURIComponent(item.prompt_used);
    const generatedTextParam = encodeURIComponent(item.generated_text);
    router.push(
      `/dashboard?prompt=${promptParam}&generatedText=${generatedTextParam}`
    );
  };

  // Funções de Compartilhamento
  const shareOnWhatsapp = (text: string) => {
    const encodedText = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`, "_blank");
  };

  const shareOnFacebook = (text: string) => {
    const encodedText = encodeURIComponent(text);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?quote=${encodedText}`,
      "_blank"
    );
  };

  const shareOnEmail = (text: string) => {
    const encodedText = encodeURIComponent(text);
    window.open(`mailto:?body=${encodedText}`, "_blank");
  };

  const shareOnInstagram = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Texto copiado para o Instagram! Agora cole-o na legenda.");
  };

  // Exibe tela de carregamento da autenticação
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-700">Carregando autenticação...</p>
      </div>
    );
  }

  return (
    <main className="bg-[#ffffff] p-8 rounded-lg shadow-md w-full max-w-4xl">
      <h1 className="text-2xl font-medium text-gray-800 text-center mb-10">
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

      {/* Seção de Filtros e Busca */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h2 className="text-xl font-medium text-gray-800 mb-8 flex items-center gap-2">
          <FaFilter className="text-slate-500" /> Filtrar e Buscar
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Busca por texto */}
          <div>
            <label
              htmlFor="searchTerm"
              className="block text-sm font-medium text-gray-700"
            >
              Buscar no conteúdo:
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                name="searchTerm"
                id="searchTerm"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md sm:text-sm border-gray-300 px-3 py-2"
                placeholder="Buscar por prompt ou texto gerado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="button"
                onClick={fetchHistory}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaSearch className="mr-2" /> Buscar
              </button>
            </div>
          </div>

          {/* Filtro por Favoritos */}
          <div className="flex items-center mt-auto mb-3 md:mb-0">
            <input
              id="showFavoritesOnly"
              name="showFavoritesOnly"
              type="checkbox"
              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              checked={showFavoritesOnly}
              onChange={(e) => setShowFavoritesOnly(e.target.checked)}
            />
            <label
              htmlFor="showFavoritesOnly"
              className="ml-2 block text-sm font-medium text-gray-900"
            >
              Mostrar apenas favoritos
            </label>
          </div>

          {/* Filtro por Data (Início) */}
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700"
            >
              Data Inicial:
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md sm:text-sm border-gray-300 px-3 py-2"
              value={startDate}
              onChange={(e) => setSearchTerm(e.target.value)} // Corrigido para setSearchTerm
            />
          </div>

          {/* Filtro por Data (Fim) */}
          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700"
            >
              Data Final:
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md sm:text-sm border-gray-300 px-3 py-2"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

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
          <p>Nenhum conteúdo encontrado com os filtros aplicados.</p>
          <Link
            href="/dashboard"
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
              <div className="flex justify-between items-start mb-2">
                <p className="text-xs text-gray-500">
                  Gerado em: {new Date(item.created_at).toLocaleString("pt-BR")}
                </p>
                {/* Botão de Favoritar */}
                <button onClick={() => handleToggleFavorite(item)}>
                  {item.is_favorite ? (
                    <FaStar className="text-yellow-400" />
                  ) : (
                    <FaRegStar className="text-gray-400" />
                  )}
                </button>
              </div>

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

              {/* Botões de Ação para cada item */}
              <div className="flex flex-wrap gap-2 mt-4 justify-end">
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-1 px-3 rounded text-sm flex items-center space-x-1"
                  title="Editar ou Reutilizar no Dashboard"
                >
                  <FaEdit />
                  <span>Editar/Reutilizar</span>
                </button>

                {/* Grupo de botões de Compartilhamento */}
                <div className="relative group">
                  <button
                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded text-sm flex items-center space-x-1"
                    title="Compartilhar Conteúdo"
                  >
                    <FaShareAlt />
                    <span>Compartilhar</span>
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-auto bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <button
                      onClick={() => shareOnWhatsapp(item.generated_text)}
                      className=" w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <FaWhatsapp className="text-green-500" />{" "}
                      <span>WhatsApp</span>
                    </button>
                    <button
                      onClick={() => shareOnFacebook(item.generated_text)}
                      className=" w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <FaFacebook className="text-blue-600" />{" "}
                      <span>Facebook</span>
                    </button>
                    <button
                      onClick={() => shareOnInstagram(item.generated_text)}
                      className=" w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <FaClipboard className="text-purple-500" />{" "}
                      <span>Instagram (Copiar)</span>
                    </button>
                    <button
                      onClick={() => shareOnEmail(item.generated_text)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <FaEnvelope className="text-orange-500" />{" "}
                      <span>E-mail</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
