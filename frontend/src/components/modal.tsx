// frontend/src/components/modal.tsx
"use client";

import React from "react";
import { FaWindowClose } from "react-icons/fa";
import { cn } from "@/lib/utils"; // Importa a função cn para mesclar classes

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode; // Permite passar JSX como conteúdo
  className?: string; // Para classes extras na caixa principal do modal
  overlayClassName?: string; // Para classes extras no fundo transparente
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, content, className, overlayClassName }) => {
  if (!isOpen) return null;

  return (
    <div className={cn("fixed inset-0 z-50 flex items-center justify-center bg-overlay-bg p-4", overlayClassName)}>
      <div className={cn("bg-card p-6 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative", className)}>
        <h2 className="text-2xl font-bold mb-4 text-text">{title}</h2>
        <div className="text-text mb-6 whitespace-pre-wrap max-h-96 overflow-y-auto font-poppins">
          {content}
        </div>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 hover:bg-card hover:text-foreground rounded-full p-2 text-text"
        >
          <FaWindowClose />
        </button>
      </div>
    </div>
  );
};

export default Modal;