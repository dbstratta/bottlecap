import { equals } from 'ramda';

import { broadcastTransaction } from '../p2p';
import {
  getUnspentTxOuts,
  OutPoint,
  Transaction,
  validateTransaction,
} from '../transactions';
import { Mempool } from './types';
import { validateTransactionForMempool } from './validators';

const mempool: Mempool = {
  transactions: [],
};

export const getMempool = (): Mempool => mempool;

export const addTransactionToMempool = (transaction: Transaction): Mempool => {
  const unspentTxOuts = getUnspentTxOuts();

  validateTransaction(transaction, unspentTxOuts);
  validateTransactionForMempool(transaction, mempool);

  mempool.transactions = [...mempool.transactions, transaction];
  broadcastTransaction(transaction);

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
