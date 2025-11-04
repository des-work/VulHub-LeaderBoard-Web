#!/usr/bin/env node

const { exec } = require('child_process');
const os = require('os');

const isWindows = os.platform() === 'win32';
const colors = {
  reset: '\x1b[0m',
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
  title: (msg) => console.log(`\n${colors.blue}${msg}${colors.reset}\n`),
};

const PORT_API = process.env.API_PORT || 4010;
const PORT_WEB = process.env.WEB_PORT || 3000;
const PORTS = [PORT_API, PORT_WEB];

function killPort(port) {
  return new Promise((resolve) => {
    log.info(`Stopping process on port ${port}...`);
    
    if (isWindows) {
      exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
        if (error || !stdout) {
          log.success(`Port ${port} is already free`);
          resolve();
          return;
        }
        
        const match = stdout.match(/\s+(\d+)\s+LISTENING/);
        if (match) {
          const pid = match[1];
          exec(`taskkill /PID ${pid} /F`, (err) => {
            if (err) {
              log.warn(`Could not kill process on port ${port}`);
            } else {
              log.success(`Stopped process on port ${port}`);
            }
            resolve();
          });
        } else {
          resolve();
        }
      });
    } else {
      exec(`lsof -ti:${port} | xargs kill -9 2>/dev/null || true`, (error) => {
        log.success(`Stopped process on port ${port}`);
        resolve();
      });
    }
  });
}

async function main() {
  log.title('🛑 Stopping VulHub Development Servers');
  
  try {
    for (const port of PORTS) {
      await killPort(port);
    }
    
    log.success('All servers stopped');
    log.info('You can now restart with: npm run dev:local');
  } catch (error) {
    log.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();
