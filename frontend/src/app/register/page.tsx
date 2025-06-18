// frontend/src/app/register/page.tsx
'use client';

import { useForm } from 'react-hook-form'; // Importe useForm do react-hook-form
import { useState } from 'react'; // Mantenha useState para erros de API genéricos
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

// 1. Defina uma interface para os dados do seu formulário
interface RegisterFormData {
  email: string;
  password: string;
}

export default function RegisterPage() {
  // 2. Inicialize o useForm
  // 'register' conecta os inputs ao react-hook-form
  // 'handleSubmit' é a função de envio do formulário que lida com a validação
  // 'formState: { errors, isSubmitting }' para acessar erros de validação e estado de envio
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>();

  // Use um estado separado para erros que vêm da API (não da validação do formulário)
  const [genericError, setGenericError] = useState<string | null>(null);
  // Renomeie 'register' do useAuth para 'authRegister' para evitar conflito de nomes
  const { register: authRegister, isLoading } = useAuth();
  const router = useRouter();

  // 3. Modifique a função de envio
  // 'data' conterá os valores do formulário se a validação do react-hook-form passar
  const onSubmit = async (data: RegisterFormData) => {
    setGenericError(null); // Limpa erros de API anteriores

    try {
      // Use os dados do formulário validados (data.email, data.password)
      await authRegister(data.email, data.password);
      toast.success('Cadastro realizado com sucesso! Redirecionando...');
      // A navegação ocorrerá dentro do AuthContext.
    } catch (err: any) {
      // Captura erros da API (AuthContext)
      setGenericError(err.message || 'Falha no registro. Tente novamente.');
      toast.error(err.message || 'Falha no registro. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-card p-10 border rounded-lg shadow-md">
        <div>
          <h2 className=" text-center text-3xl font-semibold text-text pb-4">
            Crie sua conta
          </h2>
          <p className="text-center text-sm text-text">
            Ou{' '}
            <Link href="/login" className="font-medium text-button hover:text-hover">
              faça login na sua conta existente
            </Link>
          </p>
        </div>
        {/* 4. Use handleSubmit do react-hook-form no onSubmit do formulário */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Exibe erros genéricos da API */}
          {genericError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Erro:</strong>
              <span className="block sm:inline"> {genericError}</span>
            </div>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Endereço de E-mail
              </label>
              <input
                id="email-address"
                type="email"
                autoComplete="email"
                placeholder="Endereço de E-mail"
                // 5. Conecte o input ao react-hook-form com {...register('nomeDoCampo', regrasDeValidacao)}
                {...register('email', {
                  required: 'O e-mail é obrigatório.',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: 'Formato de e-mail inválido.'
                  }
                })}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border bg-background border-border placeholder-text text-text rounded-t-md focus:outline-none focus:ring-border focus:border-border focus:z-10 sm:text-sm"
              />
              {/* 6. Exiba erros de validação específicos do campo */}
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="Senha"
                // Conecte o input da senha e adicione regras de validação
                {...register('password', {
                  required: 'A senha é obrigatória.',
                  minLength: {
                    value: 8, // Exemplo: senha com no mínimo 8 caracteres
                    message: 'A senha deve ter pelo menos 8 caracteres.'
                  }
                })}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border bg-background border-border placeholder-text text-text rounded-t-md focus:outline-none focus:ring-border focus:border-border focus:z-10 sm:text-sm"
              />
              {/* Exiba erros de validação para a senha */}
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              // Use 'isSubmitting' do react-hook-form (indica que o formulário está sendo enviado e validado)
              // ou 'isLoading' do useAuth (indica que a requisição de registro está em andamento)
              disabled={isSubmitting || isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-md font-medium rounded-md text-white bg-primary hover:bg-my-button-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting || isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {isSubmitting || isLoading ? 'Registrando...' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}