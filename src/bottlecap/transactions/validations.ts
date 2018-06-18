import { ec as EC } from 'elliptic';

import { getUnspentTxOut } from './helpers';
import { Transaction, TxIn, UnspentTxOut } from './transaction';
import { getTransactionId } from './transactions';

const ec = new EC('secp256k1');

export const isTransactionValid = (
  transaction: Transaction,
  unspentTxOuts: UnspentTxOut[],
): boolean =>
  isTransactionIdValid(transaction) &&
  transaction.txIns.every(txIn =>
    isTxInValid(txIn, transaction, unspentTxOuts),
  );

export const isTransactionIdValid = (transaction: Transaction): boolean =>
  transaction.id ===
  getTransactionId(
    transaction.txIns.map(txIn => txIn.prevOutPoint),
    transaction.txOuts,
  );

export const isTxInValid = (
  txIn: TxIn,
  transaction: Transaction,
  unspentTxOuts: UnspentTxOut[],
): boolean => {
  const referencedTxOut = getUnspentTxOut(txIn.prevOutPoint, unspentTxOuts);

  if (!referencedTxOut) {
    return false;
  }

  const { address } = referencedTxOut;
  const key = ec.keyFromPublic(address, 'hex');

  return key.verify(transaction.id, txIn.signature);
};
