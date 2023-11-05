import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    _CLIENT_ID: `'${process.env.CLIENT_ID}'`,
    _API_KEY: `'${process.env.API_KEY}'`,
    _SCOPE: `'${process.env.SCOPE}'`,
    _CALENDAR_ID: `${process.env.CALENDAR_ID}`,
    _DISCOVERY_DOCS: `'${process.env.DISCOVERY_DOCS}'`,
  },
});
