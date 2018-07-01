import {
  Block,
  BlockData,
  findBlock,
  genesisBlock,
  validateNewBlock,
} from '../blocks';
import { PublicKey } from '../crypto';
import logger from '../logger';
import { getMempool, Mempool, updateMempool } from '../mempool';
import { broadcastActiveBlockchain, broadcastLatestBlock } from '../p2p';
import {
  COINBASE_AMOUNT,
  CoinbaseTransaction,
  getCoinbaseTransactionId,
  getUnspentTxOuts,
  TxOut,
  updateUnspentTxOuts,
} from '../transactions';
import { getCurrentWallet } from '../wallets';
import {
  getDifficulty,
  getLatestBlock,
  hasMoreCumulativeDifficulty,
} from './helpers';
import { Blockchain } from './types';
import { validateBlockchain } from './validators';

let activeBlockchain: Blockchain = [genesisBlock];

/**
 * Returns the active blockchain.
 */
export const getActiveBlockchain = (): Blockchain => activeBlockchain;

/**
 * Replaces the active blockchain if the other
 * blockchain has more cumulative difficulty.
 */
export const maybeReplaceActiveBlockchain = (
  blockchain: Blockchain,
): Blockchain => {
  const unspentTxOuts = getUnspentTxOuts();

  validateBlockchain(blockchain, unspentTxOuts);

  if (hasMoreCumulativeDifficulty(blockchain, activeBlockchain)) {
    activeBlockchain = blockchain;
    broadcastActiveBlockchain(activeBlockchain);

    return activeBlockchain;
  }

  return activeBlockchain;
};

/**
 * Mines the next in the active blockchain.
 */
export const mineNextBlock = (): Block => {
  const latestBlock = getLatestBlock(activeBlockchain);
  const minerAddress: PublicKey = getCurrentWallet().keyPair.publicKey;
  const mempool: Mempool = getMempool();

  const index = getNextBlockIndex(latestBlock);
  const data = getNextBlockData(minerAddress, index, mempool);
  const prevHash = latestBlock.hash;
  const timestamp = Date.now();
  const difficulty = getDifficulty(activeBlockchain);

  const block = findBlock({ index, data, prevHash, timestamp, difficulty });
  logger.info(`Block ${block.index} mined!`);

  addBlockToActiveBlockchain(block);

  return block;
};

const getNextBlockIndex = (latestBlock: Block) => latestBlock.index + 1;

const getNextBlockData = (
  minerAddress: PublicKey,
  blockIndex: number,
  mempool: Mempool,
): BlockData => {
  const coinbaseTransaction = getNextCoinbaseTransaction(
    minerAddress,
    blockIndex,
  );

  const transactions = mempool.transactions;

  return {
    coinbaseTransaction,
    transactions,
  };
};

const getNextCoinbaseTransaction = (
  minerAddress: PublicKey,
  blockIndex: number,
): CoinbaseTransaction => {
  const txOut: TxOut = { address: minerAddress, amount: COINBASE_AMOUNT };
  const id: string = getCoinbaseTransactionId(blockIndex, txOut);

  return { id, blockIndex, txOut };
};

/**
 * Adds a block to the active blockchain.
 * Throws if the block is invalid.
 */
export const addBlockToActiveBlockchain = (block: Block): Blockchain => {
  const latestBlock = getLatestBlock(activeBlockchain);
  const unspentTxOuts = getUnspentTxOuts();

  validateNewBlock(block, latestBlock, unspentTxOuts);

  activeBlockchain = [...activeBlockchain, block];
  updateUnspentTxOuts(block.data.coinbaseTransaction, block.data.transactions);
  updateMempool(block.data.transactions);
  broadcastLatestBlock(block);
  logger.info(`Block ${block.index} broadcast`);

  return activeBlockchain;
};
