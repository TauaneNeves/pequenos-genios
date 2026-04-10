import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          bg: "#F4F7F5",       // Fundo gelo bem claro e limpo
          dark: "#0D1321",     // Azul noite quase preto para textos e bordas
          cyan: "#00E5FF",     // Ciano elétrico
          pink: "#FF499E",     // Rosa choque
          yellow: "#FFE066",   // Amarelo estrela
          purple: "#7B2CBF",   // Roxo nebulosa
        }
      },
      boxShadow: {
        'neo': '6px 6px 0px #0D1321',
        'neo-sm': '4px 4px 0px #0D1321',
        'neo-hover': '2px 2px 0px #0D1321',
      },
      animation: {
        'orbit': 'orbit 10s linear infinite',
        'float-slow': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        orbit: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;