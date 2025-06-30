"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { cancelSubscription } from "@/lib/api"; // Certifique-se de ter essa função
import { FaTimes } from "react-icons/fa";

export function CancelarAssinaturaButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      await cancelSubscription();
      toast.success("Assinatura cancelada com sucesso! Você ainda terá acesso até o final do período atual.");
      closeModal();
    } catch (err) {
      console.error("Erro ao cancelar assinatura:", err);
      toast.error("Não foi possível cancelar a assinatura.");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <>
      <button
        onClick={openModal}
        className="mt-4 text-red-600 hover:text-red-700 underline font-medium"
      >
        Cancelar Assinatura
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div
            className="bg-card p-6 rounded-lg shadow-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-text">Cancelar Assinatura</h3>
              <button
                onClick={closeModal}
                className="text-text hover:text-red-500"
              >
                <FaTimes />
              </button>
            </div>

            <p className="text-text mb-4">
              Tem certeza que deseja cancelar sua assinatura?
              <br />
              <span className="font-medium">Você ainda poderá usar o plano atual até o fim do período já pago.</span>
            </p>

            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-background text-text rounded hover:bg-my-card-light transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={handleCancel}
                disabled={isCancelling}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {isCancelling ? "Cancelando..." : "Confirmar Cancelamento"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
