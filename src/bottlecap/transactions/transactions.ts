import { createHash } from 'crypto';

import { ec as EC } from 'elliptic';

import { OutPoint, Transaction, TxOut } from './transaction';

const ec = new EC('secp256k1');

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

  return createHash('sha256')
    .update(stringToHash)
    .digest('hex');
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
  privateKey: string,
): string => {
  const key = ec.keyFromPrivate(privateKey, 'hex');

  const signature: string = key.sign(prevOutPoint.txId).toDER('hex');
  return signature;
};

export const getUnspentOutPoints = (
  transactions: Transaction[],
  oldUnspentOutPoints: OutPoint[],
): OutPoint[] => {
  const newUnspentOutPoints = getNewUnspentOutPoints(transactions);
  const spentOutPoints = getNewSpentOutPoints(transactions);

  const isOutPointSpent = (outPoint: OutPoint) =>
    spentOutPoints.includes(outPoint);

  return oldUnspentOutPoints
    .filter(isOutPointSpent)
    .concat(newUnspentOutPoints);
};

const getNewUnspentOutPoints = (transactions: Transaction[]): OutPoint[] =>
  transactions.flatMap(transaction =>
    transaction.txOuts.map(
      (txOut, index: number): OutPoint => ({
        txId: transaction.id,
        txOutIndex: index,
      }),
    ),
  );

const getNewSpentOutPoints = (transactions: Transaction[]): OutPoint[] =>
  transactions
    .flatMap(transaction => transaction.txIns)
    .map(txIn => txIn.prevOutPoint);
