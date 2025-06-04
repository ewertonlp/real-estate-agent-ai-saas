"use client";
import PublicHeader from "@/components/publicHeader";
import Image from "next/image";

export default function aboutUs() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center overflow-hidden">
      <PublicHeader />
      <div className="max-w-7xl w-full my-20 py-16 px-10 text-start bg-card rounded-lg flex-1 md:flex justify-between gap-8">
        <div className="w-1/2">
        <h1 className="text-4xl font-semibold text-text mb-6">
          Sobre a AuraSync
        </h1>
          <p className="mt4">
            No dinâmico mercado imobiliário de hoje, sabemos que tempo é
            dinheiro e conteúdo de qualidade é a chave para se destacar.
          </p>
          <p className="mt4">
            Acreditamos que a tecnologia deve servir para simplificar e agilizar
            o dia a dia.{" "}
          </p>
          <p className="mt4">
            Estamos sempre buscando as últimas tecnologias de IA para oferecer o
            melhor em geração de conteúdo.
          </p>
          <p className="mt4">
            Nosso maior objetivo é ver nossos usuários vendendo mais e
            alcançando seus objetivos profissionais.
          </p>
          <p className="mt-4">
            Foi com essa premissa que o AuraSync AI nasceu: uma ferramenta
            inovadora para empoderar corretores de imóveis, otimizando a criação
            de conteúdo e impulsionando suas vendas.{" "}
          </p>
          <p className="mt-4">
            {" "}
            <strong>Nossa Missão é</strong> democratizar o acesso a tecnologias
            de inteligência artificial para corretores de imóveis, transformando
            a maneira como eles se comunicam, promovem seus imóveis e se
            conectam com seus clientes. Queremos que cada corretor, do autônomo
            à grande imobiliária, tenha em mãos a capacidade de gerar textos
            persuasivos e otimizados em segundos.
          </p>
          <p className="mt-4">
            {" "}
            <strong>Nossa Visão é</strong> ser a plataforma líder em geração de
            conteúdo para o setor imobiliário, reconhecida por sua eficiência,
            inovação e pelo impacto positivo nas carreiras de milhares de
            corretores em todo o Brasil.
          </p>
          <p className="mt-4">
            {" "}
            <strong>Como começamos? </strong>Percebemos a lacuna no mercado:
            corretores gastavam horas escrevendo descrições, pensando em
            legendas criativas e otimizando textos para SEO e redes sociais.
            Esse tempo poderia ser melhor investido em atendimento ao cliente e
            fechamento de negócios. Com a ascensão da IA generativa, vimos a
            oportunidade de criar uma solução que resolvesse esse problema de
            forma escalável e acessível. Assim, o AuraSync AI foi desenvolvido,
            unindo a expertise do mercado imobiliário com o poder da
            inteligência artificial.
          </p>
          <div className="mt-4">
            <p className="mt-4">
              <strong>O Que Nos Move:</strong>
            </p>
            <ul className="mt-4 ml-4 list-disc list-inside">
              <li>
                <strong>Inovação: </strong>Estamos sempre buscando as últimas
                tecnologias de IA para oferecer o melhor em geração de conteúdo.
              </li>
              <li>
                <strong>Eficiência: </strong> Acreditamos que a tecnologia deve
                servir para simplificar e agilizar o dia a dia.
              </li>
              <li>
                <strong>Sucesso do Cliente:</strong> Nosso maior objetivo é ver
                nossos usuários vendendo mais e alcançando seus objetivos
                profissionais.
              </li>
              <li>
                <strong>Transparência: </strong> Prezamos pela clareza em nossos
                serviços, termos e política de privacidade.
              </li>
            </ul>
          </div>
          <p className="mt-4">Prezamos pela clareza em nossos serviços, termos e
            política de privacidade. 
            Junte-se à Revolução do Conteúdo
            Imobiliário: Convidamos você a experimentar o poder do AuraSync AI e
            ver como a inteligência artificial pode transformar a sua forma de
            trabalhar e impulsionar suas vendas.</p>

            <h3 className="mt-4 font-medium text-lg">Equipe AuraSync</h3>
        </div>
        <div className="relative -mt-12 -mr-16 ">
          <Image src="/aurasync.jpg" alt="About Us Image" width={600} height={100} className=" relative rounded-lg -mt-12 -mr-16 shadow-lg" />
        </div>
      </div>
    </div>
  );
}
