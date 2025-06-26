"use client";

import { useState } from "react";
import { cancelSubscription } from "@/lib/api";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";

export function CancelarAssinaturaButton() {
  const {
    userPlanName,
    fetchUserData,
    isLoading: authLoading,
  } = useAuth();

  const [loading, setLoading] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const isFreePlan = userPlanName === "Free" || userPlanName === null;

  const handleCancel = async () => {
    const confirm = window.confirm("Tem certeza que deseja cancelar sua assinatura?");
    if (!confirm) return;

    setLoading(true);
    try {
      const result = await cancelSubscription();
      toast.success(result.detail || "Assinatura cancelada com sucesso.");
      await fetchUserData(); // Atualiza dados no contexto
      setCancelled(true);
    } catch (err: any) {
      toast.error(err.message || "Erro ao cancelar assinatura.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <p className="text-sm mb-3">
        <strong>Plano atual:</strong>{" "}
        {cancelled ? "Free (após cancelamento)" : userPlanName || "Carregando..."}
      </p> */}

      {!isFreePlan && !cancelled && (
        <button
          onClick={handleCancel}
          disabled={loading || authLoading}
          className="bg-destructive text-white my-4 px-4 py-2 rounded-md hover:bg-red-700"
        >
          {loading ? "Cancelando..." : "Cancelar assinatura"}
        </button>
      )}

      {cancelled && (
        <p className="text-green-600 text-sm mt-2">
          Assinatura cancelada. Você foi revertido para o plano Free.
        </p>
      )}
    </>
  );
}
