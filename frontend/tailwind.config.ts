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
        background: "var(--background)",
        foreground: "var(--foreground)",
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
