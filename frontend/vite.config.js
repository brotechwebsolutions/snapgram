import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // In development, proxy to localhost:8080
  // In production (Vercel), VITE_API_URL is set to the full Render URL
  const backendHost = env.VITE_API_URL?.startsWith("http")
    ? env.VITE_API_URL.replace(/\/api$/, "")
    : "http://localhost:8080";

  return {
    base: "/", // 🔥 MUST FIX FOR MOBILE + VERCEL

    plugins: [react()],

    // Development server with proxy
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: backendHost,
          changeOrigin: true,
          secure: false,
        },
        "/ws": {
          target: backendHost,
          ws: true,
          changeOrigin: true,
          secure: false,
        },
      },
    },

    // Production build
    build: {
      outDir: "dist",
      sourcemap: false, // smaller bundle
      minify: "esbuild",
      target: "es2020",
      rollupOptions: {
        output: {
          manualChunks: {
            "react-vendor": ["react", "react-dom", "react-router-dom"],
            "ui-vendor": ["react-icons", "react-hot-toast"],
            "util-vendor": ["axios", "date-fns"],
            "stomp-vendor": ["@stomp/stompjs"],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
    },

    // Global constants
    define: {
      __APP_VERSION__: JSON.stringify("1.0.0"),
    },
  };
});