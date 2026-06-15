import type { Config } from "tailwindcss";

export default {
  content: ["*.{ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        drift1: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(60px, 40px) scale(1.08)" },
          "66%": { transform: "translate(20px, -30px) scale(0.96)" },
        },
        drift2: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "40%": { transform: "translate(-50px, -60px) scale(1.1)" },
          "70%": { transform: "translate(30px, 20px) scale(0.94)" },
        },
        drift3: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(-40px, 50px) scale(1.12)" },
        },
      },
      animation: {
        drift1: "drift1 14s ease-in-out infinite",
        drift2: "drift2 18s ease-in-out infinite",
        drift3: "drift3 22s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;