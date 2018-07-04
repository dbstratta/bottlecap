import { PublicKey, Signature } from '../crypto';

/**
 * A transaction is an interchange of
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

/**
 * A transaction input.
 */
export type TxIn = {
  readonly prevOutPoint: OutPoint;
  /**
   * The signature of the previous out point
   * of the transaction input signed by the creator
   * of the transaction.
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

/**
 * A transaction output.
 */
export type TxOut = {
  readonly address: PublicKey;
  readonly amount: number;
};

/**
 * An `UnspentTxOut` points to a `TxOut`
 * that hasn't been spent yet.
 */
export type UnspentTxOut = {
  readonly outPoint: OutPoint;
  readonly address: PublicKey;
  readonly amount: number;
};

/**
 * A coinbase transaction is the transaction
 * that rewards the miner for mining the block.
 *
 * It has no transaction inputs and only one
 * transaction output.
 */
export type CoinbaseTransaction = {
  readonly id: string;
  /**
   * The index of the block in the blockchain.
   */
  readonly blockIndex: number;
  readonly txOut: TxOut;
};
