import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dotenv from 'dotenv'

// https://vitejs.dev/config/
export default defineConfig({

  plugins: [
    react(),
    legacy()
  ],

})
