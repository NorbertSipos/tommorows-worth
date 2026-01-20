import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Use esbuild for faster builds (it's the default and faster than terser)
    minify: 'esbuild',
    // Note: Cloudflare Pages automatically compresses assets with gzip/brotli
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React vendor chunk
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor'
          }
          // Router chunk
          if (id.includes('node_modules/react-router')) {
            return 'router-vendor'
          }
          // Charts chunk
          if (id.includes('node_modules/recharts')) {
            return 'chart-vendor'
          }
          // UI libraries chunk
          if (
            id.includes('node_modules/@radix-ui') ||
            id.includes('node_modules/lucide-react') ||
            id.includes('node_modules/framer-motion')
          ) {
            return 'ui-vendor'
          }
          // Large components can be split out
          if (id.includes('/components/CompoundCalculator') || 
              id.includes('/components/FourPercentRuleCalculator') ||
              id.includes('/components/DividendCalculator')) {
            return 'calculators'
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: [],
  },
})