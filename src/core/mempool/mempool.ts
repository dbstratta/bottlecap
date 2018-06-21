import { isTransactionValid, Transaction, UnspentTxOut } from '../transactions';
import { isTransactionForMempoolValid } from './validations';

export type Mempool = {
  transactions: Transaction[];
};

const INVALID_TRANSACTION_MSG = 'invalid transaction';

export const addTransactionToMemPool = (
  transaction: Transaction,
  mempool: Mempool,
  unspentTxOuts: UnspentTxOut[],
): Mempool => {
  if (
    !isTransactionForMempoolValid(transaction, mempool) ||
    isTransactionValid(transaction, unspentTxOuts)
  ) {
    throw new Error(INVALID_TRANSACTION_MSG);
  }

  return {
    transactions: mempool.transactions.concat([transaction]),
  };
};
