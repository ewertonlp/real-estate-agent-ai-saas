"use client";

import { useState } from "react";

interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[]
}

export default function Tabs({ tabs }: TabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Cabeçalho das abas */}
      <div className="flex ">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2  text-md font-medium border-b-2 transition-colors duration-200
              ${
                activeTab === index
                  ? "border-primary text-primary"
                  : "border-transparent text-foreground hover:text-primary"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conteúdo da aba ativa */}
      <div className="mt-6">
        {tabs[activeTab].content}
      </div>
    </div>
  );
}
