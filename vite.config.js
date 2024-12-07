import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePluginNode } from "vite-plugin-node";
import { config } from "dotenv";

config();

export default defineConfig({
  server: {
    // Specify a different port for the Vite HMR to avoid conflicts
    hmr: {
      port: process.env.VITE_HMR_PORT || 5532,
    },
    port: process.env.VITE_PORT || 3532, // Ensure Vite's dev server runs on a separate port
  },
  plugins: [
    react(),
    VitePluginNode({
      adapter: "express",
      appPath: "./src/server/server.js",
      exportName: "ViteNodeApp",
    }),
  ],
  root: "src",
});
