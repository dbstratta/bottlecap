import { equals } from 'ramda';

import { generateKeyPair, KeyPair, PublicKey } from '../crypto';
import { Mempool } from '../mempool';
import { OutPoint, UnspentTxOut } from '../transactions';
import { Wallet } from './types';

/**
 * Returns a new wallet with a random key pair.
 */
export const createWallet = (): Wallet => {
  const keyPair: KeyPair = generateKeyPair();
  const wallet: Wallet = { keyPair };

  return wallet;
};

/**
 * Returns `true` if the unspent tx out references
 * an out point contained in the mempool.
 * `false` otherwise.
 */
export const usesOutPointInMempool = (
  unspentTxOut: UnspentTxOut,
  mempool: Mempool,
): boolean => {
  const outPoint = unspentTxOut.outPoint;
  const mempoolOutPoints: OutPoint[] = mempool.transactions
    .flatMap(transaction => transaction.txIns)
    .map(txIn => txIn.prevOutPoint);

  return !!mempoolOutPoints.find(equals(outPoint));
};

/**
 * Returns `true` if the unspent tx out
 * belongs to the address.
 */
export const isUnspentTxOutsOfAddress = (
  unspentTxOut: UnspentTxOut,
  address: PublicKey,
): boolean => unspentTxOut.address === address;
