import { initializeNode } from './core';
import logger from './core/logger';
import { startServer } from './server/server';

export const main = async () => {
  handleUnhandledExceptions();

  await initializeNode();
  await startServer();
};

const handleUnhandledExceptions = () => {
  process.once('uncaughtException', logErrorAndExit);
  process.once('unhandledRejection', logErrorAndExit);
};
const logErrorAndExit = (error: Error) => {
  logger.error(error);
  process.exit(1);
};

main();
