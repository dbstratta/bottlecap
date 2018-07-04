import { equals } from 'ramda';

import { genesisUnspentTxOut } from './genesis';
import {
  CoinbaseTransaction,
  OutPoint,
  Transaction,
  TxOut,
  UnspentTxOut,
} from './types';

let unspentTxOuts: UnspentTxOut[] = [genesisUnspentTxOut];

export const getUnspentTxOuts = (): UnspentTxOut[] => unspentTxOuts;

export const updateUnspentTxOuts = (
  coinbaseTransaction: CoinbaseTransaction,
  transactions: ReadonlyArray<Transaction>,
): UnspentTxOut[] => {
  const updatedUnspentTxOuts = getUpdatedUnspentTxOuts(
    coinbaseTransaction,
    transactions,
    unspentTxOuts,
  );

  return setUnspentTxOuts(updatedUnspentTxOuts);
};

const getUpdatedUnspentTxOuts = (
  coinbaseTransaction: CoinbaseTransaction,
  transactions: ReadonlyArray<Transaction>,
  oldUnspentTxOuts: UnspentTxOut[],
): UnspentTxOut[] => {
  const newUnspentTxOuts = getNewUnspentTxOuts(
    coinbaseTransaction,
    transactions,
  );
  const spentOutPoints = getNewSpentOutPoints(transactions);

  const isUnspentTxOutSpent = (unspentTxOut: UnspentTxOut) =>
    !spentOutPoints.find(equals(unspentTxOut.outPoint));

  return oldUnspentTxOuts.filter(isUnspentTxOutSpent).concat(newUnspentTxOuts);
};

const getNewUnspentTxOuts = (
  coinbaseTransaction: CoinbaseTransaction,
  transactions: ReadonlyArray<Transaction>,
): UnspentTxOut[] => {
  const unspentTxOutFromCoinbaseTransaction =
    coinbaseTransaction &&
    getUnspentTxOutFromCoinbaseTransaction(coinbaseTransaction);

  const unspentTxOutsFromTransactions = getUnspentTxOutsFromTransactions(
    transactions,
  );

  return [
    unspentTxOutFromCoinbaseTransaction,
    ...unspentTxOutsFromTransactions,
  ];
};

const getUnspentTxOutFromCoinbaseTransaction = (
  coinbaseTransaction: CoinbaseTransaction,
): UnspentTxOut => ({
  outPoint: {
    txId: coinbaseTransaction.id,
    txOutIndex: coinbaseTransaction.blockIndex,
  },
  amount: coinbaseTransaction.txOut.amount,
  address: coinbaseTransaction.txOut.address,
});

const getUnspentTxOutsFromTransactions = (
  transactions: ReadonlyArray<Transaction>,
): UnspentTxOut[] => transactions.flatMap(mapTransactionToUnspentTxOuts);

const mapTransactionToUnspentTxOuts = (
  transaction: Transaction,
): UnspentTxOut[] =>
  transaction.txOuts.map(mapTxOutToUnspentTxOut(transaction));

const mapTxOutToUnspentTxOut = (transaction: Transaction) => (
  txOut: TxOut,
  index: number,
): UnspentTxOut => ({
  outPoint: {
    txId: transaction.id,
    txOutIndex: index,
  },
  address: txOut.address,
  amount: txOut.amount,
});

const getNewSpentOutPoints = (
  transactions: ReadonlyArray<Transaction>,
): OutPoint[] =>
  transactions
    .flatMap(transaction => transaction.txIns)
    .map(txIn => txIn.prevOutPoint);

const setUnspentTxOuts = (newUnspentTxOuts: UnspentTxOut[]): UnspentTxOut[] => {
  unspentTxOuts = newUnspentTxOuts;
  return unspentTxOuts;
};
