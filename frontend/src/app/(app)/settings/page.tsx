// frontend/src/app/(app)/settings/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { changeUserPassword, getUserAnalytics } from "@/lib/api"; // Importe getUserAnalytics
import { useTheme } from "next-themes";
import { FaMoon, FaPencilAlt, FaSun, FaTimes } from "react-icons/fa";
import Loader from "@/components/loader";
import { IoSettingsOutline } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { updateUserInfo } from "@/lib/api";
import { CancelarAssinaturaButton } from "@/components/btnCancelSubscription";

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoadingPasswordChange, setIsLoadingPasswordChange] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [isEditInfoModal, setIsEditInfoModal] = useState(false);
  const [totalGeneratedContent, setTotalGeneratedContent] = useState<
    number | null
  >(null); // NOVO ESTADO
  



  const {
    isAuthenticated,
    isLoading: isAuthLoading,
    userEmail,
    userPlanName,
    userGenerationsCount,
    userMaxGenerations,
  } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<{ nome: string; creci: string }>();

  const fetchAnalytics = useCallback(async () => {
    if (!isAuthenticated) {
      console.log("Não autenticado, pulando fetchAnalytics."); // Debug
      return;
    }

    try {
      const data = await getUserAnalytics(); // Chama a API de analytics
      // Verifique se data e data.total_generated_content existem e são números
      if (data && typeof data.total_generated_content === "number") {
        setTotalGeneratedContent(data.total_generated_content);
      } else {
        console.warn(
          "total_generated_content não é um número ou é nulo/indefinido:",
          data.total_generated_content
        ); // Debug: Aviso
        setTotalGeneratedContent(0); // Defina um valor padrão, como 0, se o valor não for um número válido
      }
    } catch (err: any) {
      console.error("Erro ao carregar analytics em settings:", err); // Debug: Erro completo
      toast.error("Não foi possível carregar os dados.");
      setTotalGeneratedContent(null); // Mantenha como null para indicar erro ou "carregando com erro"
    }
  }, [isAuthenticated]); // fetchAnalytics depende apenas de isAuthenticated

  // Efeito para verificar autenticação e carregar analytics
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated) {
      fetchAnalytics(); // Chama a função memoizada
    }

    // if (isAuthenticated) {
    //   // Fetch analytics data when authenticated
    //   const fetchAnalytics = async () => {
    //     try {
    //       const data = await getUserAnalytics(); // Chama a API de analytics
    //       setTotalGeneratedContent(data.total_generated_content);
    //     } catch (err) {
    //       console.error("Erro ao carregar analytics em settings:", err);
    //       toast.error("Não foi possível carregar os dados.");
    //       setTotalGeneratedContent(null); // Define como nulo em caso de erro
    //     }
    //   };
    //   fetchAnalytics();
    // }
  }, [isAuthenticated, isAuthLoading, router, fetchAnalytics]); // Adicionado fetchAnalytics como dependência para garantir que rode

  const handleSubmitPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoadingPasswordChange(true);

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError("Por favor, preencha todos os campos.");
      setIsLoadingPasswordChange(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("A nova senha e a confirmação não correspondem.");
      setIsLoadingPasswordChange(false);
      return;
    }

    if (newPassword.length < 8) {
      setError("A nova senha deve ter pelo menos 8 caracteres.");
      setIsLoadingPasswordChange(false);
      return;
    }

    try {
      await toast.promise(
        changeUserPassword(currentPassword, newPassword), // A promessa a ser resolvida
        {
          pending: "Alterando senha...", // Mensagem exibida enquanto a promessa está pendente
          success: "Senha alterada com sucesso! 🎉", // Mensagem de sucesso quando a promessa é resolvida
          error: {
            render({ data }: any) {
              // 'data' contém o erro lançado pela promessa (catch)
              const errorMessage =
                data?.message || "Ocorreu um erro ao alterar a senha.";
              console.error("Erro ao mudar senha (toast.promise):", data); // Log detalhado para depuração
              setError(errorMessage); // Opcional: atualiza o estado de erro, se quiser exibir também abaixo do formulário
              return errorMessage; // Mensagem de erro que será exibida no toast
            },
          },
        }
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err: any) {
    } finally {
      setIsLoadingPasswordChange(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-text">Carregando autenticação...</p>
      </div>
    );
  }

  const handleToggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  if (isAuthLoading) {
    return (
      <Loader message="Carregando autenticação..." /> // Usa o componente Loader
    );
  }

  const openEditInfoModal = () => {
    setModalTitle("Editar Informações");
    setIsModalOpen(true);
    setIsEditInfoModal(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalTitle("");
    setIsEditInfoModal(false);
    reset(); // Reseta o formulário ao fechar
  };

  const onSubmitInfoModal = async (data: { nome: string; creci: string }) => {
    try {
      await updateUserInfo(data.nome, data.creci);
      toast.success("Informações salvas com sucesso!");
      closeModal();

      // Atualiza o contexto de autenticação se necessário
      // (você pode precisar implementar esta função no AuthContext)
      // refreshUserInfo();
    } catch (error: any) {
      console.error("Erro ao atualizar informações:", error);

      // Tratamento específico para erro 401
      if (error.message.includes("401")) {
        toast.error("Sessão expirada. Por favor, faça login novamente.");
        router.push("/login");
      } else {
        toast.error(error.message || "Erro ao salvar informações.");
      }
    }
  };

  

  return (
    <main className="bg-card p-8 rounded-lg shadow-md w-full max-w-full">
      <div className="flex items-center justify-start gap-4 mb-12">
        <IoSettingsOutline className="text-2xl" />
        <h1 className="text-3xl font-medium ">Configurações da Conta</h1>
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

      <div className="grid grid-cols-1 items-start gap-6 max-w-xl mx-auto">
        {/* Informações do Plano Section - ATUALIZADO */}
        <section className="p-4 w-full border-b">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-xl font-semibold text-text ">
              Minhas Informações
            </h2>
            <button className="">
              <FaPencilAlt onClick={openEditInfoModal} className="text-text" />
            </button>
          </div>
          <div className="space-y-2 text-text">
            <p>
              <strong>Email:</strong> {userEmail || "N/A"}
            </p>
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
            {/* NOVA LINHA PARA O TOTAL DE GERAÇÕES */}
            <p>
              <strong>Total de Conteúdos Gerados:</strong>{" "}
              {totalGeneratedContent !== null
                ? totalGeneratedContent
                : "Carregando..."}
            </p>
          </div>
          {userPlanName && userPlanName !== "Unlimited" && (
            <Link
              href="/plans"
              className="mt-4 inline-block bg-button hover:bg-hover text-white font-medium py-2 px-4 rounded-md transition duration-300"
            >
              Fazer Upgrade de Plano
            </Link>
          )}
          <CancelarAssinaturaButton/>
        </section>

        {/* Alterar Senha Section (mantido) */}
        <section className="w-full p-4 border-b">
          <h2 className="text-xl font-medium text-text mb-4 border-b pb-2">
            Alterar Senha
          </h2>
          <form onSubmit={handleSubmitPasswordChange} className="space-y-4">
            <div>
              <input
                id="current-password"
                name="current_password"
                type="password"
                autoComplete="current-password"
                placeholder="Senha atual"
                required
                className="appearance-none border rounded-md w-full py-3 px-4 bg-card border-button text-text leading-tight focus:outline-none focus:ring-2 focus:ring-border focus:border-transparent"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div>
              <input
                id="new-password"
                name="new_password"
                type="password"
                autoComplete="new-password"
                placeholder="Nova senha"
                required
                className="appearance-none border rounded-md w-full py-3 px-4 bg-card border-button text-text leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <input
                id="confirm-new-password"
                name="confirm_new_password"
                type="password"
                autoComplete="new-password"
                placeholder="Confirme a nova senha"
                required
                className="appearance-none border rounded-md w-full py-3 px-4 bg-card border-button text-text leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </div>
            <div className="py-4">
              <button
                type="submit"
                disabled={isLoadingPasswordChange}
                className="bg-button hover:bg-hover text-text font-medium font-md py-2 px-4 rounded-md focus:outline-none focus:shadow-outline w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all
                "
              >
                {isLoadingPasswordChange ? (
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
                    Alterando...
                  </>
                ) : (
                  "Alterar Senha"
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Theme Toggle Section (mantido) */}
        <section className="p-4 w-full border-b ">
          <h2 className="text-xl font-medium text-text mb-4 border-b pb-2">
            Configurações de Tema
          </h2>
          <div className="flex items-center justify-between space-x-4">
            <span className="text-text">Modo Escuro / Claro</span>
            <button
              onClick={handleToggleTheme}
              className="p-2 rounded-md bg-button/25 text-text hover:bg-button transition-colors flex items-center space-x-2"
            >
              {theme === "light" ? (
                <>
                  <FaMoon /> <span>Modo Escuro</span>
                </>
              ) : (
                <>
                  <FaSun className="text-yellow-300" /> <span>Modo Claro</span>
                </>
              )}
            </button>
          </div>
        </section>
      </div>
      {/* Modal para edição de informações */}
      {isModalOpen && isEditInfoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div
            className="bg-card p-6 rounded-lg shadow-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">{modalTitle}</h3>
              <button
                onClick={closeModal}
                className="text-text hover:text-red-500"
              >
                <FaTimes />
              </button>
            </div>

            {/* Formulário movido para dentro do modal */}
            <form
              onSubmit={handleSubmit(onSubmitInfoModal)}
              className="space-y-4 py-4"
            >
              <div>
                <input
                  id="nome"
                  placeholder="Nome completo"
                  {...register("nome", { required: "Nome é obrigatório" })}
                  className="w-full px-4 py-2 bg-background border border-button rounded-md text-text"
                />
                {errors.nome && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.nome.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  id="creci"
                  placeholder="Número do CRECI"
                  {...register("creci", {
                    required: "O número do CRECI é obrigatório",
                    pattern: {
                      value: /^[0-9A-Za-z-]+$/,
                      message: "Formato inválido para o CRECI",
                    },
                  })}
                  className="w-full px-4 py-2 border border-button rounded-md bg-background text-text"
                />
                {errors.creci && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.creci.message}
                  </p>
                )}
              </div>

              <div className="mt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-background text-text rounded hover:bg-my-card-light transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-button text-text rounded hover:bg-primary disabled:opacity-50"
                >
                  {isSubmitting ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    
    </main>
  );
}
