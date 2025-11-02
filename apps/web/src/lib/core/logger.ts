type Level = 'debug' | 'info' | 'warn' | 'error';
const enabled: Record<Level, boolean> = { debug: true, info: true, warn: true, error: true };

function log(level: Level, msg: string, meta?: any) {
  if (!enabled[level]) {return;}
  const payload = { t: new Date().toISOString(), level, msg, ...meta };
  // eslint-disable-next-line no-console
  console[level]?.(payload);
}

export const logger = {
  debug: (msg: string, meta?: any) => log('debug', msg, meta),
  info: (msg: string, meta?: any) => log('info', msg, meta),
  warn: (msg: string, meta?: any) => log('warn', msg, meta),
  error: (msg: string, meta?: any) => log('error', msg, meta),
};
