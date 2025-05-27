import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  logLevel: 'info',
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@material-tailwind/react',
      '@heroicons/react/24/solid'
    ]
  }
});
