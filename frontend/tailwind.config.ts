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
        'text': '#343435',
        'background': '##e5e5e5',
        'button': '#2196f3',
        'border': '#2196f3',
        'card': 'oklch(87.1% 0.006 286.286)',
        'card-light': 'oklch(92.9% 0.013 255.508)',
        'hover': '#007fff',
        
      },
      fontFamily: {
        poppins: ['var(--font-poppins)', 'sans-serif'], // Define 'poppins' como sua classe de fonte
        // Você pode ter outras fontes aqui, por exemplo:
        // sans: ['var(--font-inter)', 'sans-serif'], // Se você estiver usando o Inter também
      },
       keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
        slideUp: 'slideUp 0.5s ease-out',
      },
    },
  },
  plugins: [],
} satisfies Config;
