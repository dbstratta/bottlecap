import { always, mathMod } from 'ramda';

import { Block, BLOCK_GENERATION_INTERVAL, Nonce } from './block';
import {
  hashString,
  nonceGenerator,
  stringifyHashableBlockData,
} from './helpers';
import { hashMatchesDifficulty } from './validators';

type FindBlockArgs = {
  index: number;
  data: string;
  prevHash: string;
  timestamp: number;
  difficulty: number;
};

export const findBlock = ({
  index,
  data,
  prevHash,
  timestamp,
  difficulty,
}: FindBlockArgs): Block => {
  const nonceIterator = nonceGenerator();

  while (true) {
    const nonce: Nonce = nonceIterator.next().value;
    const hashableBlockData: string = stringifyHashableBlockData(
      index,
      nonce,
      data,
      prevHash,
      timestamp,
      difficulty,
    );

    const hash = hashString(hashableBlockData);

    if (hashMatchesDifficulty(hash, difficulty)) {
      return { index, nonce, data, prevHash, hash, timestamp, difficulty };
    }
  }
};

const genesisBlock = findBlock({
  index: 0,
  data: 'TBD',
  prevHash: '',
  difficulty: 1,
  timestamp: Date.now(),
});

export const getGenesisBlock: () => Block = always(genesisBlock);

export const hashBlock = ({
  index,
  nonce,
  data,
  prevHash,
  timestamp,
  difficulty,
}: Block): string =>
  hashString(
    stringifyHashableBlockData(
      index,
      nonce,
      data,
      prevHash,
      timestamp,
      difficulty,
    ),
  );

export const isDifficultyAdjustmentBlock = (block: Block): boolean =>
  mathMod(block.index, BLOCK_GENERATION_INTERVAL) === 0 && block.index !== 0;

export const getTimeBetweenBlocks = (block1: Block, block2: Block): number =>
  block1.timestamp - block2.timestamp;
