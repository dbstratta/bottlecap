import { Block, DIFFICULTY_ADJUSMENT_INTERVAL, Nonce } from './block';
import {
  hashMatchesDifficulty,
  hashString,
  nonceGenerator,
  stringifyHashableBlockData,
} from './helpers';

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

export const genesisBlock = findBlock({
  index: 0,
  data: 'TBD',
  prevHash: '',
  difficulty: 1,
  timestamp: Date.now(),
});

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
  block.index % DIFFICULTY_ADJUSMENT_INTERVAL === 0 && block.index !== 0;

export const getTimeBetweenBlocks = (block1: Block, block2: Block): number =>
  block1.timestamp - block2.timestamp;