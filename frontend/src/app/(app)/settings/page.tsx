// frontend/src/app/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

import toast from 'react-hot-toast'; // Para notificações toast
import { changeUserPassword } from '@/lib/api'; // Vamos criar esta função no api.ts

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoadingPasswordChange, setIsLoadingPasswordChange] = useState(false);

  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  // Efeito para verificar autenticação
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push('/login'); // Redireciona se não estiver autenticado
    }
  }, [isAuthenticated, isAuthLoading, router]);

  const handleSubmitPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoadingPasswordChange(true);

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError('Por favor, preencha todos os campos.');
      setIsLoadingPasswordChange(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('A nova senha e a confirmação não correspondem.');
      setIsLoadingPasswordChange(false);
      return;
    }

    if (newPassword.length < 8) { // Exemplo de validação de senha
      setError('A nova senha deve ter pelo menos 8 caracteres.');
      setIsLoadingPasswordChange(false);
      return;
    }

    try {
      await changeUserPassword(currentPassword, newPassword);
      toast.success('Senha alterada com sucesso!');
      // Limpa os campos após o sucesso
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      console.error('Erro ao mudar senha:', err);
      if (err.message === 'Sessão expirada. Por favor, faça login novamente.') {
        router.push('/login');
        toast.error('Sessão expirada. Por favor, faça login novamente.');
      } else {
        toast.error(err.message || 'Ocorreu um erro ao alterar a senha.');
      }
      setError(err.message || 'Falha ao alterar a senha.');
    } finally {
      setIsLoadingPasswordChange(false);
    }
  };

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
    <div className="flex flex-col items-center justify-center py-10">
      <main className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Configurações da Conta
          </h1>
         
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
            <strong className="font-bold">Erro:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Alterar Senha</h2>
          <form onSubmit={handleSubmitPasswordChange} className="space-y-4">
            <div>
              <label htmlFor="current-password" className="block text-gray-700 text-sm font-bold mb-2">
                Senha Atual:
              </label>
              <input
                id="current-password"
                name="current_password"
                type="password"
                autoComplete="current-password"
                required
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="new-password" className="block text-gray-700 text-sm font-bold mb-2">
                Nova Senha:
              </label>
              <input
                id="new-password"
                name="new_password"
                type="password"
                autoComplete="new-password"
                required
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirm-new-password" className="block text-gray-700 text-sm font-bold mb-2">
                Confirmar Nova Senha:
              </label>
              <input
                id="confirm-new-password"
                name="confirm_new_password"
                type="password"
                autoComplete="new-password"
                required
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoadingPasswordChange}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoadingPasswordChange ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Alterando...
                  </>
                ) : (
                  'Alterar Senha'
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Futuras seções de configuração de perfil, preferências, etc. */}
        {/*
        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">Informações do Perfil</h2>
          <p className="text-gray-700">Seu email: {emailDoUsuario}</p>
          <button className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Atualizar Perfil
          </button>
        </section>
        */}
      </main>
    </div>
  );
}