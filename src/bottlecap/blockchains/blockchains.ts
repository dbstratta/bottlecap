import {
  Block,
  EXPECTED_TIME_BETWEEN_BLOCKS,
  getTimeBetweenBlocks,
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

  const timeBetweenBlocks = getTimeBetweenBlocks(
    latestBlock,
    prevDifficultyAdjustmentBlock,
  );

  return doGetAdjustedDifficulty(
    timeBetweenBlocks,
    prevDifficultyAdjustmentBlock,
  );
};

const getLatestBlock = (blockchain: Blockchain): Block =>
  blockchain[blockchain.length - 1];

const getPrevDifficultyAdjustmentBlock = (blockchain: Blockchain): Block =>
  blockchain
    .slice()
    .reverse()
    .find(isDifficultyAdjustmentBlock) as Block;

const doGetAdjustedDifficulty = (
  timeBetweenBlocks: number,
  prevDifficultyAdjustmentBlock: Block,
): number => {
  if (tookTooLong(timeBetweenBlocks)) {
    return prevDifficultyAdjustmentBlock.difficulty + 1;
  }

  if (tookTooLittle(timeBetweenBlocks)) {
    return prevDifficultyAdjustmentBlock.difficulty - 1;
  }

  return prevDifficultyAdjustmentBlock.difficulty;
};

const tookTooLong = (timeBetweenBlocks: number): boolean =>
  timeBetweenBlocks < EXPECTED_TIME_BETWEEN_BLOCKS / 2;

const tookTooLittle = (timeBetweenBlocks: number): boolean =>
  timeBetweenBlocks > EXPECTED_TIME_BETWEEN_BLOCKS * 2;
