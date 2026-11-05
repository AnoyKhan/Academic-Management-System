import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const env = globalThis.process?.env ?? {};

export default defineConfig({
  base:
    env.VITE_BASE_PATH ??
    (env.GITHUB_ACTIONS ? "/Academic-Management-System/" : "/"),
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 5173,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: "127.0.0.1",
    port: 4173,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
});
