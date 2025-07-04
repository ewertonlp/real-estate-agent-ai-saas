"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import PublicHeader from "@/components/publicHeader";
import Image from "next/image";
import { MdEmail } from "react-icons/md";
import Footer from "@/components/footer";
import { FaInstagram } from "react-icons/fa";

const contactSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório."),
  email: z.string().email("Email inválido."),
  message: z.string().min(10, "A mensagem deve ter no mínimo 10 caracteres."),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);

    try {
      // Aqui você pode enviar para uma API, ex: via fetch/axios ou Resend
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Mensagem enviada com sucesso!");
      reset();
    } catch (error) {
      toast.error("Erro ao enviar. Tente novamente mais tarde.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PublicHeader />
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-16 mt-12">
        <h1 className="text-3xl font-medium mb-6 p-2 text-start text-text">
          Fale Conosco!
        </h1>

        <div className="bg-card grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 p-6 rounded-lg shadow-lg">
          <div className="p-6 space-y-2 rounded-md border">
            <h2 className="font-normal text-2xl capitalize">
              Vamos conversar!
            </h2>
            <p>Envie sua mensagem através do formulário abaixo.</p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" {...register("name")} placeholder="Seu nome" />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="seu@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Mensagem</Label>
                <Textarea
                  id="message"
                  rows={5}
                  {...register("message")}
                  placeholder="Como podemos te ajudar?"
                />
                {errors.message && (
                  <p className="text-red-500 text-sm">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <p className="text-sm">
                Ao enviar sua mensagem você concorda com a nossa{" "}
                <a
                  href="/frontend/src/app/privacidade"
                  className="text-primary"
                >
                  Política de Privacidade
                </a>
                .
              </p>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Enviando...
                  </>
                ) : (
                  "Enviar mensagem"
                )}
              </Button>
            </form>
          </div>
          <div className="cover rounded-tr-md">
            <Image
              src="/mulher-celular.jpg"
              alt="Imagem de um corretor de imóveis olhando para o telefone"
              width={600}
              height={100}
              className="rounded-sm"
            />
            <div className="flex items-center gap-2 mt-10">
              <MdEmail size={30} className="border p-1  rounded" />
              <a href="mailto:info@aurasyncai.com">info@aurasyncai.com</a>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <FaInstagram size={30} className="border p-1  rounded" />
              <a href="https://instagram.com/ai.aurasync" target="/blank">
                aurasyncai
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
