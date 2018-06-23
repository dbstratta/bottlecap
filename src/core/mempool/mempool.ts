import { equals } from 'ramda';

import {
  isTransactionValid,
  OutPoint,
  Transaction,
  UnspentTxOut,
} from '../transactions';
import { isTransactionForMempoolValid } from './validations';

export type Mempool = {
  transactions: Transaction[];
};

const mempool: Mempool = {
  transactions: [],
};

export const getMempool = (): Mempool => mempool;

export const addTransactionToMemPool = (
  transaction: Transaction,
  unspentTxOuts: UnspentTxOut[],
): Mempool => {
  if (
    !isTransactionForMempoolValid(transaction, mempool) ||
    isTransactionValid(transaction, unspentTxOuts)
  ) {
    throw new Error('invalid transaction');
  }

  mempool.transactions = mempool.transactions.concat([transaction]);

  return mempool;
};

export const updateMempool = (
  confirmedTransactions: Transaction[],
): Mempool => {
  const spentOutPoints: OutPoint[] = getSpentOutPoints(confirmedTransactions);

  mempool.transactions = mempool.transactions.filter(
    mempoolTransaction =>
      !usesSpentOutPoint(mempoolTransaction, spentOutPoints),
  );

  return mempool;
};

const getSpentOutPoints = (transactions: Transaction[]): OutPoint[] =>
  transactions
    .flatMap(transaction => transaction.txIns)
    .map(txIn => txIn.prevOutPoint);

const usesSpentOutPoint = (
  mempoolTransaction: Transaction,
  spentOutPoints: OutPoint[],
): boolean =>
  mempoolTransaction.txIns.some(
    txIn => !!spentOutPoints.find(equals(txIn.prevOutPoint)),
  );
