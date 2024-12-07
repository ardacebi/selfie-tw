import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePluginNode } from "vite-plugin-node";
import { config } from "dotenv";

config();

export default defineConfig({
  server: {
    hmr: {
      port: process.env.PORT || 3000,
    },
  },
  plugins: [
    react(),
    VitePluginNode({
      adapter: "express",
      appPath: "./src/server/server.js", // Changed from addPath to appPath
      exportName: "ViteNodeApp",
    }),
  ],
  root: "src",
});
