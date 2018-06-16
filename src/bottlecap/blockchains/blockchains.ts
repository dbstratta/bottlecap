import { dec, find, inc, last } from 'ramda';

import {
  Block,
  EXPECTED_TIME_BETWEEN_BLOCKS,
  getMsBetweenBlocks,
  isDifficultyAdjustmentBlock,
} from '../blocks';

import { Blockchain } from './blockchain';

export const getDifficulty = (blockchain: Blockchain): number => {
  const latestBlock = getLatestBlock(blockchain);

  if (isDifficultyAdjustmentBlock(latestBlock)) {
    return getAdjustedDifficulty(blockchain);
  }

  return latestBlock.difficulty;
};

const getAdjustedDifficulty = (blockchain: Blockchain): number => {
  const latestBlock = getLatestBlock(blockchain);
  const prevDifficultyAdjustmentBlock = getPrevDifficultyAdjustmentBlock(
    blockchain,
  );

  const timeBetweenBlocks = getMsBetweenBlocks(
    latestBlock,
    prevDifficultyAdjustmentBlock,
  );

  return doGetAdjustedDifficulty(
    timeBetweenBlocks,
    prevDifficultyAdjustmentBlock,
  );
};

const getLatestBlock = (blockchain: Blockchain): Block =>
  last(blockchain) as Block;

const getPrevDifficultyAdjustmentBlock = (blockchain: Blockchain): Block =>
  find(isDifficultyAdjustmentBlock, blockchain) as Block;

const doGetAdjustedDifficulty = (
  timeBetweenBlocks: number,
  prevDifficultyAdjustmentBlock: Block,
): number => {
  if (tookTooLong(timeBetweenBlocks)) {
    return inc(prevDifficultyAdjustmentBlock.difficulty);
  }

  if (tookTooLittle(timeBetweenBlocks)) {
    return dec(prevDifficultyAdjustmentBlock.difficulty);
  }

  return prevDifficultyAdjustmentBlock.difficulty;
};

const tookTooLong = (timeBetweenBlocks: number): boolean =>
  timeBetweenBlocks < EXPECTED_TIME_BETWEEN_BLOCKS / 2;

const tookTooLittle = (timeBetweenBlocks: number): boolean =>
  timeBetweenBlocks > EXPECTED_TIME_BETWEEN_BLOCKS * 2;
