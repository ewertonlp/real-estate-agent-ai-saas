import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form'; 
import { zodResolver } from '@hookform/resolvers/zod'; 
import { z } from 'zod'; 
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch'; 
import { Loader2 } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import Tooltip from './tooltip';


export const PropertyDetailsFormSchema = z.object({
  propertyType: z.string().min(1, "Tipo de imóvel é obrigatório."),
  bedrooms: z.string().optional().refine(val => val === '' || !isNaN(Number(val)), { message: "Quartos deve ser um número." }),
  bathrooms: z.string().optional().refine(val => val === '' || !isNaN(Number(val)), { message: "Banheiros deve ser um número." }),
  location: z.string().min(1, "Localização é obrigatória."),
  specialFeatures: z.string().optional(),
  purpose: z.string().min(1, "Finalidade é obrigatória."),
  targetAudience: z.string().optional(),
  tone: z.string().optional(),
  length: z.string().optional(),
  language: z.string().optional(),
  propertyValue: z.string().optional().refine(val => val === '' || !isNaN(Number(val)), { message: "Valor do imóvel deve ser um número." }),
  condoFee: z.string().optional().refine(val => val === '' || !isNaN(Number(val)), { message: "Valor do condomínio deve ser um número." }),
  iptuValue: z.string().optional().refine(val => val === '' || !isNaN(Number(val)), { message: "Valor do IPTU deve ser um número." }),
  optimizeForSeoGmb: z.boolean().default(false).optional(),
  seoKeywords: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email("E-mail de contato inválido.").optional().or(z.literal('')),
  contactWebsite: z.string().url("URL do site inválida.").optional().or(z.literal('')),
  propertyAddress: z.string().optional(),
});

export type PropertyDetailsFormSchema = z.infer<typeof PropertyDetailsFormSchema>; 

interface PropertyDetailsFormProps {
  onSubmit: (formData: PropertyDetailsFormSchema) => void;
  loading: boolean;
  initialData?: Partial<PropertyDetailsFormSchema>; 
}

