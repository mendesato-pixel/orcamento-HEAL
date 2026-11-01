import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./": o mesmo build funciona no GitHub Pages (subpasta /orcamento-HEAL/) e na Vercel.
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 900,
  },
});
