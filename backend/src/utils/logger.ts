//utils/logger.ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private static formatMessage(level: LogLevel, message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] ${level.toUpperCase()}: ${message} ${args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ')}`;
  }

  public debug(message: string, ...args: any[]): void {
    console.debug(Logger.formatMessage('debug', message, ...args));
  }

  public info(message: string, ...args: any[]): void {
    console.info(Logger.formatMessage('info', message, ...args));
  }

  public warn(message: string, ...args: any[]): void {
    console.warn(Logger.formatMessage('warn', message, ...args));
  }

  public error(message: string, ...args: any[]): void {
    console.error(Logger.formatMessage('error', message, ...args));
  }
}

export const logger = new Logger();

