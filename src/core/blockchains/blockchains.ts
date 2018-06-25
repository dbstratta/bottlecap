import {
  Block,
  BlockData,
  EXPECTED_TIME_BETWEEN_BLOCKS,
  findBlock,
  genesisBlock,
  getTimeBetweenBlocks,
  isDifficultyAdjustmentBlock,
  isNewBlockValid,
} from '../blocks';
import { PublicKey } from '../ellipticCurveCrypto';
import { getMempool, Mempool } from '../mempool';
import { broadcastBlockchain } from '../p2p';
import {
  COINBASE_AMOUNT,
  CoinbaseTransaction,
  getCoinbaseTransactionId,
  getUnspentTxOuts,
  TxOut,
} from '../transactions';
import { getPublicKey, getWallet, Wallet } from '../wallets';
import { Blockchain } from './blockchain';
import { isBlockchainValid } from './validations';

let activeBlockchain: Blockchain = [genesisBlock];

export const getActiveBlockchain = (): Blockchain => activeBlockchain;

export const maybeReplaceActiveBlockchain = (
  blockchain: Blockchain,
): Blockchain => {
  const unspentTxOuts = getUnspentTxOuts();

  if (!isBlockchainValid(blockchain, unspentTxOuts)) {
    throw new Error('invalid blockchain');
  }

  if (hasMoreCumulativeDifficulty(blockchain, activeBlockchain)) {
    activeBlockchain = blockchain;
    broadcastBlockchain(activeBlockchain);

    return activeBlockchain;
  }

  return activeBlockchain;
};

const hasMoreCumulativeDifficulty = (
  blockchain1: Blockchain,
  blockchain2: Blockchain,
): boolean =>
  getCumulativeDifficulty(blockchain1) > getCumulativeDifficulty(blockchain2);

const getCumulativeDifficulty = (blockchain: Blockchain): number =>
  blockchain
    .map(block => block.difficulty)
    .map(difficulty => 2 ** difficulty)
    .reduce((acc, a) => acc + a);

export const mineNextBlock = async (): Promise<Block> => {
  const latestBlock = getLatestBlock(activeBlockchain);
  const wallet: Wallet = await getWallet();
  const minerAddress: PublicKey = getPublicKey(wallet);
  const mempool: Mempool = getMempool();

  const index = getNextBlockIndex(latestBlock);
  const data = getNextBlockData(minerAddress, index, mempool);
  const prevHash = latestBlock.hash;
  const timestamp = Date.now();
  const difficulty = getDifficulty(activeBlockchain);

  const block = findBlock({ index, data, prevHash, timestamp, difficulty });

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

const addBlockToActiveBlockchain = (block: Block): Blockchain => {
  const latestBlock = getLatestBlock(activeBlockchain);
  const unspentTxOuts = getUnspentTxOuts();

  const isBlockValid = isNewBlockValid(block, latestBlock, unspentTxOuts);

  if (!isBlockValid) {
    throw new Error('invalid block');
  }

  activeBlockchain = activeBlockchain.concat([block]);
  return activeBlockchain;
};

const getDifficulty = (blockchain: Blockchain): number => {
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

  if (
    tookTooLittle(timeBetweenBlocks) &&
    prevDifficultyAdjustmentBlock.difficulty > 0
  ) {
    return prevDifficultyAdjustmentBlock.difficulty - 1;
  }

  return prevDifficultyAdjustmentBlock.difficulty;
};

const tookTooLong = (timeBetweenBlocks: number): boolean =>
  timeBetweenBlocks < EXPECTED_TIME_BETWEEN_BLOCKS / 2;

const tookTooLittle = (timeBetweenBlocks: number): boolean =>
  timeBetweenBlocks > EXPECTED_TIME_BETWEEN_BLOCKS * 2;
