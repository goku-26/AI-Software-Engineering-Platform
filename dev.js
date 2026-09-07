const { spawn } = require('child_process');

console.log('[DevForge AI] Starting Express API & Vite Web IDE concurrently...');

const api = spawn('npm', ['run', 'dev:api'], { stdio: 'inherit', shell: true });
const web = spawn('npm', ['run', 'dev:web'], { stdio: 'inherit', shell: true });

process.on('SIGINT', () => {
  api.kill();
  web.kill();
  process.exit();
});
