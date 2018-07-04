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
  readonly id: string;
  readonly txIns: TxIn[];
  readonly txOuts: TxOut[];
};

export type TxIn = {
  readonly prevOutPoint: OutPoint;
  /**
   * The signature of the `prevOutPoint`
   * of the `TxIn` signed by the creator
   * of the `Transaction`.
   */
  readonly signature: Signature;
};

/**
 * An OutPoint is a coordinate in a transaction
 * that points to a TxOut.
 */
export type OutPoint = {
  /**
   * The ID of the transaction the OutPoint points to.
   */
  readonly txId: string;
  /**
   * The index of the TxOut in the transaction
   * the OutPoint points to.
   */
  readonly txOutIndex: number;
};

export type TxOut = {
  readonly address: PublicKey;
  readonly amount: number;
};

/**
 * An `UnspentTxOut` points to a `TxOut`
 * that hasn't been spended yet.
 */
export type UnspentTxOut = {
  readonly outPoint: OutPoint;
  readonly address: PublicKey;
  readonly amount: number;
};

/**
 * A `CoinbaseTransaction` is the transaction
 * that rewards the miner for mining the block.
 */
export type CoinbaseTransaction = {
  readonly id: string;
  readonly blockIndex: number;
  readonly txOut: TxOut;
};
