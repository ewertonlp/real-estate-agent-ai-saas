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
  FaStar,
  FaRegStar,
  FaSearch,
  FaFilter,
  FaExpandAlt,
  FaHome,
  FaMapMarkerAlt,
  FaWindowClose,
} from "react-icons/fa";
import { IoIosAlbums } from "react-icons/io";

interface GeneratedContentItem {
  id: number;
  prompt_used: string;
  generated_text: string;
  owner_id: number;
  created_at: string;
  is_favorite: boolean;
}

const extractPromptDetails = (prompt: string) => {
  const propertyTypeMatch = prompt.match(/Tipo de imóvel:\s*([^.]+)\./);
  const locationMatch = prompt.match(/Localização:\s*([^.]+)\./);

  const propertyType = propertyTypeMatch
    ? propertyTypeMatch[1].trim()
    : "Não especificado";
  const location = locationMatch ? locationMatch[1].trim() : "Não especificado";

  return { propertyType, location };
};
// Função para truncar texto por linhas
const truncateTextByLines = (text: string, maxLines: number): string => {
  const lines = text.split("\n");
  if (lines.length > maxLines) {
    return lines.slice(0, maxLines).join("\n") + "...";
  }
  return text;
};

// --- Componente Modal (simples, pode ser mais complexo) ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-card-light p-6 rounded-lg shadow-xl max-w-[50vw] w-full max-h-[90vh] overflow-y-auto relative">
        <h2 className="text-2xl font-bold mb-4 text-text">{title}</h2>
        <pre className="whitespace-pre-wrap text-text mb-6 font-poppins">
          {content}
        </pre>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 hover:bg-black rounded-full p-2 text-text"
        >
          <FaWindowClose />
        </button>
      </div>
    </div>
  );
};

