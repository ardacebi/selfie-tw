import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { config } from "dotenv";

config();

export default defineConfig({
  server: {
    port: process.env.VITE_PORT || 3001,
  },
  plugins: [react()],
  root: "src",
});
