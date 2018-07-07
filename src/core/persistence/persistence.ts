import { promises as fs } from 'fs';

import { env } from '../../config';
import { mkdirp } from './helpers';

const { persistencePath } = env;

export const initializeFileSystem = (
  mkdirpFn: (path: string) => Promise<void> = mkdirp,
): Promise<void> => mkdirpFn(persistencePath);

export const saveToDisk = (
  data: string,
  path: string,
  writeFileFn: (path: string, data: string) => Promise<void> = fs.writeFile,
): Promise<void> => writeFileFn(appendPersistancePath(path), data);

export const loadFromDisk = (
  path: string,
  readFileFn: (path: string, encoding: 'utf8') => Promise<string> = fs.readFile,
): Promise<string> => readFileFn(appendPersistancePath(path), 'utf8');

const appendPersistancePath = (path: string): string =>
  `${persistencePath}/${path}`;
