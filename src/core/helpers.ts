import { createHash, HexBase64Latin1Encoding } from 'crypto';

import logger from './logger';

export const sha256 = (
  data: string | Buffer | DataView,
  encoding: HexBase64Latin1Encoding = 'hex',
): string =>
  createHash('sha256')
    .update(data)
    .digest(encoding);

export function tryOrLogError(functionToTry: () => void): void {
  try {
    functionToTry();
  } catch (e) {
    logger.error(e.message);
  }
}
