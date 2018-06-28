import { sha256 } from '../helpers';
import {
  CoinbaseTransaction,
  // getCoinbaseTransactionId,
  TxOut,
} from '../transactions';
import {
  Block,
  BlockData,
  DIFFICULTY_ADJUSMENT_INTERVAL,
  Nonce,
} from './block';
import {
  hashMatchesDifficulty,
  nonceGenerator,
  stringifyHashableBlockContent,
} from './helpers';

type FindBlockArgs = {
  index: number;
  data: BlockData;
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

const genesisCoinbaseTransactionTxOut: TxOut = {
  address:
    '04e7df14239a29c81c819c485c2904bfea3bbce9a48b234a6f0d1276622eb07fede86fb35f1a23948d40b3802409b103f9d9ddbeb856f2424317cb3485eb42d5b6',
  amount: 10,
};
const genesisCoinbaseTransaction: CoinbaseTransaction = {
  id: '',
  blockIndex: 0,
  txOut: genesisCoinbaseTransactionTxOut,
};
export const genesisBlock = findBlock({
  index: 0,
  data: {
    coinbaseTransaction: genesisCoinbaseTransaction,
    transactions: [],
  },
  prevHash: '',
  difficulty: 1,
  timestamp: Date.now(),
});

export const isDifficultyAdjustmentBlock = (block: Block): boolean =>
  block.index % DIFFICULTY_ADJUSMENT_INTERVAL === 0 && block.index !== 0;

export const getTimeBetweenBlocks = (block1: Block, block2: Block): number =>
  block1.timestamp - block2.timestamp;
