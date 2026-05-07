import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/CyberGuard-Chronicles-The-Battle-Of-Digital-Safety/', // 👈 this is super important
})
