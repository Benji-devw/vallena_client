import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { config } from 'dotenv'

// Chargement des variables d'environnement depuis .env.test
config({ path: '.env.test' })

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    environmentOptions: {
      // Permet d'avoir accès aux variables d'environnement Node.js
      env: process.env,
    },
    setupFiles: ['./vitest.setup.ts'],
  },
})