"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { changeUserPassword, getUserAnalytics } from "@/lib/api";
import { useTheme } from "next-themes";
import { FaMoon, FaPencilAlt, FaSun, FaTimes } from "react-icons/fa";
import Loader from "@/components/loader";
import { IoSettingsOutline } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { updateUserInfo } from "@/lib/api";
import { CancelarAssinaturaButton } from "@/components/btnCancelSubscription";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import PasswordChangeForm from "@/components/dashboard/changePassword";

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoadingPasswordChange, setIsLoadingPasswordChange] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [isEditInfoModal, setIsEditInfoModal] = useState(false);
  const [totalGeneratedContent, setTotalGeneratedContent] = useState<
    number | null
  >(null); // NOVO ESTADO

  const {
    isAuthenticated,
    isLoading: isAuthLoading,
    userEmail,
    userNome,
    userCreci,
    userPlanName,
    userGenerationsCount,
    userMaxGenerations,
    fetchUserData,
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
      console.log("Não autenticado, pulando fetchAnalytics.");
      return;
    }

    try {
      const data = await getUserAnalytics();

      if (data && typeof data.total_generated_content === "number") {
        setTotalGeneratedContent(data.total_generated_content);
      } else {
        console.warn(
          "total_generated_content não é um número ou é nulo/indefinido:",
          data.total_generated_content,
        );
        setTotalGeneratedContent(0);
      }
    } catch (err: any) {
      console.error("Erro ao carregar analytics em settings:", err);
      toast.error("Não foi possível carregar os dados.");
      setTotalGeneratedContent(null);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated) {
      fetchAnalytics();
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
  }, [isAuthenticated, isAuthLoading, router, fetchAnalytics]);


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
      await toast.promise(changeUserPassword(currentPassword, newPassword), {
        pending: "Alterando senha...",
        success: "Senha alterada com sucesso! 🎉",
        error: {
          render({ data }: any) {
            const errorMessage =
              data?.message || "Ocorreu um erro ao alterar a senha.";
            console.error("Erro ao mudar senha (toast.promise):", data);
            setError(errorMessage);
            return errorMessage;
          },
        },
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err: any) {
    } finally {
      setIsLoadingPasswordChange(false);
    }
  };

  

  const handleToggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-card">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
        <p className="ml-2 text-teal-600 dark:text-teal-300">Carregando...</p>
      </div>
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
    reset();
  };

  const onSubmitInfoModal = async (data: { nome: string; creci: string }) => {
    try {
      if (!userEmail) {
        toast.error("Email do usuário não encontrado.");
        return;
      }
      await updateUserInfo(userEmail, data.nome, data.creci);
      await fetchUserData();
      toast.success("Informações salvas com sucesso!");
      closeModal();
    } catch (error: any) {
      console.error("Erro ao atualizar informações:", error);

      if (error.response?.data?.detail) {
        toast.error(error.response.data.detail);
      } else if (typeof error.message === "string") {
        toast.error(error.message);
      } else {
        toast.error("Erro desconhecido ao salvar informações.");
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
        <section className="p-4 w-full border-b">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-xl font-semibold text-text ">
              Minhas Informações
            </h2>
            <button className="">
              <FaPencilAlt onClick={openEditInfoModal} className="text-text" />
            </button>
          </div>
          <div className="space-y-2 text-foreground text-sm">
            <p>
              <strong>Email:</strong> {userEmail || "N/A"}
            </p>
            <p>
              <strong>Nome:</strong> {userNome || "Não informado"}
            </p>
            <p>
              <strong>CRECI:</strong> {userCreci || "Não informado"}
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
              className="mt-4 inline-block bg-button hover:bg-primary text-white font-medium py-2 px-4 rounded-md transition duration-300"
            >
              Fazer Upgrade de Plano
            </Link>
          )}
          {userPlanName && userPlanName !== "Free" && (
            <CancelarAssinaturaButton />
          )}
        </section>

        <section className="w-full p-4 border-b">
          <h2 className="text-xl font-semibold text-text mb-4">
            Alterar Senha
          </h2>

          <PasswordChangeForm />
         
        </section>

        {/* Theme Toggle Section (mantido) */}
        <section className="p-4 w-full border-b ">
          <h2 className="text-xl font-semibold text-text mb-2 pb-2">
            Configurações de Tema
          </h2>
          <div className="flex items-center justify-between space-x-4">
            <span className="text-text">Modo Escuro / Claro</span>
            <button
              onClick={handleToggleTheme}
              className="p-2 rounded-md bg-button/25 text-text hover:bg-warning hover:text-card transition-colors flex items-center space-x-2"
            >
              {theme === "light" ? (
                <>
                  <FaMoon /> <span>Modo Escuro</span>
                </>
              ) : (
                <>
                  <FaSun /> <span>Modo Claro</span>
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
