import logger from './logger';

export function tryOrLogError(functionToTry: () => void): void {
  try {
    functionToTry();
  } catch (e) {
    logger.error(e.message);
  }
}
