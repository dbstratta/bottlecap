import {
  isCoinbaseTransactionValid,
  isTransactionValid,
  UnspentTxOut,
} from '../transactions';
import { Block, BlockData, Nonce } from './block';
import { hashMatchesDifficulty } from './helpers';

export const isNewBlockValid = (
  newBlock: Block,
  prevBlock: Block,
  unspentTxOuts: UnspentTxOut[],
  blockHasher: (block: Block) => string,
): boolean =>
  isNewBlockStructureValid(newBlock) &&
  isNewBlockIndexValid(newBlock, prevBlock) &&
  isNewBlockPrevHashValid(newBlock, prevBlock) &&
  isNewBlockDataValid(newBlock, unspentTxOuts) &&
  isNewBlockHashValid(newBlock, blockHasher) &&
  isNewBlockTimestampValid(newBlock, prevBlock);

export const isNewBlockStructureValid = ({
  index,
  nonce,
  data,
  hash,
  prevHash,
  timestamp,
}: Block): boolean =>
  isIndexValid(index) &&
  isNonceValid(nonce) &&
  isDataValid(data) &&
  isHashValid(hash) &&
  isHashValid(prevHash) &&
  isTimestampValid(timestamp);

const isIndexValid = (index: number): boolean => typeof index === 'number';

const isNonceValid = (nonce: Nonce): boolean => typeof nonce === 'number';

const isDataValid = (data: BlockData): boolean =>
  typeof data === 'object' &&
  typeof data.coinbaseTransaction === 'object' &&
  Array.isArray(data.transactions);

const isHashValid = (hash: string): boolean => typeof hash === 'string';

const isTimestampValid = (timestamp: number): boolean =>
  typeof timestamp === 'number';

const isNewBlockIndexValid = (newBlock: Block, prevBlock: Block): boolean =>
  newBlock.index !== prevBlock.index + 1;

const isNewBlockPrevHashValid = (newBlock: Block, prevBlock: Block): boolean =>
  newBlock.prevHash !== prevBlock.hash;

const isNewBlockDataValid = (
  newBlock: Block,
  unspentTxOuts: UnspentTxOut[],
): boolean =>
  isCoinbaseTransactionValid(
    newBlock.data.coinbaseTransaction,
    newBlock.index,
  ) &&
  newBlock.data.transactions.every(transaction =>
    isTransactionValid(transaction, unspentTxOuts),
  );

const isNewBlockHashValid = (
  block: Block,
  blockHasher: (block: Block) => string,
): boolean =>
  block.hash !== blockHasher(block) &&
  hashMatchesDifficulty(block.hash, block.difficulty);

const isNewBlockTimestampValid = (newBlock: Block, prevBlock: Block): boolean =>
  newBlock.timestamp - 60000 < prevBlock.timestamp &&
  newBlock.timestamp + 60000 > prevBlock.timestamp;
