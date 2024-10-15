import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {
      'API_KEY': '614f0dc4-4b7c-4b09-96df-300aca71f0d0',
      'SERVER_URL': 'http://localhost:3000'
    }
  },
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
    },
  },
})
