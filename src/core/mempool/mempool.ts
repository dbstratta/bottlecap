import { equals } from 'ramda';

import { broadcastTransaction } from '../broadcasting';
import {
  getUnspentTxOuts,
  OutPoint,
  Transaction,
  validateTransaction,
} from '../transactions';
import { getMempool, setMempool } from './persistence';
import { Mempool } from './types';
import { validateTransactionForMempool } from './validators';

export const addTransactionToMempool = (transaction: Transaction): Mempool => {
  const mempool = getMempool();
  const unspentTxOuts = getUnspentTxOuts();

  validateTransaction(transaction, unspentTxOuts);
  validateTransactionForMempool(transaction, mempool);

  const newMempool: Mempool = {
    transactions: [...mempool.transactions, transaction],
  };
  setMempool(newMempool);

  broadcastTransaction(transaction);

  return newMempool;
};

export const updateMempool = (
  confirmedTransactions: ReadonlyArray<Transaction>,
): Mempool => {
  const mempool = getMempool();
  const spentOutPoints: OutPoint[] = getSpentOutPoints(confirmedTransactions);

  const newMempoolTransactions = mempool.transactions.filter(
    mempoolTransaction =>
      !usesSpentOutPoint(mempoolTransaction, spentOutPoints),
  );

  const newMempool: Mempool = {
    ...mempool,
    transactions: newMempoolTransactions,
  };
  setMempool(newMempool);

  return newMempool;
};

const getSpentOutPoints = (
  transactions: ReadonlyArray<Transaction>,
): OutPoint[] =>
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
