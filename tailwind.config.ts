import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"], darkMode: "class",
  theme: { extend: { colors: { brand: { 400: "#2dd4bf", 500: "#14b8a6", 600: "#0d9488", 700: "#0f766e" } } } },
  plugins: [],
};
export default config;
