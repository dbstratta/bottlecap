import {
  Block,
  BlockData,
  findBlock,
  genesisBlock,
  validateNewBlock,
} from '../blocks';
import { PublicKey } from '../ellipticCurveCrypto';
import logger from '../logger';
import { getMempool, Mempool, updateMempool } from '../mempool';
import { broadcastActiveBlockchain } from '../p2p';
import {
  COINBASE_AMOUNT,
  CoinbaseTransaction,
  getCoinbaseTransactionId,
  getUnspentTxOuts,
  TxOut,
  updateUnspentTxOuts,
} from '../transactions';
import { getPublicKey } from '../wallets';
import {
  getDifficulty,
  getLatestBlock,
  hasMoreCumulativeDifficulty,
} from './helpers';
import { Blockchain } from './types';
import { validateBlockchain } from './validators';

let activeBlockchain: Blockchain = [genesisBlock];

export const getActiveBlockchain = (): Blockchain => activeBlockchain;

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

export const mineNextBlock = async (): Promise<Block> => {
  const latestBlock = getLatestBlock(activeBlockchain);
  const minerAddress: PublicKey = await getPublicKey();
  const mempool: Mempool = getMempool();

  const index = getNextBlockIndex(latestBlock);
  const data = getNextBlockData(minerAddress, index, mempool);
  const prevHash = latestBlock.hash;
  const timestamp = Date.now();
  const difficulty = getDifficulty(activeBlockchain);

  const block = findBlock({ index, data, prevHash, timestamp, difficulty });

  addBlockToActiveBlockchain(block);
  logger.info(`Block ${block.index} mined!`);

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

export const addBlockToActiveBlockchain = (block: Block): Blockchain => {
  const latestBlock = getLatestBlock(activeBlockchain);
  const unspentTxOuts = getUnspentTxOuts();

  validateNewBlock(block, latestBlock, unspentTxOuts);

  activeBlockchain = [...activeBlockchain, block];
  updateUnspentTxOuts(block.data.coinbaseTransaction, block.data.transactions);
  updateMempool(block.data.transactions);
  broadcastActiveBlockchain(activeBlockchain);

  return activeBlockchain;
};