const PropertyDetailsForm: React.FC<PropertyDetailsFormProps> = ({ onSubmit, loading, initialData }) => {
  const {
    register,
    handleSubmit: hookFormHandleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<PropertyDetailsFormSchema>({
    resolver: zodResolver(PropertyDetailsFormSchema),
    defaultValues: initialData,
  });

  const onSubmitForm = (data: PropertyDetailsFormSchema) => {
   
    console.log("PropertyDetailsForm: Dados coletados pelo react-hook-form:", data); 
    onSubmit(data);
  };

  useEffect(() => {
  if (initialData) {
    reset(initialData); 
  }
}, [initialData, reset]);

  
  const optimizeForSeoGmb = watch("optimizeForSeoGmb");
  const propertyType = watch("propertyType");
  const bedrooms = watch("bedrooms");
  const bathrooms = watch("bathrooms");
  const location = watch("location");
  const specialFeatures = watch("specialFeatures");
  const purpose = watch("purpose");
  const targetAudience = watch("targetAudience");
  const tone = watch("tone");
  const length = watch("length");
  const language = watch("language");
  const propertyValue = watch("propertyValue");
  const condoFee = watch("condoFee");
  const iptuValue = watch("iptuValue");
  const seoKeywords = watch("seoKeywords");
  const contactPhone = watch("contactPhone");
  const contactEmail = watch("contactEmail");
  const contactWebsite = watch("contactWebsite");
  const propertyAddress = watch("propertyAddress");


  
  const buildPrompt = () => {
    const details: string[] = [];
    if (propertyType) details.push(`Tipo de imóvel: ${propertyType}`);
    if (bedrooms) details.push(`Quartos: ${bedrooms}`);
    if (bathrooms) details.push(`Banheiros: ${bathrooms}`);
    if (location) details.push(`Localização: ${location}`);
    if (specialFeatures) details.push(`Características especiais: ${specialFeatures}`);
    if (purpose) details.push(`Finalidade: ${purpose}`);
    if (targetAudience) details.push(`Público-alvo: ${targetAudience}`);
    if (tone) details.push(`Tom: ${tone}`);
    if (length) details.push(`Comprimento: ${length}`);
    if (language) details.push(`Idioma: ${language}`);
    if (propertyValue) details.push(`Valor do imóvel: R$ ${propertyValue}`);
    if (condoFee) details.push(`Valor do condomínio: R$ ${condoFee}`);
    if (iptuValue) details.push(`Valor do IPTU: R$ ${iptuValue}`);

    let prompt = `Gere conteúdo para redes sociais sobre um imóvel. ${details.join(". ")}.`;

    if (optimizeForSeoGmb) {
      const seoDetails: string[] = [];
      if (seoKeywords) seoDetails.push(`Palavras-chave SEO: ${seoKeywords}`);
      if (contactPhone) seoDetails.push(`Telefone de contato: ${contactPhone}`);
      if (contactEmail) seoDetails.push(`Email de contato: ${contactEmail}`);
      if (contactWebsite) seoDetails.push(`Website de contato: ${contactWebsite}`);
      if (propertyAddress) seoDetails.push(`Endereço do imóvel: ${propertyAddress}`);
      if (seoDetails.length > 0) {
        prompt += ` Detalhes SEO/GMB: ${seoDetails.join(". ")}.`;
      }
    }

    prompt += ` Use emojis relevantes. Inclua uma chamada para ação (CTA). Inclua hashtags relevantes. O objetivo é atrair compradores e despertar interesse.`;
    return prompt;
  };


  return (
    <form onSubmit={hookFormHandleSubmit(onSubmitForm)} className="space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="propertyType" className="flex items-center">Tipo de Imóvel
            <Tooltip text="Selecione o tipo de imóvel, como apartamento, casa, terreno, etc." />
          </Label>
          <Select onValueChange={(value) => setValue("propertyType", value)} value={propertyType}>
            <SelectTrigger id="propertyType">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Apartamento">Apartamento</SelectItem>
              <SelectItem value="Casa">Casa</SelectItem>
              <SelectItem value="Terreno">Terreno</SelectItem>
              <SelectItem value="Comercial">Comercial</SelectItem>
            </SelectContent>
          </Select>
          {errors.propertyType && (
            <p className="text-red-500 text-sm">{errors.propertyType.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="bedrooms">Quartos (Opcional)
            <Tooltip text="Informe o número de quartos, incluindo Suíte." />
          </Label>
          <Input id="bedrooms" type="number" {...register("bedrooms")} placeholder="Ex: 3" />
          {errors.bedrooms && (
            <p className="text-red-500 text-sm">{errors.bedrooms.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="bathrooms">Banheiros (Opcional)
            <Tooltip text="Informe o número de banheiros disponíveis." /></Label>
          <Input id="bathrooms" type="number" {...register("bathrooms")} placeholder="Ex: 2" />
          {errors.bathrooms && (
            <p className="text-red-500 text-sm">{errors.bathrooms.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Localização 
            <Tooltip text="Indique o bairro, cidade ou região onde o imóvel está localizado." />
          </Label>
          <Input id="location" {...register("location")} placeholder="Ex: Centro, São Paulo" />
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location.message}</p>
          )}
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="specialFeatures">Características Especiais (Opcional)
            <Tooltip text="Exemplo: piscina, academia, varanda gourmet, vagas de garagem." />
          </Label>
          <Textarea id="specialFeatures" {...register("specialFeatures")} placeholder="Ex: Piscina, academia, varanda gourmet" rows={3} />
          {errors.specialFeatures && (
            <p className="text-red-500 text-sm">{errors.specialFeatures.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="propertyValue">Valor do Imóvel (R$)
            <Tooltip text="Informe o valor do imóvel em reais (opcional)." />
          </Label>
          <Input id="propertyValue" type="number" {...register("propertyValue")} placeholder="Ex: 500000" step="0.01" />
          {errors.propertyValue && (
            <p className="text-red-500 text-sm">{errors.propertyValue.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="condoFee">Condomínio (R$)
            <Tooltip text="Informe o valor do condomínio em reais (opcional)." />
          </Label>
          <Input id="condoFee" type="number" {...register("condoFee")} placeholder="Ex: 300" step="0.01" />
          {errors.condoFee && (
            <p className="text-red-500 text-sm">{errors.condoFee.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="iptuValue">IPTU (R$)
            <Tooltip text="Informe o valor do IPTU em reais (opcional)." />
          </Label>
          <Input id="iptuValue" type="number" {...register("iptuValue")} placeholder="Ex: 100" step="0.01" />
          {errors.iptuValue && (
            <p className="text-red-500 text-sm">{errors.iptuValue.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="purpose">Finalidade 
            <Tooltip text="Selecione se o imóvel é para venda ou aluguel." /></Label>
          <Select onValueChange={(value) => setValue("purpose", value)} value={purpose}>
            <SelectTrigger id="purpose">
              <SelectValue placeholder="Selecione a finalidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Venda">Venda</SelectItem>
              <SelectItem value="Aluguel">Aluguel</SelectItem>
            </SelectContent>
          </Select>
          {errors.purpose && (
            <p className="text-red-500 text-sm">{errors.purpose.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="targetAudience">Público-alvo (Opcional)
             <Tooltip text="Selecione o público alvo do imóvel. Ex: família com filhos, Jovem casal, Investidor." />
          </Label>
          <Input id="targetAudience" {...register("targetAudience")} placeholder="Ex: Famílias jovens, Investidores" />
          {errors.targetAudience && (
            <p className="text-red-500 text-sm">{errors.targetAudience.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="tone">Tom (Opcional)
             <Tooltip text="Escolha o tom do texto gerado (formal, amigável, entusiasmado, luxuoso)." />
          </Label>
          <Select onValueChange={(value) => setValue("tone", value)} value={tone}>
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
          <Label htmlFor="length">Objetivo (Opcional)
            <Tooltip text="Selecione se o conteúdo é para Stories, Post no Feed ou Blog." />
          </Label>
          <Select onValueChange={(value) => setValue("length", value)} value={length}>
            <SelectTrigger id="length">
              <SelectValue placeholder="Selecione o objetivo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Curto">Curto (para stories)</SelectItem>
              <SelectItem value="Medio">Médio (para posts)</SelectItem>
              <SelectItem value="Longo">Longo (para blogs/descrições)</SelectItem>
            </SelectContent>
          </Select>
          {errors.length && (
            <p className="text-red-500 text-sm">{errors.length.message}</p>
          )}
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="language">Idioma</Label>
          <Select onValueChange={(value) => setValue("language", value)} value={language}>
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

      <div className="flex items-center space-x-2 mt-6">
        <Switch
          id="optimizeForSeoGmb"
          checked={optimizeForSeoGmb}
          onCheckedChange={(checked) => setValue("optimizeForSeoGmb", checked)}
        />
        <Label htmlFor="optimizeForSeoGmb">Otimizar para SEO/Google Meu Negócio 
          <Tooltip text="Ative para incluir informações extras para melhorar o SEO e Google Meu Negócio." />
        </Label>
      </div>

      {optimizeForSeoGmb && (
        <div className="space-y-4 border p-4 rounded-md mt-4">
          <h3 className="text-lg font-semibold mb-2">Detalhes de SEO/GMB</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="seoKeywords">Palavras-chave SEO (Opcional)
                 <Tooltip text="Insira palavras-chave essenciais para ser melhor localizado. Ex.: Apartamento 3 Dorms São Paulo." />
              </Label>
              <Input id="seoKeywords" {...register("seoKeywords")} placeholder="Ex: apartamento à venda São Paulo, imóvel 3 quartos" />
              {errors.seoKeywords && (
                <p className="text-red-500 text-sm">{errors.seoKeywords.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Telefone de Contato (Opcional)
                <Tooltip text="Informe o número de Telefone/WhatsApp." />
              </Label>
              <Input id="contactPhone" {...register("contactPhone")} placeholder="Ex: (11) 98765-4321" />
              {errors.contactPhone && (
                <p className="text-red-500 text-sm">{errors.contactPhone.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email de Contato (Opcional)
                <Tooltip text="Informe o email que costuma de comunicar com seus clientes." />
              </Label>
              <Input id="contactEmail" type="email" {...register("contactEmail")} placeholder="Ex: seuemail@dominio.com" />
              {errors.contactEmail && (
                <p className="text-red-500 text-sm">{errors.contactEmail.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactWebsite">Website (Opcional)
                <Tooltip text="Informe o site/blog, caso possua." />
              </Label>
              <Input id="contactWebsite" type="url" {...register("contactWebsite")} placeholder="Ex: https://seusite.com.br" />
              {errors.contactWebsite && (
                <p className="text-red-500 text-sm">{errors.contactWebsite.message}</p>
              )}
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="propertyAddress">Endereço do Imóvel (Opcional)
                <Tooltip text="Informe o endereço do imóvel, caso seja necessário." />
              </Label>
              <Textarea id="propertyAddress" {...register("propertyAddress")} placeholder="Ex: Rua Exemplo, 123, Bairro, Cidade - SP" rows={2} />
              {errors.propertyAddress && (
                <p className="text-red-500 text-sm">{errors.propertyAddress.message}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <Button type="submit" className="w-full py-6 mt-6 uppercase text-md font-semibold text-white" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gerando...
          </>
        ) : (
          "Gerar Conteúdo"
        )}
      </Button>
    </form>
  );
};

export default PropertyDetailsForm;