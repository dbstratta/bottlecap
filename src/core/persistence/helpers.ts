import { promisify } from 'util';

import mkdirpCallback from 'mkdirp';

export const mkdirp: (path: string) => Promise<void> = promisify(
  mkdirpCallback,
);
