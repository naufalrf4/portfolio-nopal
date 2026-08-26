import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "./",
  plugins: [tailwindcss()],
  server: { port: 3007, open: false, strictPort: true },
  build: { outDir: "dist", emptyOutDir: true },
});
