import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173, // ou tout autre port que vous préférez
    open: true // pour ouvrir automatiquement le navigateur
  }
});