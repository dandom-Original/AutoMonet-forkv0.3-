import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      '@tanstack/react-query',
      '@tanstack/react-query-devtools',
      '@tanstack/query-sync-storage-persister',
      '@tanstack/react-query-persist-client'
    ],
    exclude: []
  },
  server: {
    hmr: {
      overlay: true
    },
    watch: {
      usePolling: false
    },
    fs: {
      strict: false
    }
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: 'lightningcss',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['chart.js', 'react-chartjs-2', 'recharts']
        }
      }
    }
  },
  esbuild: {
    // Removing jsxInject to avoid React duplicate declaration
    target: 'esnext'
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    coverage: {
      reporter: ['text', 'json', 'html']
    }
  }
});
