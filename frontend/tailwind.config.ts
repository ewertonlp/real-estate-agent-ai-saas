import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // Enable dark mode based on 'dark' class in html tag
  theme: {
    extend: {
      colors: {
        black: "#000000",
        text: "var(--text-color)", // Use CSS variable
        background: "var(--background-color)", // Use CSS variable
        button: "#2196f3",
        border: "#2196f3",
        card: "var(--card-color)", // Use CSS variable
        "card-light": "var(--card-light-color)", // Use CSS variable
        hover: "#007fff",
      },
      fontFamily: {
        poppins: ["var(--font-poppins)", "sans-serif"],
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-out",
        slideUp: "slideUp 0.5s ease-out",
      },
    },
  },
  plugins: [],
} satisfies Config;
