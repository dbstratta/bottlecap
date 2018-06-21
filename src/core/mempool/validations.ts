import { equals } from 'ramda';

import { OutPoint, Transaction } from '../transactions';
import { Mempool } from './mempool';

export const isTransactionForMempoolValid = (
  transaction: Transaction,
  mempool: Mempool,
): boolean => {
  const transactionOutPoints: OutPoint[] = transaction.txIns.map(
    txIn => txIn.prevOutPoint,
  );

  return !mempoolContainsOutPoints(mempool, transactionOutPoints);
};

const mempoolContainsOutPoints = (
  mempool: Mempool,
  outPoints: OutPoint[],
): boolean => {
  const mempoolOutPoints: OutPoint[] = mempool.transactions
    .flatMap(transaction => transaction.txIns)
    .map(txIn => txIn.prevOutPoint);

  return outPoints.some(outPoint => !!mempoolOutPoints.find(equals(outPoint)));
};

export const updateMempool = (
  mempool: Mempool,
  confirmedTransactions: Transaction[],
): Mempool => {
  const spentOutPoints: OutPoint[] = getSpentOutPoints(confirmedTransactions);

  return {
    transactions: mempool.transactions.filter(
      mempoolTransaction =>
        !usesSpentOutPoint(mempoolTransaction, spentOutPoints),
    ),
  };
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
