
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AnalyticsPage() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isAuthLoading, router]);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-text">Carregando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; 
  }

  return (
    <main className="bg-card p-8 rounded-lg shadow-md w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-medium text-text text-center mb-6">
        Dados disponível no momento. 🚧
      </h1>

      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-8 rounded-md shadow-sm text-center">
        <p>
          🚧 Em breve esta página terá análises mais detalhadas e gráficos sobre o uso da plataforma!
        </p>
      </div>
    </main>
  );
}