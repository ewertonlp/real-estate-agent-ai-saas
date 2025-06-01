import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
       colors: {
        'black': '#000000',
        'text': '#e5e5e5',
        'background': '#141414',
        'button': '#2196f3',
        'border': '#2196f3',
        'card': '#282828',
        'card-light': '#34343c',
        'hover': '#007fff',
        
      },
      fontFamily: {
        poppins: ['var(--font-poppins)', 'sans-serif'], // Define 'poppins' como sua classe de fonte
        // Você pode ter outras fontes aqui, por exemplo:
        // sans: ['var(--font-inter)', 'sans-serif'], // Se você estiver usando o Inter também
      },
    },
  },
  plugins: [],
} satisfies Config;
