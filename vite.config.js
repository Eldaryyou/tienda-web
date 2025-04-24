import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/tienda-web/",
  // optimizeDeps: {
  //   include: ["jspdf"],
  //   esbuildOptions: {
  //     loader: {
  //       ".js": "jsx",
  //     },
  //   },
  // },
  // server: {
  //   headers: {
  //     "Content-Type": "application/javascript",
  //   },
  // },
});
