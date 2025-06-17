// frontend/src/components/loader.tsx
import React from 'react';
import { cn } from '@/lib/utils'; // Função utilitária para mesclar classes Tailwind

interface LoaderProps {
  /** Texto para exibir abaixo do spinner (opcional) */
  message?: string;
  /** Classes Tailwind para o container do loader (ex: "h-full flex items-center justify-center") */
  containerClassName?: string;
  /** Classes Tailwind para o SVG do spinner (ex: "h-8 w-8 text-primary") */
  spinnerClassName?: string;
  /** Classes Tailwind para o texto da mensagem (ex: "ml-3 text-text") */
  messageClassName?: string;
}

const Loader: React.FC<LoaderProps> = ({
  message = "Carregando...", // Mensagem padrão
  containerClassName = "min-h-screen flex items-center justify-center bg-background", // Classes padrão para ocupar a tela inteira
  spinnerClassName = "h-12 w-12 text-primary", // Cor do spinner usando a variável primary do seu tema
  messageClassName = "ml-3 text-text" // Cor do texto usando a variável text do seu tema
}) => {
  return (
    <div className={cn(containerClassName)}>
      <svg
        className={cn("animate-spin", spinnerClassName)}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 32 32"
      >
        <circle
          className="opacity-25"
          cx="20"
          cy="20"
          r="10"
          stroke="currentColor"
          strokeWidth="8"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      {message && <p className={cn(messageClassName)}>{message}</p>}
    </div>
  );
};

export default Loader;