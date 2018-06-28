import { sha256 } from '../helpers';
import { Block, BlockData, Nonce } from './types';

/**
 * Returns the hash of a `Block`.
 */
export const hashBlock = ({
  index,
  nonce,
  data,
  prevHash,
  timestamp,
  difficulty,
}: Block): string =>
  sha256(
    stringifyHashableBlockContent({
      index,
      nonce,
      data,
      prevHash,
      timestamp,
      difficulty,
    }),
  );

/**
 * Generator function that yields nonces infinitely.
 */
export function* nonceGenerator(startNonceFrom: number = 0) {
  let nonce: Nonce = startNonceFrom;
  while (true) {
    yield nonce;
    nonce += 1;
  }
}

export const stringifyHashableBlockContent = (data: {
  index: number;
  nonce: Nonce;
  data: BlockData;
  prevHash: string;
  timestamp: number;
  difficulty: number;
}): string => JSON.stringify(data);

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

/**
 * Returns the string in binary of a string in hexadecimal.
 */
export const hexToBinary = (data: string): string =>
  data
    .split('')
    .reduce(
      (acc: string, hexDigit: string) =>
        acc.concat(hexToBinaryLookupTable[hexDigit]),
      '',
    );

/**
 * Returns `true` if the hash passes the difficulty
 * (amount of work).
 */
export const hashMatchesDifficulty = (
  hash: string,
  difficulty: number,
): boolean => {
  const binaryHash = hexToBinary(hash);
  const requiredPrefix = '0'.repeat(difficulty);

  return binaryHash.startsWith(requiredPrefix);
};
