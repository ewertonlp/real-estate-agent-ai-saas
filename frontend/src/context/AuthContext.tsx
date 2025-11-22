"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { loginUser, registerUser } from "../lib/api";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";


interface AuthContextType {
  userToken: string | null;
  userEmail: string | null;
  userNome: string | null; 
  userCreci: string | null; 
  userPlanName: string | null;
  userGenerationsCount: number | null;
  userMaxGenerations: number | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  fetchUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userNome, setUserNome] = useState<string | null>(null);
  const [userCreci, setUserCreci] = useState<string | null>(null);
  const [userPlanName, setUserPlanName] = useState<string | null>(null);
  const [userGenerationsCount, setUserGenerationsCount] = useState<
    number | null
  >(null);
  const [userMaxGenerations, setUserMaxGenerations] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Função auxiliar para decodificar o token e extrair o e-mail
  // const decodeTokenAndSetUserEmail = (token: string) => {
  //   try {
  //     const decoded: { sub: string } = jwtDecode(token);
  //     setUserEmail(decoded.sub); // O 'sub' (subject) do JWT é tipicamente o e-mail
  //   } catch (error) {
  //     console.error("Erro ao decodificar token JWT:", error);
  //     setUserEmail(null);
  //     // Opcional: Se o token for inválido, você pode forçar o logout aqui
  //     // logout();
  //   }
  // };

 
  const fetchUserData = useCallback(async () => {
    const token = Cookies.get("access_token");
    if (token) {
      try {
        const { getCurrentUser } = await import("../lib/api"); 
        const userData = await getCurrentUser();
        setUserEmail(userData.email);
        setUserNome(userData.nome || null);
        setUserCreci(userData.creci || null);
        setUserPlanName(userData.subscription_plan?.name || "Não Atribuído");
        setUserGenerationsCount(userData.content_generations_count);
        setUserMaxGenerations(
          userData.subscription_plan?.max_generations || null
        );
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
        
        if (
          (error as any).message ===
          "Sessão expirada. Por favor, faça login novamente."
        ) {
          logout(); 
          toast.error("Sessão expirada. Por favor, faça login novamente.");
        }
        setUserEmail(null);
        setUserPlanName(null);
        setUserGenerationsCount(null);
        setUserMaxGenerations(null);
        toast.error("Falha ao carregar dados do usuário.");
      }
    }
  }, []);

  
  useEffect(() => {
    const token = Cookies.get("access_token");
    if (token) {
      setUserToken(token);
      fetchUserData(); 
    }
    setIsLoading(false);
  }, [fetchUserData]);


  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await loginUser(email, password);
      Cookies.set("access_token", data.access_token, {
        expires: 1,
        secure: process.env.NODE_ENV === "production",
      });
      setUserToken(data.access_token);
      
      await fetchUserData(); 
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro no login:", error);
      if (error instanceof AxiosError && error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      } else {
        throw new Error("Falha no login. Verifique suas credenciais.");
      }
    } finally {
      setIsLoading(false);
    }
  };

 
  const register = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await registerUser(email, password); 
      await login(email, password);
    } catch (error) {
      console.error("Erro no registro:", error);
      if (error instanceof AxiosError && error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      } else {
        throw new Error("Falha no registro. O e-mail pode já estar em uso.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Função de Logout
  const logout = () => {
    Cookies.remove("access_token");
    setUserToken(null);
    setUserEmail(null);
    setUserNome(null);
    setUserCreci(null);
    setUserPlanName(null);
    setUserGenerationsCount(null);
    setUserMaxGenerations(null);
    router.push("/login");
  };

  const isAuthenticated = !!userToken;

  return (
    <AuthContext.Provider
      value={{
        userToken,
        userEmail,
        userNome,
        userCreci,
        userPlanName,
        userGenerationsCount,
        userMaxGenerations,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated,
        fetchUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
