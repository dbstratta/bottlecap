import {
  UnspentTxOut,
  validateCoinbaseTransaction,
  validateTransaction,
} from '../transactions';
import { BlockValidationError } from './errors';
import { hashBlock, hashMatchesDifficulty } from './helpers';
import { Block } from './types';

export const validateNewBlock = (
  newBlock: Block,
  prevBlock: Block,
  unspentTxOuts: UnspentTxOut[],
): void => {
  validateNewBlockStructure(newBlock);
  validateNewBlockIndex(newBlock, prevBlock);
  validateNewBlockPrevHash(newBlock, prevBlock);
  validateNewBlockData(newBlock, unspentTxOuts);
  validateNewBlockHash(newBlock);
  validateNewBlockTimestamp(newBlock, prevBlock);
};

export const validateNewBlockStructure = (block: Block): void => {
  if (typeof block !== 'object') {
    throw new BlockValidationError();
  }

  validateBlockIndex(block);
  validateBlockNonce(block);
  validateBlockData(block);
  validateBlockHash(block);
  validateBlockHash(block);
  validateBlockTimestamp(block);
};

const validateBlockIndex = ({ index }: Block): void => {
  if (typeof index !== 'number') {
    throw new BlockValidationError();
  }
};

const validateBlockNonce = ({ nonce }: Block): void => {
  if (typeof nonce !== 'number') {
    throw new BlockValidationError();
  }
};

const validateBlockData = ({ data }: Block): void => {
  if (typeof data !== 'object') {
    throw new BlockValidationError();
  }

  if (typeof data.coinbaseTransaction !== 'object') {
    throw new BlockValidationError();
  }

  if (!Array.isArray(data.transactions)) {
    throw new BlockValidationError();
  }
};

const validateBlockHash = ({ hash }: Block): void => {
  if (typeof hash !== 'string') {
    throw new BlockValidationError();
  }
};

const validateBlockTimestamp = ({ timestamp }: Block): void => {
  if (typeof timestamp !== 'number') {
    throw new BlockValidationError();
  }
};

const validateNewBlockIndex = (newBlock: Block, prevBlock: Block): void => {
  if (newBlock.index !== prevBlock.index + 1) {
    throw new BlockValidationError();
  }
};

const validateNewBlockPrevHash = (newBlock: Block, prevBlock: Block): void => {
  if (newBlock.prevHash !== prevBlock.hash) {
    throw new BlockValidationError();
  }
};

const validateNewBlockData = (
  newBlock: Block,
  unspentTxOuts: UnspentTxOut[],
): void => {
  validateCoinbaseTransaction(
    newBlock.data.coinbaseTransaction,
    newBlock.index,
  );

  newBlock.data.transactions.forEach(transaction =>
    validateTransaction(transaction, unspentTxOuts),
  );
};

const validateNewBlockHash = (block: Block): void => {
  if (block.hash !== hashBlock(block)) {
    throw new BlockValidationError();
  }

  if (!hashMatchesDifficulty(block.hash, block.difficulty)) {
    throw new BlockValidationError();
  }
};

const validateNewBlockTimestamp = (newBlock: Block, prevBlock: Block): void => {
  if (!isNewBlockTimestampInValidRange(newBlock, prevBlock)) {
    throw new BlockValidationError();
  }
};

const isNewBlockTimestampInValidRange = (
  newBlock: Block,
  prevBlock: Block,
): boolean => {
  return (
    newBlock.timestamp > prevBlock.timestamp - 60000 &&
    newBlock.timestamp < prevBlock.timestamp + 60000
  );
};
