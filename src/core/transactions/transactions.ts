import { equals } from 'ramda';

import { PrivateKey, sign } from '../ellipticCurveCrypto';
import {
  CoinbaseTransaction,
  OutPoint,
  Transaction,
  TxOut,
  UnspentTxOut,
} from './transaction';

const genesisUnspentTxOut: UnspentTxOut = {
  outPoint: { txId: '', txOutIndex: 0 },
  address:
    '04e7df14239a29c81c819c485c2904bfea3bbce9a48b234a6f0d1276622eb07fede86fb35f1a23948d40b3802409b103f9d9ddbeb856f2424317cb3485eb42d5b6',
  amount: 10,
};
let unspentTxOuts: UnspentTxOut[] = [genesisUnspentTxOut];

export const signTxIn = (
  prevOutPoint: OutPoint,
  privateKey: PrivateKey,
): string => sign(privateKey, prevOutPoint.txId);

export const getUnspentTxOuts = (): UnspentTxOut[] => unspentTxOuts;

export const updateUnspentTxOuts = (
  coinbaseTransaction: CoinbaseTransaction,
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
  coinbaseTransaction: CoinbaseTransaction,
  transactions: Transaction[],
  oldUnspentTxOuts: UnspentTxOut[],
): UnspentTxOut[] => {
  const newUnspentTxOuts = getNewUnspentTxOuts(
    coinbaseTransaction,
    transactions,
  );
  const spentOutPoints = getNewSpentOutPoints(transactions);

  const isUnspentTxOutSpent = (unspentTxOut: UnspentTxOut) =>
    !!spentOutPoints.find(equals(unspentTxOut.outPoint));

  return oldUnspentTxOuts.filter(isUnspentTxOutSpent).concat(newUnspentTxOuts);
};

const getNewUnspentTxOuts = (
  coinbaseTransaction: CoinbaseTransaction,
  transactions: Transaction[],
): UnspentTxOut[] => {
  const unspentTxOutFromCoinbaseTransaction = getUnspentTxOutFromCoinbaseTransaction(
    coinbaseTransaction,
  );

  const unspentTxOutsFromTransactions = getUnspentTxOutsFromTransactions(
    transactions,
  );

  return [unspentTxOutFromCoinbaseTransaction].concat(
    unspentTxOutsFromTransactions,
  );
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
