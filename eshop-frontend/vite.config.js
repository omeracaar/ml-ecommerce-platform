import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000 // Vite'ı 3000 portunda çalışmaya zorla
  }
})
