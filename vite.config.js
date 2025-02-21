import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
//import { config } from "dotenv";

//config();

export default defineConfig({
  /*
    build: {
      outDir: "dist/build",
      rollupOptions: {
        output: {
          format: "esm",
        },
      },
    },
    */
  plugins: [react()],
});
