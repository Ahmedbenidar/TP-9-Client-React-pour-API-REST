import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Le client tourne sur le port 3000 et appelle l'API Spring sur le port 8082.
// En developpement, Vite relaie /banque vers le backend : le navigateur ne voit
// qu'une seule origine, donc aucune configuration CORS n'est necessaire.
const CIBLE_API = process.env.VITE_CIBLE_API || 'http://localhost:8082';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      '/banque': {
        target: CIBLE_API,
        changeOrigin: true
      }
    }
  }
});