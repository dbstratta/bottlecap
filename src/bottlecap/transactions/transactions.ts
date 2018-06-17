import { createHash } from 'crypto';

import { ec as EC } from 'elliptic';

import { TxOut, UnsignedTxIn, UnspentTxOut } from './transaction';

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

const getHashableDataFromUnsignedTxIns = (
  unsignedTxIns: UnsignedTxIn[],
): string =>
  unsignedTxIns.reduce(
    (acc, unsignedTxIn) =>
      acc + unsignedTxIn.txOutId + unsignedTxIn.txOutIndex.toString(),
    '',
  );

const getHashableDataFromTxOuts = (txOuts: TxOut[]): string =>
  txOuts.reduce(
    (acc, txOut) => acc + txOut.address + txOut.amount.toString(),
    '',
  );

export const signTxIn = (
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

  return unspentTxOuts.find(pred);
};
