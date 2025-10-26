import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    supported: {
      'top-level-await': true
    },
  },
  build:{
    chunkSizeWarningLimit: 1000,
    minify: true,
    rollupOptions: {
      treeshake: true,
    },
  },
  plugins: [
    {
        //Правим recast, иначе не работает
        name: 'fix-recast',
        transform(code, id) {
          if (id.includes('recast-detour')) {
            // return code.replace(`this["Recast"]`, 'self["Recast"]'); // self for worker
            return code.replace(`this["Recast"]`, 'window["Recast"]'); // window for main thread
          }
        }
    },
  ],
  server: {
    port: 5173,           // Порт, на котором запущен сервер Vite
    strictPort: true,     // Принуждает использовать заданный порт
    hmr: {
      overlay: false,       // Отображать уведомления об ошибках поверх приложения
      protocol: 'ws',      // Использовать обычный WebSocket (не SSL)
      host: 'localhost',   // Хост для соединений HMR
      path: '/',           // Путь для маршрутов HMR
      port: 5173,
    },
  },
});