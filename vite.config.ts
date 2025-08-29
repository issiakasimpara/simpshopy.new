import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react({
      // 🔧 Configuration React pour éviter unstable_scheduleCallback
      jsxRuntime: 'automatic',
      // Désactiver les Concurrent Features
      fastRefresh: true
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    postcss: './postcss.config.cjs'
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // 🚀 CODE SPLITTING INTELLIGENT
          
          // Chunks admin uniquement
          if (id.includes('/pages/Dashboard') || 
              id.includes('/pages/Analytics') || 
              id.includes('/pages/Products') ||
              id.includes('/pages/Orders') ||
              id.includes('/pages/Customers') ||
              id.includes('/pages/Settings') ||
              id.includes('/pages/SiteBuilder') ||
              id.includes('/pages/Integrations') ||
              id.includes('/pages/Categories') ||
              id.includes('/pages/StoreConfig') ||
              id.includes('/pages/MarketsShipping') ||
              id.includes('/pages/Payments') ||
              id.includes('/pages/Themes') ||
              id.includes('/pages/Domains') ||
              id.includes('/components/onboarding/') ||
              id.includes('/components/site-builder/OptimizedTemplateEditor') ||
              id.includes('/components/site-builder/TemplatePreview')) {
            return 'admin-only';
          }
          
          // Chunks storefront uniquement
          if (id.includes('/pages/Storefront') || 
              id.includes('/pages/Cart') || 
              id.includes('/pages/Checkout') ||
              id.includes('/pages/PaymentSuccess') ||
              id.includes('/components/VisitorTracker') ||
              id.includes('/components/site-builder/blocks/')) {
            return 'storefront-only';
          }
          
          // Chunks vendor optimisés
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
          
          if (id.includes('node_modules/react-router-dom')) {
            return 'vendor-router';
          }
          
          if (id.includes('node_modules/@radix-ui')) {
            return 'vendor-ui';
          }
          
          if (id.includes('node_modules/@supabase')) {
            return 'vendor-supabase';
          }
          
          if (id.includes('node_modules/@tanstack/react-query')) {
            return 'vendor-query';
          }
          
          if (id.includes('node_modules/recharts')) {
            return 'vendor-charts-legacy';
          }
          
          if (id.includes('node_modules/chart.js') || id.includes('node_modules/react-chartjs-2')) {
            return 'vendor-charts';
          }
          
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons-legacy';
          }
          
          if (id.includes('node_modules/@heroicons')) {
            return 'vendor-icons';
          }
          
          if (id.includes('node_modules/date-fns') || 
              id.includes('node_modules/clsx') || 
              id.includes('node_modules/tailwind-merge')) {
            return 'vendor-utils';
          }
          
          // Chunks de pages publiques
          if (id.includes('/pages/Home') || 
              id.includes('/pages/Features') || 
              id.includes('/pages/Pricing') ||
              id.includes('/pages/About') ||
              id.includes('/pages/Testimonials') ||
              id.includes('/pages/WhyChooseUs') ||
              id.includes('/pages/Support')) {
            return 'public-pages';
          }
          
          // Chunks de pages légales
          if (id.includes('/pages/Legal') || 
              id.includes('/pages/Privacy') || 
              id.includes('/pages/Terms')) {
            return 'legal-pages';
          }
          
          // Chunks d'intégrations
          if (id.includes('/pages/integrations/')) {
            return 'integrations';
          }
          
          // Chunks de composants UI
          if (id.includes('/components/ui/')) {
            return 'ui-components';
          }
          
          // Chunks de hooks
          if (id.includes('/hooks/')) {
            return 'hooks';
          }
          
          // Chunks de services
          if (id.includes('/services/')) {
            return 'services';
          }
          
          // Chunks de types
          if (id.includes('/types/')) {
            return 'types';
          }
          
          // Chunks de contextes
          if (id.includes('/contexts/')) {
            return 'contexts';
          }
          
          // Chunks d'utilitaires
          if (id.includes('/utils/')) {
            return 'utils';
          }
          
          // Chunks d'intégrations Supabase
          if (id.includes('/integrations/')) {
            return 'integrations-supabase';
          }
          
          // Chunks par défaut
          return 'common';
        },
        // Optimiser la taille des chunks
      },
    },
    // Optimisations de build
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // 🚨 GARDER LES CONSOLE.LOG POUR DÉBOGUER SUR VERCEL
        drop_debugger: true,
        pure_funcs: [], // 🚨 NE PAS SUPPRIMER LES FONCTIONS PURES
        passes: 2, // Passes multiples pour une meilleure compression
      },
      mangle: {
        toplevel: true, // Mangle les noms de variables de niveau supérieur
      },
    },
    // Code splitting automatique
  },
  // Optimisations de développement
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      '@tanstack/react-query',
    ],
  },
}));
