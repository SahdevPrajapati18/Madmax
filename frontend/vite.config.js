import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

// Load environment variables from .env file
const envPath = path.resolve(process.cwd(), '.env')
let envVars = {}

// Load .env file if it exists
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  envVars = envContent
    .split('\n')
    .filter(line => line.trim() && !line.startsWith('#'))
    .reduce((acc, line) => {
      const [key, ...valueParts] = line.split('=')
      if (key && valueParts.length) {
        acc[key.trim()] = valueParts.join('=').trim()
      }
      return acc
    }, {})
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    define: {
      // Make environment variables available via import.meta.env
      'import.meta.env.VITE_AUTH_API': JSON.stringify(envVars.AUTH_API || env.VITE_AUTH_API || 'http://localhost:3000'),
      'import.meta.env.VITE_MUSIC_API': JSON.stringify(envVars.MUSIC_API || env.VITE_MUSIC_API || 'http://localhost:3002'),
      'import.meta.env.VITE_NOTIFY_API': JSON.stringify(envVars.NOTIFY_API || env.VITE_NOTIFY_API || 'http://localhost:3001'),
    }
  }
})
