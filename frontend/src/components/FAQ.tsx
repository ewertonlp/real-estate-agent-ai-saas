import React, { useState, useMemo } from "react";
import { FaPlus, FaMinus, FaSearch, FaQuestionCircle } from "react-icons/fa";

interface FAQItem {
  id: number;
  category: string;
  question: string;
  answer: React.ReactNode;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    category: "Geração de Conteúdo",
    question: "Como gerar conteúdo para imóveis?",
    answer:
      "Preencha o formulário com os detalhes do imóvel e clique em 'Gerar Conteúdo'. Quanto mais detalhes, melhor o resultado.",
  },
  {
    id: 2,
    category: "Geração de Conteúdo",
    question: "Posso usar templates diferentes?",
    answer:
      "Sim, selecione o template desejado antes de preencher os dados do imóvel para obter conteúdos variados e personalizados.",
  },
  {
    id: 3,
    category: "Planos e Limites",
    question: "Qual o limite de gerações no meu plano?",
    answer:
      "O limite depende do seu plano atual. Você pode verificar isso na página do seu dashboard.",
  },
  {
    id: 4,
    category: "Planos e Limites",
    question: "Como faço upgrade do meu plano?",
    answer: (
      <>
        Acesse a página de{" "}
        <a
          href="#plans"
          className="text-blue-600 hover:underline"
          rel="noopener noreferrer"
        >
          planos
        </a>{" "}
        e escolha a opção desejada.
      </>
    ),
  },
  {
    id: 5,
    category: "Histórico",
    question: "Posso salvar os conteúdos gerados?",
    answer:
      "Sim, o sistema salva seu histórico de gerações para que você possa editar e reutilizar depois.",
  },
  {
    id: 6,
    category: "Suporte",
    question: "O que fazer se a geração falhar?",
    answer:
      "Verifique sua conexão e tente novamente. Se o problema persistir, entre em contato com o suporte pelo email suporte@seusite.com.",
  },
];

const categories = Array.from(new Set(faqData.map((item) => item.category)));

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openItemId, setOpenItemId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredFAQs = useMemo(() => {
    return faqData.filter((item) => {
      const matchCategory = activeCategory ? item.category === activeCategory : true;
      const matchSearch =
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (typeof item.answer === "string"
          ? item.answer.toLowerCase().includes(searchTerm.toLowerCase())
          : false);
      return matchCategory && matchSearch;
    });
  }, [searchTerm, activeCategory]);

  const toggleOpen = (id: number) => {
    setOpenItemId(openItemId === id ? null : id);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-card">
      <h1 className="text-3xl font-bold mb-6 flex items-center justify-center gap-3 text-text ">
        <FaQuestionCircle /> Perguntas Frequentes (FAQ)
      </h1>

      {/* Busca */}
      <div className="relative mb-6">
        <input
          type="search"
          placeholder="Buscar perguntas..."
          className="w-full border border-border rounded-md py-3 pl-10 pr-4 text-text bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Buscar perguntas"
        />
        <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
      </div>

      {/* Filtro por categoria */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          className={`px-4 py-2 rounded-md font-semibold transition ${
            activeCategory === null
              ? "bg-primary text-white shadow"
              : "bg-background text-text hover:bg-primary hover:text-white"
          }`}
          onClick={() => setActiveCategory(null)}
        >
          Todas
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-md font-semibold transition ${
              activeCategory === cat
                ? "bg-primary text-white shadow"
                : "bg-background text-text hover:bg-primary hover:text-white"
            }`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredFAQs.length === 0 && (
          <p className="text-center text-gray-500">Nenhuma pergunta encontrada.</p>
        )}

        {filteredFAQs.map(({ id, question, answer }) => (
          <div
            key={id}
            className="border border-border rounded-md overflow-hidden"
            aria-expanded={openItemId === id}
          >
            <button
              onClick={() => toggleOpen(id)}
              className="w-full text-left px-5 py-4 flex justify-between items-center bg-background hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
              aria-controls={`faq-answer-${id}`}
              aria-expanded={openItemId === id}
            >
              <span className="font-medium text-lg">{question}</span>
              <span className="ml-3 text-primary">
                {openItemId === id ? <FaMinus /> : <FaPlus />}
              </span>
            </button>

            <div
              id={`faq-answer-${id}`}
              className={`px-5 text-text bg-card transition-max-height duration-300 ease-in-out overflow-hidden ${
                openItemId === id ? "max-h-96" : "max-h-0"
              }`}
              style={{ transitionProperty: "max-height" }}
            >
              <p className="py-4">{answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
