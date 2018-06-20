import { verify } from '../ellipticCurveCrypto';
import { getUnspentTxOut } from './helpers';
import {
  COINBASE_AMOUNT,
  CoinbaseTransaction,
  Transaction,
  TxIn,
  UnspentTxOut,
} from './transaction';
import { getCoinbaseTransactionId, getTransactionId } from './transactions';

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

  return verify(address, txIn.signature, transaction.id);
};

export const isCoinbaseTransactionValid = (
  coinbaseTransaction: CoinbaseTransaction,
  blockIndex: number,
): boolean =>
  isCoinbaseTransactionIdValid(coinbaseTransaction) &&
  isCoinbaseTransactionAmountValid(coinbaseTransaction) &&
  isCoinbaseTransactionBlockIndexValid(coinbaseTransaction, blockIndex);

const isCoinbaseTransactionIdValid = (
  coinbaseTransaction: CoinbaseTransaction,
): boolean =>
  coinbaseTransaction.id ===
  getCoinbaseTransactionId(
    coinbaseTransaction.blockIndex,
    coinbaseTransaction.txOut,
  );

const isCoinbaseTransactionAmountValid = (
  coinbaseTransaction: CoinbaseTransaction,
): boolean => coinbaseTransaction.txOut.amount === COINBASE_AMOUNT;

const isCoinbaseTransactionBlockIndexValid = (
  coinbaseTransaction: CoinbaseTransaction,
  blockIndex: number,
): boolean => coinbaseTransaction.blockIndex === blockIndex;
