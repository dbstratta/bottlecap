import { createLogger, format, transports } from 'winston';

export type LogLevel = 'info' | 'warn' | 'error';

const logger = createLogger({
  level: process.env.LOG_LEVEL,
  format: format.combine(format.colorize(), format.simple()),
  transports: [new transports.Console()],
});

export default logger;
