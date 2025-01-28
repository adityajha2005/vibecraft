"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
class Logger {
    static formatMessage(level, message, ...args) {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] ${level.toUpperCase()}: ${message} ${args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ')}`;
    }
    debug(message, ...args) {
        console.debug(Logger.formatMessage('debug', message, ...args));
    }
    info(message, ...args) {
        console.info(Logger.formatMessage('info', message, ...args));
    }
    warn(message, ...args) {
        console.warn(Logger.formatMessage('warn', message, ...args));
    }
    error(message, ...args) {
        console.error(Logger.formatMessage('error', message, ...args));
    }
}
exports.logger = new Logger();
