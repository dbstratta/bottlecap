import { promises as fs } from 'fs';
import { promisify } from 'util';

import mkdirpCallback from 'mkdirp';

const PERSISTANCE_PATH = 'node_data';

const mkdirp: (path: string) => Promise<void> = promisify(mkdirpCallback);

export const initializeFileSystem = (): Promise<void> =>
  mkdirp(PERSISTANCE_PATH);

export const saveToDisk = (data: string, path: string): Promise<void> =>
  fs.writeFile(appendPersistancePath(path), data);

export const loadFromDisk = (path: string): Promise<string> =>
  fs.readFile(appendPersistancePath(path), 'utf8');

const appendPersistancePath = (path: string): string =>
  `${PERSISTANCE_PATH}/${path}`;