export default function HistoryPage() {
  const [history, setHistory] = useState<GeneratedContentItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para filtros
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false); //
  const [searchTerm, setSearchTerm] = useState(""); //
  const [startDate, setStartDate] = useState(""); //
  const [endDate, setEndDate] = useState(""); //

  // Estados para o Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");

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
    setHistory((prevHistory) =>
      prevHistory.map((h) =>
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
      setHistory((prevHistory) =>
        prevHistory.map((h) =>
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-text">Carregando autenticação...</p>
      </div>
    );
  }

  // Função para abrir o modal com o conteúdo completo
  const openModal = (title: string, content: string) => {
    setModalTitle(title);
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalTitle("");
    setModalContent("");
  };

  return (
    <main className="bg-card p-8 rounded-lg shadow-md w-full max-w-full">
      <div className="flex items-center justify-start gap-4 text-text mb-10">
      <IoIosAlbums size={25} />
      <h1 className="text-2xl font-medium ">
        Meu Histórico de Conteúdo
      </h1>
      </div>

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
      <div className="mb-6 p-4 bg-card-light border border-border rounded-lg">
        <h2 className="text-xl font-medium text-text mb-8 flex items-center gap-2">
          <FaFilter className="text-text" /> Filtrar e Buscar
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Busca por texto */}
          <div>
            <label
              htmlFor="searchTerm"
              className="block text-sm font-medium text-text"
            >
              Buscar no conteúdo:
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                name="searchTerm"
                id="searchTerm"
                className="bg-card focus:ring-border focus:border-border block w-full rounded-md sm:text-sm border-border px-3 py-2"
                placeholder="Buscar por prompt ou texto gerado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="button"
                onClick={fetchHistory}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-card bg-button hover:bg-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-border"
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
              className="focus:ring-border h-4 w-4 text-text border-border rounded"
              checked={showFavoritesOnly}
              onChange={(e) => setShowFavoritesOnly(e.target.checked)}
            />
            <label
              htmlFor="showFavoritesOnly"
              className="ml-2 block text-sm font-medium text-text"
            >
              Mostrar apenas favoritos
            </label>
          </div>

          {/* Filtro por Data (Início) */}
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-text"
            >
              Data Inicial:
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              className="mt-1 bg-card focus:ring-border focus:border-border block w-full rounded-md sm:text-sm border-border placeholder:text-black px-3 py-2"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* Filtro por Data (Fim) */}
          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-text"
            >
              Data Final:
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              className="mt-1 bg-card focus:ring-border focus:border-border block w-full rounded-md sm:text-sm border-border placeholder:text-black px-3 py-2"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {isLoadingHistory ? (
        <div className="flex justify-center items-center h-48 bg-card">
          <svg
            className="animate-spin h-8 w-8 text-text"
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
          <p className="ml-3 text-text">Carregando histórico...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="text-center text-gray-600 py-10">
          <p>Nenhum conteúdo encontrado com os filtros aplicados.</p>
          <Link
            href="/dashboard"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-text bg-card-light hover:bg-card focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-border"
          >
            Gerar meu primeiro conteúdo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {history.map((item) => {
            const { propertyType, location } = extractPromptDetails(
              item.prompt_used
            );
            const truncatedPrompt = truncateTextByLines(item.prompt_used, 2); // Limita o prompt a 3 linhas
            const truncatedGeneratedText = truncateTextByLines(
              item.generated_text,
              8
            ); // Limita o texto gerado a 8 linhas
            return (
              <div
                key={item.id}
                className="bg-card-light rounded-lg shadow-lg p-6 relative"
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="text-xs text-text">
                    Gerado em:{" "}
                    {new Date(item.created_at).toLocaleString("pt-BR")}
                  </p>
                  {/* Botão de Favoritar */}
                  <button onClick={() => handleToggleFavorite(item)}>
                    {item.is_favorite ? (
                      <FaStar className="text-yellow-400" />
                    ) : (
                      <FaRegStar className="text-text" />
                    )}
                  </button>
                </div>

                <div className="mb-4 text-sm text-gray-700">
                  <p className="flex items-center mb-1 text-text">
                    <FaHome className="mr-2 text-text" /> **Tipo:**{" "}
                    {propertyType}
                  </p>
                  <p className="flex items-center text-text">
                    <FaMapMarkerAlt className="mr-2 text-text" />{" "}
                    **Localização:** {location}
                  </p>
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-text mb-2">
                    Prompt Utilizado:
                  </h3>
                  <div className="whitespace-pre-wrap text-text text-sm mb-2 border-l-4 border-border pl-3 py-1 bg-card max-h-24 overflow-hidden">
                    {truncatedPrompt}
                  </div>
                  {item.prompt_used.split("\n").length > 6 && ( // Adiciona botão "Ver Mais" para prompt
                    <button
                      onClick={() =>
                        openModal("Prompt Completo", item.prompt_used)
                      }
                      className="text-text hover:underline text-sm mb-4 flex items-center justify-end"
                    >
                      Ver Mais <FaExpandAlt className="ml-2 text-xs" />
                    </button>
                  )}

                  <h3 className="text-lg font-semibold text-text mb-2">
                    Conteúdo Gerado:
                  </h3>
                  <div
                    className="whitespace-pre-wrap text-text text-base flex-grow overflow-hidden"
                    style={{ lineHeight: "1.6" }}
                  >
                    {truncatedGeneratedText}
                  </div>
                  <div className="flex justify-center">
                    {item.generated_text.split("\n").length > 6 && ( // Adiciona botão "Ver Mais" para conteúdo
                      <button
                        onClick={() =>
                          openModal(
                            "Conteúdo Gerado Completo",
                            item.generated_text
                          )
                        }
                        className="mt-8 py-1 px-2 rounded-md text-text hover:bg-card hover:text-slate-50 text-md font-medium flex items-center justify-center border border-border transition-colors"
                      >
                        Ver Mais <FaExpandAlt className="ml-2 text-sm" />
                      </button>
                    )}
                  </div>
                  {/* Botões de Ação para cada item */}
                  <div className="flex flex-wrap gap-4 mt-10 justify-center items-end">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-zinc-500 hover:bg-zinc-600 text-white font-medium py-1 px-3 rounded text-sm flex items-center space-x-1 transition-all"
                      title="Editar ou Reutilizar no Dashboard"
                    >
                      <FaEdit />
                      <span>Editar/Reutilizar</span>
                    </button>

                    {/* Grupo de botões de Compartilhamento */}
                    <div className="relative group">
                      <button
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-1 px-3 rounded text-sm flex items-center space-x-1 transition-all"
                        title="Compartilhar Conteúdo"
                      >
                        <FaShareAlt />
                        <span>Compartilhar</span>
                      </button>
                      <div className="absolute right-0 top-full mt-1 w-auto bg-card-light border-border rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                        <button
                          onClick={() => shareOnWhatsapp(item.generated_text)}
                          className=" w-full text-left px-4 py-2 text-sm text-text hover:bg-card flex items-center space-x-2"
                        >
                          <FaWhatsapp className="text-green-500" />{" "}
                          <span>WhatsApp</span>
                        </button>
                        <button
                          onClick={() => shareOnFacebook(item.generated_text)}
                          className=" w-full text-left px-4 py-2 text-sm text-text hover:bg-card flex items-center space-x-2"
                        >
                          <FaFacebook className="text-blue-600" />{" "}
                          <span>Facebook</span>
                        </button>
                        <button
                          onClick={() => shareOnInstagram(item.generated_text)}
                          className=" w-full text-left px-4 py-2 text-sm text-text hover:bg-card flex items-center space-x-2"
                        >
                          <FaClipboard className="text-purple-500" />{" "}
                          <span>Instagram (Copiar)</span>
                        </button>
                        <button
                          onClick={() => shareOnEmail(item.generated_text)}
                          className="w-full text-left px-4 py-2 text-sm text-text hover:bg-card flex items-center space-x-2"
                        >
                          <FaEnvelope className="text-orange-500" />{" "}
                          <span>E-mail</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalTitle}
        content={modalContent}
      />
    </main>
  );
}
