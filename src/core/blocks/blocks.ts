import { sha256 } from '../crypto';
import { DIFFICULTY_ADJUSMENT_INTERVAL } from './constants';
import {
  hashMatchesDifficulty,
  nonceGenerator,
  stringifyHashableBlockContent,
} from './helpers';
import { Block, FindBlockArgs, Nonce } from './types';

/**
 * Finds and returns a `Block` with a hash that
 * passes the difficulty.
 */
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
    const hashableBlockContent: string = stringifyHashableBlockContent({
      index,
      nonce,
      data,
      prevHash,
      timestamp,
      difficulty,
    });

    const hash = sha256(hashableBlockContent);

    if (hashMatchesDifficulty(hash, difficulty)) {
      return { index, nonce, data, prevHash, hash, timestamp, difficulty };
    }
  }
};

/**
 * Returns `true` if the blockchain receiving this block
 * should adjust the difficulty after adding this block.
 */
export const isDifficultyAdjustmentBlock = (block: Block): boolean =>
  block.index % DIFFICULTY_ADJUSMENT_INTERVAL === 0 && !isGenesisBlock(block);

const isGenesisBlock = (block: Block): boolean => block.index === 0;

/**
 * Returns the time (in milliseconds) between two blocks.
 */
export const getTimeBetweenBlocks = (block1: Block, block2: Block): number =>
  block1.timestamp - block2.timestamp;
