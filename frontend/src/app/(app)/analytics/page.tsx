// frontend/src/app/(app)/analytics/page.tsx
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
    return null; // O redirecionamento já acontece no useEffect
  }

  return (
    <main className="bg-card p-8 rounded-lg shadow-md w-full max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-medium text-text text-center mb-6">
        Seus Dados de Analytics
      </h1>

      <div className="mt-8 text-center text-text text-md">
        <p>
          Em breve, esta página terá análises mais detalhadas e gráficos sobre o uso da plataforma!
        </p>
      </div>
    </main>
  );
}