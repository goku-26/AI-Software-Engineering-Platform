"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const db_1 = require("./config/db");
const env_1 = require("./config/env");
const startServer = async () => {
    const app = (0, app_1.createApp)();
    const PORT = parseInt(env_1.env.PORT, 10) || 5001;
    const server = app.listen(PORT, () => {
        console.log(`[DevForge API] Server running in ${env_1.env.NODE_ENV} mode on port ${PORT}`);
        console.log(`[DevForge API] Health Check: http://localhost:${PORT}/health`);
    });
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`[DevForge API] Port ${PORT} is already in use by an active DevForge server instance.`);
        }
        else {
            console.error('[DevForge API] Server error:', err);
        }
    });
    (0, db_1.connectDB)().catch((err) => {
        console.warn('[Database] Running in Demo Mode without active MongoDB');
    });
};
startServer().catch((err) => {
    console.error('[DevForge API] Failed to start server:', err);
});
