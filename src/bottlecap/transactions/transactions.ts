import { createHash } from 'crypto';

import { compose, join, map, toString } from 'ramda';

import { Transaction, TxIn, TxOut } from './transaction';

export const getTransactionId = (transaction: Transaction): string => {
  const hashableDataFromTxIns: string = getHashableDataFromTxIns(
    transaction.txIns,
  );
  const hashableDataFromTxOuts: string = getHashableDataFromTxOuts(
    transaction.txOuts,
  );

  return createHash('sha256')
    .update(hashableDataFromTxIns + hashableDataFromTxOuts)
    .digest('hex');
};

const getHashableDataFromTxIns: (txIns: TxIn[]) => string = compose(
  join(''),
  map((txIn: TxIn) => txIn.txOutId + toString(txIn.txOutIndex)),
);

const getHashableDataFromTxOuts: (txOuts: TxOut[]) => string = compose(
  join(''),
  map((txOut: TxOut) => txOut.address + toString(txOut.amount)),
);
