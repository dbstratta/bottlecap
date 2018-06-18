import { createHash } from 'crypto';

import { ec as EC } from 'elliptic';
import { equals } from 'ramda';

import { OutPoint, Transaction, TxOut, UnspentTxOut } from './transaction';

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

export const getNewUnspentTxOuts = (
  transactions: Transaction[],
  oldUnspentTxOuts: UnspentTxOut[],
): UnspentTxOut[] => {
  const newUnspentTxOuts = getUnspentTxOuts(transactions);
  const spentOutPoints = getSpentOutPoints(transactions);

  const isUnspentTxOutSpent = (unspentTxOut: UnspentTxOut) =>
    !!spentOutPoints.find(equals(unspentTxOut.outPoint));

  return oldUnspentTxOuts.filter(isUnspentTxOutSpent).concat(newUnspentTxOuts);
};

const getUnspentTxOuts = (transactions: Transaction[]): UnspentTxOut[] =>
  transactions.flatMap(transaction =>
    transaction.txOuts.map(
      (txOut, index: number): UnspentTxOut => ({
        outPoint: {
          txId: transaction.id,
          txOutIndex: index,
        },
        address: txOut.address,
        amount: txOut.amount,
      }),
    ),
  );

const getSpentOutPoints = (transactions: Transaction[]): OutPoint[] =>
  transactions
    .flatMap(transaction => transaction.txIns)
    .map(txIn => txIn.prevOutPoint);
