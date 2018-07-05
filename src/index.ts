import 'core-js/features/array/flat-map';

import './config/config';
import { initializeNode } from './core';
import logger from './core/logger';
import { startGraphQLServer } from './server/server';

/**
 * Entry point of the application.
 */
export const main = async () => {
  handleUnhandledExceptions();

  await initializeNode();
  await startGraphQLServer();
};

const handleUnhandledExceptions = () => {
  process.once('uncaughtException', logErrorAndExit);
  process.once('unhandledRejection', logErrorAndExit);
};

const logErrorAndExit = (error: Error) => {
  const exitCode = 1;

  logger.error(error);
  process.exit(exitCode);
};

main();
