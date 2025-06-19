import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  logLevel: 'info',
  build: {
    chunkSizeWarningLimit: 1000, // Increase warning limit to 1MB
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            if (id.includes('@material-tailwind') || id.includes('@heroicons')) {
              return 'ui-vendor';
            }
            if (id.includes('chart') || id.includes('apexcharts')) {
              return 'chart-vendor';
            }
            if (id.includes('axios') || id.includes('react-toastify')) {
              return 'utils-vendor';
            }
            // Other node_modules go to vendor chunk
            return 'vendor';
          }
          
          // Feature-based chunks for your source code
          if (id.includes('/pages/dashboard/')) {
            if (id.includes('AddPatientCase') || id.includes('UpdatePatientCase')) {
              return 'patient-management';
            }
            if (id.includes('ClinicalCategories')) {
              return 'clinical';
            }
            if (id.includes('Dashboard') || id.includes('PatientCaseList') || id.includes('UsersPage')) {
              return 'dashboard';
            }
          }
          
          // Widgets and components
          if (id.includes('/widgets/')) {
            return 'widgets';
          }
          
          // Layouts
          if (id.includes('/layouts/')) {
            return 'layouts';
          }
        }
      }
    }
  },
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
