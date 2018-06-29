import { PublicKey, Signature } from '../crypto';

/**
 * A `Transaction` is an interchange of
 * Bottlecaps between two parties.
 */
export type Transaction = {
  /**
   * The ID of a transaction is the hash
   * of its content.
   */
  id: string;
  txIns: TxIn[];
  txOuts: TxOut[];
};

export type TxIn = {
  prevOutPoint: OutPoint;
  /**
   * The signature of the `prevOutPoint`
   * of the `TxIn` signed by the creator
   * of the `Transaction`.
   */
  signature: Signature;
};

/**
 * An OutPoint is a coordinate in a transaction
 * that points to a TxOut.
 */
export type OutPoint = {
  /**
   * The ID of the transaction the OutPoint points to.
   */
  txId: string;
  /**
   * The index of the TxOut in the transaction
   * the OutPoint points to.
   */
  txOutIndex: number;
};

export type TxOut = {
  address: PublicKey;
  amount: number;
};

/**
 * An `UnspentTxOut` points to a `TxOut`
 * that hasn't been spended yet.
 */
export type UnspentTxOut = {
  outPoint: OutPoint;
  address: PublicKey;
  amount: number;
};

/**
 * A `CoinbaseTransaction` is the transaction
 * that rewards the miner for mining the block.
 */
export type CoinbaseTransaction = {
  id: string;
  blockIndex: number;
  txOut: TxOut;
};
