"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner"; 
import { useState } from "react";
import { Input } from "../ui/input";
import { changeUserPassword} from "@/lib/api";
import PasswordChangeFormData, { passwordChangeSchema } from "@/schemas/changePasswordSchema";
import { Button } from "../ui/button";

export default function PasswordChangeForm() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (data: PasswordChangeFormData) => {
    setIsLoading(true);

    try {
      await toast.promise(
        changeUserPassword(data.currentPassword, data.newPassword),
        {
          loading: "Alterando senha...",
          success: "Senha alterada com sucesso! 🎉",
          error: (err: any) => {
              const errorMessage = err?.message || "Ocorreu um erro ao alterar a senha.";
              console.error("Erro ao mudar senha:", data);
              return errorMessage;
            },
        }
      );

      reset();
    } catch (err) {
      console.error("Erro capturado:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">
          Senha Atual
        </label>
        <Input
          id="currentPassword"
          type="password"
          placeholder="Digite sua senha atual"
          disabled={isLoading}
          {...register("currentPassword")}
          className="border rounded-sm w-full md:w-1/2 py-3 px-4 bg-input border-border text-foreground leading-tight focus:outline-none focus:ring-2 focus:ring-border focus:border-transparent"
        />
        {errors.currentPassword && (
          <p className="text-red-500 text-sm bg-red-100 p-1 mt-1">
            {errors.currentPassword.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
          Nova Senha
        </label>
        <Input
          id="newPassword"
          type="password"
          placeholder="Digite sua nova senha"
          disabled={isLoading}
          {...register("newPassword")}
          className="border rounded-sm w-full md:w-1/2 py-3 px-4 bg-input border-border text-text leading-tight focus:outline-none focus:ring-2 focus:ring-border focus:border-transparent"
        />
        {errors.newPassword && (
          <p className="text-red-500 text-sm bg-red-100 p-1 mt-1">
            {errors.newPassword.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="confirmNewPassword" className="block text-text text-sm font-medium mb-1">
          Confirmar Nova Senha
        </label>
        <Input
          id="confirmNewPassword"
          type="password"
          placeholder="Confirme sua nova senha"
          disabled={isLoading}
          {...register("confirmNewPassword")}
          className="border rounded-sm w-full md:w-1/2 py-3 px-4 mb-4 bg-input border-border text-foreground leading-tight focus:outline-none focus:ring-2 focus:ring-border focus:border-transparent"
        />
        {errors.confirmNewPassword && (
          <p className="text-red-500 text-sm bg-red-100 p-1 mt-1">
            {errors.confirmNewPassword.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className=" w-full md:w-1/2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Alterando..." : "Alterar Senha"}
      </Button>
    </form>
  );
}