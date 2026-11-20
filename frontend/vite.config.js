import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

const localEnvPath = fileURLToPath(new URL('./local.env', import.meta.url));
const localEnv = fs.existsSync(localEnvPath)
  ? dotenv.parse(fs.readFileSync(localEnvPath))
  : {};

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify(
      process.env.VITE_API_BASE_URL || localEnv.VITE_API_BASE_URL || 'https://bhavya-h47b.onrender.com',
    ),
  },
});
