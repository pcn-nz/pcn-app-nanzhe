import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [react()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
  // build: {
  //   rollupOptions: {
  //     input: {
  //       index: path.resolve(__dirname, "index.html"),
  //       player: path.resolve(__dirname, "./palyer.html")
  //     },
  //     output: {
  //       chunkFileNames: 'static/js/[name]-[hash].js',
  //       entryFileNames: "static/js/[name]-[hash].js",
  //       assetFileNames: "static/[ext]/name-[hash].[ext]"
  //     }
  //   }
  // }
}));
