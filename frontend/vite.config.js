import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Use process.env for defining environment variables since import.meta.env won't work in the config file
export default defineConfig({
  define: {
    'import.meta.env.SERVER_HOST': JSON.stringify(
      process.env.NODE_ENV === 'production'
        ? 'http://vm2.makonissoft.com:1314'
        : '/api'
    ),
  },
  plugins: [react()],
  server: {
    port: 5173,  // Specify the desired port for the frontend
    cors: true,  // Enable CORS if needed for cross-origin requests
    proxy: {
      '/api': {
        target: 'http://38.242.253.72:8000/', // Specify your backend API URL
        changeOrigin: true, // Modify the origin of the request to match the target
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api prefix in requests to the backend
      },
    },
    host: '0.0.0.0',  // Make the server accessible on all network interfaces (optional)
    strictPort: true,  // Ensure the port is strictly used, fail if already in use
  },
});

