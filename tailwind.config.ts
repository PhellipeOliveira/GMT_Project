import type { Config } from "tailwindcss";

/**
 * Tailwind CSS v4 — tokens de tema vivem em `src/styles/globals.css` (@theme inline).
 * Este ficheiro documenta content paths e alinha com o design map lessestudio.com.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-hostgrotesk)", "sans-serif"],
        sans: ["var(--font-dmsans)", "sans-serif"],
      },
      fontSize: {
        label: ["12px", { letterSpacing: "0.1em", lineHeight: "1.25" }],
        body: ["16px", { lineHeight: "1.5" }],
        "body-lg": ["18px", { lineHeight: "1.55" }],
        h3: ["30px", { lineHeight: "1.2" }],
        h2: ["60px", { lineHeight: "1.1" }],
        hero: [
          "clamp(48px, 8vw, 96px)",
          { lineHeight: "clamp(1, 8vw, 1.1)" },
        ],
      },
      fontWeight: {
        normal: "400",
        medium: "500",
      },
    },
  },
};

export default config;
