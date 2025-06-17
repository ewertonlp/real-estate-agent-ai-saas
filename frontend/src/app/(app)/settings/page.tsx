// frontend/src/app/(app)/settings/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { changeUserPassword, getUserAnalytics } from "@/lib/api"; // Importe getUserAnalytics
import { useTheme } from "next-themes";
import { FaMoon, FaSun } from "react-icons/fa";
import Loader from "@/components/loader";

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoadingPasswordChange, setIsLoadingPasswordChange] = useState(false);
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
          pending: 'Alterando senha...', // Mensagem exibida enquanto a promessa está pendente
          success: 'Senha alterada com sucesso! 🎉', // Mensagem de sucesso quando a promessa é resolvida
          error: {
            render({ data }: any) {
              // 'data' contém o erro lançado pela promessa (catch)
              const errorMessage = data?.message || "Ocorreu um erro ao alterar a senha.";
              console.error("Erro ao mudar senha (toast.promise):", data); // Log detalhado para depuração
              setError(errorMessage); // Opcional: atualiza o estado de erro, se quiser exibir também abaixo do formulário
              return errorMessage; // Mensagem de erro que será exibida no toast
            }
          }
        }
      );
      // Limpa os campos após sucesso
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      // setError(null); // Opcional: Limpar erro se houve sucesso, o toast já indica
    } catch (err: any) {
      // O toast.promise já lida com a exibição do erro, então o 'catch' aqui
      // é mais para logs adicionais ou lógica que não seja feedback direto ao usuário.
      // O estado 'error' já é atualizado dentro do render do toast.promise.
    } finally {
      setIsLoadingPasswordChange(false); // Garante que o estado de carregamento do botão seja resetado
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

  return (
    <main className="bg-card p-8 rounded-lg shadow-md w-full max-w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium text-text">
          Configurações da Conta
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

      <div className="grid grid-cols-1 md-grid-cols-2 lg:grid-cols-3 items-start gap-6 ">
        {/* Informações do Plano Section - ATUALIZADO */}
        <section className="p-4 w-full bg-background border border-border rounded-md">
          <h2 className="text-xl font-semibold text-text mb-4 border-b pb-2">
            Informações do Plano
          </h2>
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
        </section>

        {/* Alterar Senha Section (mantido) */}
        <section className="w-full border bg-background border-border p-4 rounded-md ">
          <h2 className="text-xl font-semibold text-text mb-4 border-b pb-2">
            Alterar Senha
          </h2>
          <form onSubmit={handleSubmitPasswordChange} className="space-y-4">
            <div>
              <label
                htmlFor="current-password"
                className="block text-text text-sm font-medium mb-2"
              >
                Senha Atual:
              </label>
              <input
                id="current-password"
                name="current_password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none border rounded-md w-full py-3 px-4 bg-card border-button text-text leading-tight focus:outline-none focus:ring-2 focus:ring-border focus:border-transparent"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="new-password"
                className="block text-text text-sm font-medium mb-2"
              >
                Nova Senha:
              </label>
              <input
                id="new-password"
                name="new_password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none border rounded-md w-full py-3 px-4 bg-card border-button text-text leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="confirm-new-password"
                className="block text-text text-sm font-medium mb-2"
              >
                Confirmar Nova Senha:
              </label>
              <input
                id="confirm-new-password"
                name="confirm_new_password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none border rounded-md w-full py-3 px-4 bg-card border-button text-text leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </div>
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoadingPasswordChange}
                className="bg-button hover:bg-hover text-text font-semibold font-md py-3 px-4 rounded-md focus:outline-none focus:shadow-outline w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all
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
        <section className="p-4 w-full bg-background border border-border rounded-md">
          <h2 className="text-xl font-semibold text-text mb-4 border-b pb-2">
            Configurações de Tema
          </h2>
          <div className="flex items-center justify-between space-x-4">
            <span className="text-text">Modo Escuro / Claro</span>
            <button
              onClick={handleToggleTheme}
              className="p-2 rounded-md bg-button text-text hover:bg-hover transition-colors flex items-center space-x-2"
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
    </main>
  );
}
