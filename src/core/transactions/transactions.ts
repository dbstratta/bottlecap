import { equals } from 'ramda';

import { PrivateKey, sign } from '../ellipticCurveCrypto';
import { sha256 } from '../helpers';
import {
  CoinbaseTransaction,
  OutPoint,
  Transaction,
  TxOut,
  UnspentTxOut,
} from './transaction';

export const getTransactionId = (
  prevOutPoints: OutPoint[],
  txOuts: TxOut[],
): string => {
  const hashableStringFromPrevOutPoints: string = getHashableStringFromOutPoints(
    prevOutPoints,
  );
  const hashableStringFromTxOuts: string = getHashableStringFromTxOuts(txOuts);
  const stringToHash =
    hashableStringFromPrevOutPoints + hashableStringFromTxOuts;

  return sha256(stringToHash);
};

export const getCoinbaseTransactionId = (
  blockIndex: number,
  txOut: TxOut,
): string => {
  const hashableStringFromTxOut: string = getHashableStringFromTxOuts([txOut]);
  const stringToHash = blockIndex.toString() + hashableStringFromTxOut;

  return sha256(stringToHash);
};

const getHashableStringFromOutPoints = (outPoints: OutPoint[]): string =>
  outPoints.reduce(
    (acc, outPoint) => acc + outPoint.txId + outPoint.txOutIndex.toString(),
    '',
  );

const getHashableStringFromTxOuts = (txOuts: TxOut[]): string =>
  txOuts.reduce(
    (acc, txOut) => acc + txOut.address + txOut.amount.toString(),
    '',
  );

export const signTxIn = (
  prevOutPoint: OutPoint,
  privateKey: PrivateKey,
): string => sign(privateKey, prevOutPoint.txId);

export const getNewUnspentTxOuts = (
  coinbaseTransaction: CoinbaseTransaction,
  transactions: Transaction[],
  oldUnspentTxOuts: UnspentTxOut[],
): UnspentTxOut[] => {
  const newUnspentTxOuts = getUnspentTxOuts(coinbaseTransaction, transactions);
  const spentOutPoints = getSpentOutPoints(transactions);

  const isUnspentTxOutSpent = (unspentTxOut: UnspentTxOut) =>
    !!spentOutPoints.find(equals(unspentTxOut.outPoint));

  return oldUnspentTxOuts.filter(isUnspentTxOutSpent).concat(newUnspentTxOuts);
};

const getUnspentTxOuts = (
  coinbaseTransaction: CoinbaseTransaction,
  transactions: Transaction[],
): UnspentTxOut[] => {
  const unspentTxOutFromCoinbaseTransaction = getUnspentTxOutFromCoinbaseTransaction(
    coinbaseTransaction,
  );

  const unspentTxOutsFromRegularTransactions = getUnspentTxOutsFromRegularTransactions(
    transactions,
  );

  return [unspentTxOutFromCoinbaseTransaction].concat(
    unspentTxOutsFromRegularTransactions,
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

const getUnspentTxOutsFromRegularTransactions = (
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

const getSpentOutPoints = (transactions: Transaction[]): OutPoint[] =>
  transactions
    .flatMap(transaction => transaction.txIns)
    .map(txIn => txIn.prevOutPoint);
