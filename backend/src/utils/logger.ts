import { env } from '../config';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  meta?: Record<string, unknown>;
}

function formatEntry(entry: LogEntry): string {
  if (env.isProduction) {
    return JSON.stringify(entry);
  }

  const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}]`;
  const meta = entry.meta ? ` ${JSON.stringify(entry.meta)}` : '';
  return `${prefix} ${entry.message}${meta}`;
}

function log(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(meta && { meta }),
  };

  const formatted = formatEntry(entry);

  switch (level) {
    case 'error':
      // eslint-disable-next-line no-console
      console.error(formatted);
      break;
    case 'warn':
      // eslint-disable-next-line no-console
      console.warn(formatted);
      break;
    case 'debug':
      if (env.isDevelopment) {
        // eslint-disable-next-line no-console
        console.debug(formatted);
      }
      break;
    default:
      // eslint-disable-next-line no-console
      console.log(formatted);
  }
}

export const logger = {
  info: (message: string, meta?: Record<string, unknown>) => log('info', message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => log('warn', message, meta),
  error: (message: string, meta?: Record<string, unknown>) => log('error', message, meta),
  debug: (message: string, meta?: Record<string, unknown>) => log('debug', message, meta),
};
