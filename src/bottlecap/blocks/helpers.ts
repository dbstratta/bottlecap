import { createHash } from 'crypto';

import { compose, join, map, toString } from 'ramda';

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
  compose(
    join(''),
    map(toString),
  )([index, nonce, data, prevHash, timestamp, difficulty]);

export const hashString = (str: string): string =>
  createHash('sha256')
    .update(str)
    .digest('hex');
