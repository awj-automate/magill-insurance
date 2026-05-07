import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Inter", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        ink: {
          950: "#070912",
          900: "#0c1020",
          800: "#141a30",
          700: "#1d2440",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(148,163,184,0.08), 0 8px 30px rgba(0,0,0,0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
