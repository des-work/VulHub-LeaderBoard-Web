#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const path = require('path');
const os = require('os');

const isWindows = os.platform() === 'win32';
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
};

const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${colors.blue}${msg}${colors.reset}\n`),
};

const PORT_API = process.env.API_PORT || 4010;
const PORT_WEB = process.env.WEB_PORT || 3000;

async function checkPort(port) {
  return new Promise((resolve) => {
    const net = require('net');
    const server = net.createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(true); // Port is in use
      } else {
        resolve(false);
      }
    });
    
    server.once('listening', () => {
      server.close();
      resolve(false); // Port is free
    });
    
    server.listen(port, '127.0.0.1');
  });
}

async function killPort(port) {
  return new Promise((resolve) => {
    if (isWindows) {
      exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
        if (error || !stdout) {
          resolve();
          return;
        }
        
        const match = stdout.match(/\s+(\d+)\s+LISTENING/);
        if (match) {
          const pid = match[1];
          exec(`taskkill /PID ${pid} /F`, (err) => {
            resolve();
          });
        } else {
          resolve();
        }
      });
    } else {
      exec(`lsof -ti:${port} | xargs kill -9 2>/dev/null || true`, (error) => {
        resolve();
      });
    }
  });
}

function startServer(name, dir, command, port) {
  return new Promise((resolve, reject) => {
    log.info(`Starting ${name} on port ${port}...`);
    
    const server = spawn(isWindows ? 'cmd.exe' : 'sh', 
      isWindows 
        ? ['/c', command] 
        : ['-c', command],
      {
        cwd: path.resolve(__dirname, '..', dir),
        stdio: 'inherit',
        shell: true,
      }
    );
    
    server.on('error', (err) => {
      log.error(`Failed to start ${name}: ${err.message}`);
      reject(err);
    });
    
    server.on('close', (code) => {
      if (code !== 0) {
        log.error(`${name} exited with code ${code}`);
      }
    });
    
    // Give server time to start
    setTimeout(() => resolve(server), 2000);
  });
}

async function main() {
  log.title('🚀 VulHub Leaderboard - Local Development Startup');
  
  try {
    log.info('Checking for port conflicts...');
    
    // Check and kill ports if needed
    const apiInUse = await checkPort(PORT_API);
    const webInUse = await checkPort(PORT_WEB);
    
    if (apiInUse) {
      log.warn(`Port ${PORT_API} is in use, attempting to free it...`);
      await killPort(PORT_API);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    if (webInUse) {
      log.warn(`Port ${PORT_WEB} is in use, attempting to free it...`);
      await killPort(PORT_WEB);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    log.success('Ports are ready');
    
    log.title('🔧 Starting Servers');
    
    // Start API server
    log.info('Starting backend API server...');
    const apiProcess = await startServer(
      'Backend API',
      'apps/api',
      'pnpm start:dev',
      PORT_API
    );
    
    // Wait a bit for API to start
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Start Web server
    log.info('Starting frontend web server...');
    const webProcess = await startServer(
      'Frontend Web',
      'apps/web',
      'pnpm dev',
      PORT_WEB
    );
    
    log.title('✅ Startup Complete!');
    
    log.success(`Backend API: ${colors.bright}http://localhost:${PORT_API}${colors.reset}`);
    log.success(`Frontend Web: ${colors.bright}http://localhost:${PORT_WEB}${colors.reset}`);
    
    log.info('');
    log.info('📋 Next Steps:');
    log.info('  1. Open http://localhost:3000 in your browser');
    log.info('  2. Login with your test credentials');
    log.info('  3. Test the application features');
    log.info('');
    log.info('💡 Tips:');
    log.info('  • Press Ctrl+C to stop all servers');
    log.info('  • Run "npm run dev:cleanup" to clear cache');
    log.info('  • Run "npm run dev:stop" to kill processes');
    log.info('');
    
    // Keep process running
    await new Promise(() => {});
    
  } catch (error) {
    log.error(`Startup failed: ${error.message}`);
    process.exit(1);
  }
}

// Handle signals
process.on('SIGINT', () => {
  log.info('Shutting down servers...');
  process.exit(0);
});

main().catch(err => {
  log.error(err.message);
  process.exit(1);
});
