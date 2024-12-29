import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { config } from "dotenv";

config();

export default defineConfig({
  server: {
    port: process.env.VITE_PORT || 3532, // Ensure Vite's dev server runs on a separate port
  },
  plugins: [react()],
  root: "src",
});
