"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useAuth(); 


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); 

    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      // toast.error("Por favor, preencha todos os campos.");
      return;
    }

    try {
      await login(email, password);
      toast.success("Login sucesso")
    } catch (err: any) {
      setError(err.message || "Falha no login. Email ou senha incorretos.");
    }
  };

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-card border border-border p-5 rounded-sm shadow-md">
        <div className="text-center">
          <h2 className="mt-4 text-3xl font-medium text-foreground pb-2">
           Bom te ver por aqui
          </h2>
          <p className="text-sm text-foreground/75">Faça login para acessar o dashboard</p>
         
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-destructive px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">Erro:</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email-address" className="sr-only">
                E-mail
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-sm relative block w-full px-3 py-2 border bg-background border-border placeholder-text text-text rounded-t-md focus:z-10 sm:text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-border  focus:ring-offset-2"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-sm relative block w-full px-3 py-2 border bg-background border-border placeholder-text text-text rounded-t-md focus:z-10 sm:text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-border  focus:ring-offset-2"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="text-right">
            <Link href="/forgotPassword"><span className="text-sm text-primary font-light hover:text-white transition-all">Esqueceu a senha?</span></Link>
          </div>

          <div>
            <Button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="w-full disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
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
              ) : null}
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </div>
          <div className="pt-4">
             <p className="mt-2 text-center text-sm text-foreground font-light">
            Novo por aqui?{" "}
            <Link
              href="/register"
              className="pl-1 text-primary hover:text-primary/75 transition"
            >
              Crie uma Conta
            </Link>
          </p>
          </div>
        </form>
      </div>
    </div>
  );
}
