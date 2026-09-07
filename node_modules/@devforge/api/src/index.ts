import { createApp } from './app';
import { connectDB } from './config/db';
import { env } from './config/env';

const startServer = async () => {
  const app = createApp();
  const PORT = parseInt(env.PORT, 10) || 5001;

  const server = app.listen(PORT, () => {
    console.log(`[DevForge API] Server running in ${env.NODE_ENV} mode on port ${PORT}`);
    console.log(`[DevForge API] Health Check: http://localhost:${PORT}/health`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`[DevForge API] Port ${PORT} is already in use by an active DevForge server instance.`);
    } else {
      console.error('[DevForge API] Server error:', err);
    }
  });

  connectDB().catch((err) => {
    console.warn('[Database] Running in Demo Mode without active MongoDB');
  });
};

startServer().catch((err) => {
  console.error('[DevForge API] Failed to start server:', err);
});
