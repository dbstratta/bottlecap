import { equals } from 'ramda';

import { sha256 } from '../helpers';
import { OutPoint, TxOut, UnspentTxOut } from './types';

/**
 * Given an outPoint and a list of unspentTxOuts,
 * returns the unspentTxOut that matches the outPoint.
 * If no unspentTxOut matches the outPoint, returns `undefined`.
 */
export const getUnspentTxOut = (
  outPoint: OutPoint,
  unspentTxOuts: UnspentTxOut[],
): UnspentTxOut | undefined =>
  unspentTxOuts.find(unspentTxOut => equals(unspentTxOut.outPoint, outPoint));

/**
 * Returns the ID (sha256) of a transaction.
 */
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

/**
 * Returns the ID (sha256) of a coinbase transaction.
 */
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
