#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

const rootDir = path.resolve(__dirname, '..');
const dirsToClean = [
  { path: 'apps/api/.next', desc: 'API .next cache' },
  { path: 'apps/web/.next', desc: 'Web .next cache' },
  { path: 'apps/api/dist', desc: 'API dist folder' },
  { path: 'apps/web/dist', desc: 'Web dist folder' },
  { path: 'apps/api/node_modules/.cache', desc: 'API node_modules cache' },
  { path: 'apps/web/node_modules/.cache', desc: 'Web node_modules cache' },
];

function removeDir(dir, desc) {
  const fullPath = path.join(rootDir, dir);
  try {
    if (fs.existsSync(fullPath)) {
      log.info(`Removing ${desc}...`);
      if (process.platform === 'win32') {
        execSync(`rmdir /s /q "${fullPath}"`, { stdio: 'ignore' });
      } else {
        execSync(`rm -rf "${fullPath}"`, { stdio: 'ignore' });
      }
      log.success(`Removed ${desc}`);
      return true;
    }
  } catch (error) {
    log.warn(`Could not remove ${desc}: ${error.message}`);
    return false;
  }
}

function clearBrowserCache() {
  log.info('Clearing browser cache...');
  log.info('Note: Manually clear your browser cache (Ctrl+Shift+Delete) for complete cleanup');
}

async function main() {
  log.title('🧹 Cleaning VulHub Development Environment');
  
  let cleaned = 0;
  
  for (const dir of dirsToClean) {
    if (removeDir(dir.path, dir.desc)) {
      cleaned++;
    }
  }
  
  clearBrowserCache();
  
  log.success(`Cleanup complete! Removed ${cleaned}/${dirsToClean.length} directories`);
  log.info('');
  log.info('💡 Next steps:');
  log.info('  1. Clear browser cache (Ctrl+Shift+Delete)');
  log.info('  2. Run: npm run dev:local');
  log.info('  3. Test the application');
  log.info('');
}

main().catch(err => {
  log.error(`Cleanup failed: ${err.message}`);
  process.exit(1);
});
