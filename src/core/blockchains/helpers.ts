import {
  Block,
  DIFFICULTY_ADJUSMENT_INTERVAL,
  EXPECTED_TIME_BETWEEN_DIFFICULTY_ADJUSTMENT,
  getTimeBetweenBlocks,
  isDifficultyAdjustmentBlock,
} from '../blocks';
import { Blockchain } from './types';

export const hasMoreCumulativeDifficulty = (
  blockchain1: Blockchain,
  blockchain2: Blockchain,
): boolean =>
  getCumulativeDifficulty(blockchain1) > getCumulativeDifficulty(blockchain2);

const getCumulativeDifficulty = (blockchain: Blockchain): number =>
  blockchain
    .map(block => block.difficulty)
    .map(difficulty => 2 ** difficulty)
    .reduce((acc, a) => acc + a);

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

export const getLatestBlock = (blockchain: Blockchain): Block =>
  blockchain[blockchain.length - 1];

const getPrevDifficultyAdjustmentBlock = (blockchain: Blockchain): Block => {
  const prevDifficultyAdjustmentBlock = blockchain
    .slice(0, -DIFFICULTY_ADJUSMENT_INTERVAL)
    .reverse()
    .find(isDifficultyAdjustmentBlock);

  if (!prevDifficultyAdjustmentBlock) {
    return getGenesisBlock(blockchain);
  }

  return prevDifficultyAdjustmentBlock;
};

const getGenesisBlock = (blockchain: Blockchain): Block => blockchain[0];

const doGetAdjustedDifficulty = (
  timeBetweenBlocks: number,
  prevDifficultyAdjustmentBlock: Block,
): number => {
  if (tookTooLittle(timeBetweenBlocks)) {
    return prevDifficultyAdjustmentBlock.difficulty + 1;
  }

  if (
    tookTooLong(timeBetweenBlocks) &&
    prevDifficultyAdjustmentBlock.difficulty > 0
  ) {
    return prevDifficultyAdjustmentBlock.difficulty - 1;
  }

  return prevDifficultyAdjustmentBlock.difficulty;
};

const tookTooLong = (timeBetweenBlocks: number): boolean =>
  timeBetweenBlocks > EXPECTED_TIME_BETWEEN_DIFFICULTY_ADJUSTMENT * 2;

const tookTooLittle = (timeBetweenBlocks: number): boolean =>
  timeBetweenBlocks < EXPECTED_TIME_BETWEEN_DIFFICULTY_ADJUSTMENT / 2;
