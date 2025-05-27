// frontend/src/context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, registerUser } from '../lib/api'; // Vamos criar estas funções no api.ts
import { AxiosError } from 'axios'; // Se usar Axios, ou 'Response' se usar Fetch padrão
import Cookies from 'js-cookie';

// Definir as interfaces de tipos para o contexto
interface AuthContextType {
  userToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Criar o Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provedor do Contexto de Autenticação
export function AuthProvider({ children }: { children: ReactNode }) {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Começa como true para verificar token ao carregar
  const router = useRouter();

  // Efeito para carregar o token do localStorage ao montar o componente
  useEffect(() => {
    const token =  Cookies.get('access_token'); 
    if (token) {
      setUserToken(token);
    }
    setIsLoading(false); // Token verificado, carregamento concluído
  }, []);

  // Função de Login
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await loginUser(email, password); // Chama a função de login do backend
      Cookies.set('access_token', data.access_token, { expires: 1, secure: process.env.NODE_ENV === 'production' });
      setUserToken(data.access_token);
      router.push('/dashboard'); // Redireciona para a página principal após o login
    } catch (error) {
      console.error('Erro no login:', error);
      // Aqui você pode adicionar lógica para mostrar mensagens de erro ao usuário
      if (error instanceof AxiosError && error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      } else {
        throw new Error('Falha no login. Verifique suas credenciais.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Função de Registro
  const register = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await registerUser(email, password); // Chama a função de registro do backend
      // Após o registro, pode-se logar automaticamente ou redirecionar para a página de login
      await login(email, password); 
    } catch (error) {
      console.error('Erro no registro:', error);
      if (error instanceof AxiosError && error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      } else {
        throw new Error('Falha no registro. O e-mail pode já estar em uso.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Função de Logout
 const logout = () => {
    Cookies.remove('access_token'); // <--- MUDANÇA AQUI: Remove do cookie
    setUserToken(null);
    router.push('/login');
  };

  const isAuthenticated = !!userToken;

  return (
    <AuthContext.Provider value={{ userToken, isLoading, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook customizado para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};