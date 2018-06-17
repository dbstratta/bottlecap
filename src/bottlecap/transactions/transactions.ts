import { createHash } from 'crypto';

// @ts-ignore
import { ec as EC } from 'elliptic';
import { compose, find, join, map, toString } from 'ramda';

import {
  Transaction,
  TxIn,
  TxOut,
  UnsignedTxIn,
  UnspentTxOut,
} from './transaction';

const ec = new EC('secp256k1');

export const getTransactionId = (
  unsignedTxIns: UnsignedTxIn[],
  txOuts: TxOut[],
): string => {
  const hashableDataFromTxIns: string = getHashableDataFromUnsignedTxIns(
    unsignedTxIns,
  );
  const hashableDataFromTxOuts: string = getHashableDataFromTxOuts(txOuts);

  return createHash('sha256')
    .update(hashableDataFromTxIns + hashableDataFromTxOuts)
    .digest('hex');
};

const getHashableDataFromUnsignedTxIns: (
  unsignedTxIns: UnsignedTxIn[],
) => string = compose(
  join(''),
  map(
    (unsignedTxIn: UnsignedTxIn) =>
      unsignedTxIn.txOutId + toString(unsignedTxIn.txOutIndex),
  ),
);

const getHashableDataFromTxOuts: (txOuts: TxOut[]) => string = compose(
  join(''),
  map((txOut: TxOut) => txOut.address + toString(txOut.amount)),
);

const signTxIn = (
  unsignedTxIn: UnsignedTxIn,
  txId: string,
  privateKey: string,
  unspentTxOuts: UnspentTxOut[],
): string | null => {
  const referencedUnspentTxOut: UnspentTxOut | undefined = getUnspentTxOut(
    unsignedTxIn.txOutId,
    unsignedTxIn.txOutIndex,
    unspentTxOuts,
  );

  if (!referencedUnspentTxOut) {
    return null;
  }

  const { address: referencedAddress } = referencedUnspentTxOut;
  const key = ec.keyFromPrivate(privateKey, 'hex');
  const publicKey: string = key.getPublic().encode('hex');

  if (publicKey !== referencedAddress) {
    return null;
  }

  const signature: string = key.sign(txId).toDER('hex');
  return signature;
};

const getUnspentTxOut = (
  txOutId: string,
  txOutIndex: number,
  unspentTxOuts: UnspentTxOut[],
): UnspentTxOut | undefined => {
  const pred = (unspentTxOut: UnspentTxOut) =>
    unspentTxOut.txOutId === txOutId && unspentTxOut.txOutIndex === txOutIndex;

  return find(pred, unspentTxOuts);
};
