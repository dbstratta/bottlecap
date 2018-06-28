import { equals } from 'ramda';

import { PrivateKey, sign } from '../ellipticCurveCrypto';
import { genesisUnspentTxOut } from './genesis';
import {
  CoinbaseTransaction,
  OutPoint,
  Transaction,
  TxOut,
  UnspentTxOut,
} from './transaction';

let unspentTxOuts: UnspentTxOut[] = [genesisUnspentTxOut];

export const signTxIn = (
  transactionId: string,
  privateKey: PrivateKey,
): string => sign(privateKey, transactionId);

export const getUnspentTxOuts = (): UnspentTxOut[] => unspentTxOuts;

export const updateUnspentTxOuts = (
  coinbaseTransaction: CoinbaseTransaction | null,
  transactions: Transaction[],
): UnspentTxOut[] => {
  unspentTxOuts = getUpdatedUnspentTxOuts(
    coinbaseTransaction,
    transactions,
    unspentTxOuts,
  );

  return unspentTxOuts;
};

const getUpdatedUnspentTxOuts = (
  coinbaseTransaction: CoinbaseTransaction | null,
  transactions: Transaction[],
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
  coinbaseTransaction: CoinbaseTransaction | null,
  transactions: Transaction[],
): UnspentTxOut[] => {
  const unspentTxOutFromCoinbaseTransaction =
    coinbaseTransaction &&
    getUnspentTxOutFromCoinbaseTransaction(coinbaseTransaction);

  const unspentTxOutsFromTransactions = getUnspentTxOutsFromTransactions(
    transactions,
  );

  if (unspentTxOutFromCoinbaseTransaction) {
    return [
      unspentTxOutFromCoinbaseTransaction,
      ...unspentTxOutsFromTransactions,
    ];
  }

  return unspentTxOutsFromTransactions;
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
  transactions: Transaction[],
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

const getNewSpentOutPoints = (transactions: Transaction[]): OutPoint[] =>
  transactions
    .flatMap(transaction => transaction.txIns)
    .map(txIn => txIn.prevOutPoint);
