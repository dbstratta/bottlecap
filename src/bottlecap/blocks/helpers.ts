import { createHash } from 'crypto';

import { Nonce } from './block';

export function* nonceGenerator(startNonceFrom: number = 0) {
  let nonce: Nonce = startNonceFrom;
  while (true) {
    yield nonce;
    nonce += 1;
  }
}

export const stringifyHashableBlockData = (
  index: number,
  nonce: Nonce,
  data: string,
  prevHash: string,
  timestamp: number,
  difficulty: number,
): string =>
  [index, nonce, data, prevHash, timestamp, difficulty]
    .map(a => a.toString())
    .join();

export const hashString = (str: string): string =>
  createHash('sha256')
    .update(str)
    .digest('hex');

const hexToBinaryLookupTable: { [key: string]: string } = {
  '0': '0000',
  '1': '0001',
  '2': '0010',
  '3': '0011',
  '4': '0100',
  '5': '0101',
  '6': '0110',
  '7': '0111',
  '8': '1000',
  '9': '1001',
  a: '1010',
  b: '1011',
  c: '1100',
  d: '1101',
  e: '1110',
  f: '1111',
};

export const hexToBinary = (data: string): string =>
  data
    .split('')
    .reduce(
      (acc: string, hexDigit: string) =>
        acc.concat(hexToBinaryLookupTable[hexDigit]),
      '',
    );
