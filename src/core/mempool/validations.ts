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
