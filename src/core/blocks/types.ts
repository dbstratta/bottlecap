import { CoinbaseTransaction, Transaction } from '../transactions';

/**
 * A `Nonce` is an integer contained in a block that has to be
 * searched so that the block's hash passes the proof of work.
 */
export type Nonce = number;

export type Block = {
  /**
   * The index of the `Block` in the `Blockchain`.
   */
  index: number;
  nonce: Nonce;
  data: BlockData;
  /**
   * The hash of the previous `Block` in the `Blockchain`.
   */
  prevHash: string;
  hash: string;
  timestamp: number;
  /**
   * The difficulty (amount of work) of the hash of the `Block`.
   */
  difficulty: number;
};

export type BlockData = {
  coinbaseTransaction: CoinbaseTransaction;
  transactions: Transaction[];
};

/**
 * The arguments to be passed to `findBlock`.
 */
export type FindBlockArgs = {
  index: number;
  data: BlockData;
  prevHash: string;
  timestamp: number;
  difficulty: number;
};
