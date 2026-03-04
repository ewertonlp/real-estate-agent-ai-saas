"use client"

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Tooltip from "./tooltip";

export const ArticleFormSchema = z.object({
  prompt: z.string().min(1, "Detalhe o seu prompt de comando."),
  purpose: z.string().min(1, "Finalidade é obrigatória."),
  targetAudience: z.string().optional(),
  tone: z.string().optional(),
  length: z.string().optional(),
  language: z.string().optional(),
});

export type ArticleFormSchema = z.infer<typeof ArticleFormSchema>;

interface ArticleFormSchemaProps {
  onSubmit: (formData: ArticleFormSchema) => void;
  loading: boolean;
  initialData?: Partial<ArticleFormSchema>;
}

const ArticleForm: React.FC<ArticleFormSchemaProps> = ({
  onSubmit,
  loading,
  initialData,
}) => {
  const {
    register,
    handleSubmit: hookFormHandleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<ArticleFormSchema>({
    resolver: zodResolver(ArticleFormSchema),
    defaultValues: initialData,
  });

  const onSubmitForm = (data: ArticleFormSchema) => {
    console.log(
      "PropertyDetailsForm: Dados coletados pelo react-hook-form:",
      data,
    );
    onSubmit(data);
  };

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const promptDetail = watch("prompt");
  const purpose = watch("purpose");
  const targetAudience = watch("targetAudience");
  const tone = watch("tone");
  const length = watch("length");
  const language = watch("language");

  const buildPrompt = () => {
    const details: string[] = [];
    if (promptDetail) details.push(`Prompt: ${promptDetail}`);
    if (purpose) details.push(`Finalidade: ${purpose}`);
    if (targetAudience) details.push(`Público-alvo: ${targetAudience}`);
    if (tone) details.push(`Tom: ${tone}`);
    if (length) details.push(`Comprimento: ${length}`);
    if (language) details.push(`Idioma: ${language}`);

    let prompt = `Gere conteúdo para redes sociais/artigos para blogs ou email para o perfil de corretores de imóveis/imobiliárias. ${details.join(". ")}.`;

    prompt += ` Use emojis relevantes. Inclua uma chamada para ação (CTA). Inclua hashtags relevantes. O objetivo é atrair compradores e despertar interesse.`;
    return prompt;
  };

  return (
    <form onSubmit={hookFormHandleSubmit(onSubmitForm)}>
      <div className="space-y-2 max-w-2xl mb-4 p-4 bg-background">
        <Label htmlFor="prompt">
          Prompt de comando
          <Tooltip text="Insira o máximo de informações possíves para gerar o conteudo que deseja." />
        </Label>
        <Textarea
          id="prompt"
          {...register("prompt")}
          placeholder="Insira o prompt de comando."
          rows={3}
        />
        {errors.prompt && (
          <p className="text-red-500 text-sm">{errors.prompt.message}</p>
        )}
    

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="purpose">
            Finalidade
            <Tooltip text="Selecione para qual plataforma deseja criar." />
          </Label>
          <Select
            onValueChange={(value) => setValue("purpose", value)}
            value={purpose}
          >
            <SelectTrigger id="purpose">
              <SelectValue placeholder="Selecione a finalidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="redesSociais">Redes sociais</SelectItem>
              <SelectItem value="blogs">Artigos para blogs</SelectItem>
              <SelectItem value="email">Conteudo para email</SelectItem>
            </SelectContent>
          </Select>
          {errors.purpose && (
            <p className="text-red-500 text-sm">{errors.purpose.message}</p>
          )}
        </div>
        {/* <div className="space-y-2">
          <Label htmlFor="targetAudience">
            Público-alvo 
            <Tooltip text="Selecione o público alvo do imóvel. Ex: família com filhos, Jovem casal, Investidor." />
          </Label>
          <Input
            id="targetAudience"
            {...register("targetAudience")}
            placeholder="Ex: Famílias jovens, Investidores"
          />
          {errors.targetAudience && (
            <p className="text-red-500 text-sm bg-red-100 p-1">
              {errors.targetAudience.message}
            </p>
          )}
        </div> */}
        <div className="space-y-2">
          <Label htmlFor="tone">
            Tom
            <Tooltip text="Escolha o tom do texto gerado (formal, amigável, entusiasmado, luxuoso)." />
          </Label>
          <Select
            onValueChange={(value) => setValue("tone", value)}
            value={tone}
          >
            <SelectTrigger id="tone">
              <SelectValue placeholder="Selecione o tom" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Formal">Formal</SelectItem>
              <SelectItem value="Amigavel">Amigável</SelectItem>
              <SelectItem value="Entusiasmado">Entusiasmado</SelectItem>
              <SelectItem value="Luxuoso">Luxuoso</SelectItem>
            </SelectContent>
          </Select>
          {errors.tone && (
            <p className="text-red-500 text-sm">{errors.tone.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="length">
            Objetivo
            <Tooltip text="Selecione se o conteúdo é para Stories, Post no Feed ou Blog." />
          </Label>
          <Select
            onValueChange={(value) => setValue("length", value)}
            value={length}
          >
            <SelectTrigger id="length">
              <SelectValue placeholder="Selecione o objetivo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Curto">Curto (para stories)</SelectItem>
              <SelectItem value="Medio">Médio (para posts)</SelectItem>
              <SelectItem value="Longo">
                Longo (para blogs/descrições)
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.length && (
            <p className="text-red-500 text-sm">{errors.length.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="language">Idioma</Label>
          <Select
            onValueChange={(value) => setValue("language", value)}
            value={language}
          >
            <SelectTrigger id="language">
              <SelectValue placeholder="Selecione o idioma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Português">Português</SelectItem>
              <SelectItem value="Inglês">Inglês</SelectItem>
              <SelectItem value="Espanhol">Espanhol</SelectItem>
            </SelectContent>
          </Select>
          {errors.language && (
            <p className="text-red-500 text-sm">{errors.language.message}</p>
          )}
        </div>
      </div>
        </div>
      <div className="text-center">
        <Button
          type="submit"
          className="w-full md:w-1/2 py-6 mt-6 uppercase text-md font-semibold "
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gerando...
            </>
          ) : (
            "Gerar Conteúdo"
          )}
        </Button>
      </div>
    </form>
  );
};

export default ArticleForm;
