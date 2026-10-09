import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// Oddiy yig'ish:   npm run build
// Demo (bitta HTML fayl, backendsiz):   VITE_DEMO=1 npm run build
const isDemo = Boolean(process.env.VITE_DEMO);

export default defineConfig({
  plugins: [react(), ...(isDemo ? [viteSingleFile()] : [])],
  server: { port: 5173 },
});
