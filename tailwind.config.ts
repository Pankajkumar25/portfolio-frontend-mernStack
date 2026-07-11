import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6C63FF",
          50: "#EDEDFF",
          100: "#D4D1FF",
          200: "#B1ACFF",
          300: "#8E85FF",
          400: "#6C63FF",
          500: "#5A52E0",
          600: "#4840C1",
          700: "#362FA2",
          800: "#241E83",
          900: "#120D64",
        },
        dark: {
          DEFAULT: "#0a0a0f",
          100: "#0d0d1a",
          200: "#111128",
          300: "#1a1a35",
          400: "#242445",
        },
        accent: "#00F5FF",
        neon: "#FF00FF",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "glow": "glow 2s ease-in-out infinite alternate",
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(108, 99, 255, 0.5), 0 0 10px rgba(108, 99, 255, 0.3)" },
          "100%": { boxShadow: "0 0 20px rgba(108, 99, 255, 0.8), 0 0 40px rgba(108, 99, 255, 0.5)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "cyber-grid": "linear-gradient(rgba(108, 99, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(108, 99, 255, 0.1) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid": "50px 50px",
      },
    },
  },
  plugins: [],
};

export default config;
