// frontend/src/context/ThemeContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// CORREÇÃO AQUI: { children }: { children: ReactNode }
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light'); // Padrão para light

  useEffect(() => {
    // Obter tema do armazenamento local ou padrão para 'light'
    const storedTheme = localStorage.getItem('theme') as Theme || 'light';
    setTheme(storedTheme);

    // Certificar-se de que a classe do tema oposto é removida
    // e que a classe do tema correto é adicionada.
    if (typeof window !== 'undefined') {
      if (storedTheme === 'dark') {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
    }
  }, []); // Executar apenas uma vez na montagem

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);

      // Atualizar classe no elemento <html>
      if (typeof window !== 'undefined') {
        document.documentElement.classList.remove(prevTheme);
        document.documentElement.classList.add(newTheme);
      }
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};