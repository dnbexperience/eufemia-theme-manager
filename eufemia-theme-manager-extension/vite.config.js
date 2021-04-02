import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import dotenv from 'dotenv'
dotenv.config()

const browser = process.env.RUNTIME_BROWSER

export default defineConfig({
  plugins: [reactRefresh()],
  build: {
    outDir: `dist-${browser}`,
    sourcemap: true,
    minify: false,
    // emptyOutDir: true,
  },
})
