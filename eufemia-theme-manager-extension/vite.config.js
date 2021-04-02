import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import replace from '@rollup/plugin-replace'
import dotenv from 'dotenv'
dotenv.config()

const browser = process.env.RUNTIME_BROWSER

export default defineConfig({
  plugins: [
    {
      ...replace({
        preventAssignment: true,
        'process.env': 'import.meta.env',
      }),
      enforce: 'post',
    },
    reactRefresh(),
  ],
  build: {
    outDir: `dist-${browser}`,
    sourcemap: true,
    minify: false,
  },
})
