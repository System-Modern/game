import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/game/', // Sesuai dengan nama repository https://github.com/System-Modern/game
});
