import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => ({
  build: {
    emptyOutDir: true,
    outDir: "dist",
    rollupOptions: {
      input: "index.html",
      plugins: [visualizer()],
    },
  },
  define: {
    "process.env.API_BASE_URL": JSON.stringify("/api"),
    "process.env.NODE_ENV": JSON.stringify(mode),
  },
  plugins: [react(), UnoCSS(), tsconfigPaths()],
  resolve: {
    extensions: [".js", ".cjs", ".mjs", ".ts", ".cts", ".mts", ".tsx", ".jsx"],
  },
  server: {
    open: true,
    proxy: {
      "/api": "http://localhost:8000",
      "/ffmpeg": "http://localhost:8000",
      "/public": "http://localhost:8000",
      "/streams": "http://localhost:8000",
    },
  },
}));
