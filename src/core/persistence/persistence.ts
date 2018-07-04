import { promises as fs } from 'fs';
import { promisify } from 'util';

import mkdirpCallback from 'mkdirp';

import { env } from '../../config';

const { persistencePath } = env;

const mkdirp: (path: string) => Promise<void> = promisify(mkdirpCallback);

export const initializeFileSystem = (): Promise<void> =>
  mkdirp(persistencePath);

export const saveToDisk = (data: string, path: string): Promise<void> =>
  fs.writeFile(appendPersistancePath(path), data);

export const loadFromDisk = (path: string): Promise<string> =>
  fs.readFile(appendPersistancePath(path), 'utf8');

const appendPersistancePath = (path: string): string =>
  `${persistencePath}/${path}`;
