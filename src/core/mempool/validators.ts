import { equals } from 'ramda';

import {
  OutPoint,
  Transaction,
  TransactionValidationError,
} from '../transactions';
import { Mempool } from './types';

export const validateTransactionForMempool = (
  transaction: Transaction,
  mempool: Mempool,
): void => {
  const transactionOutPoints: OutPoint[] = transaction.txIns.map(
    txIn => txIn.prevOutPoint,
  );

  if (mempoolContainsOutPoints(mempool, transactionOutPoints)) {
    throw new TransactionValidationError();
  }
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
