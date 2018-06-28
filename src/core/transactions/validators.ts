import { verify } from '../ellipticCurveCrypto';
import { COINBASE_AMOUNT } from './constants';
import {
  CoinbaseTransactionValidationError,
  TransactionValidationError,
} from './errors';
import {
  getCoinbaseTransactionId,
  getTransactionId,
  getUnspentTxOut,
} from './helpers';
import { CoinbaseTransaction, Transaction, TxIn, UnspentTxOut } from './types';

export const validateTransaction = (
  transaction: Transaction,
  unspentTxOuts: UnspentTxOut[],
): void => {
  validateTransactionId(transaction);
  validateTransactionTxIns(transaction, unspentTxOuts);
};

const validateTransactionTxIns = (
  transaction: Transaction,
  unspentTxOuts: UnspentTxOut[],
): void => {
  transaction.txIns.forEach(txIn =>
    validateTxIn(txIn, transaction, unspentTxOuts),
  );
};

export const validateTxIn = (
  txIn: TxIn,
  transaction: Transaction,
  unspentTxOuts: UnspentTxOut[],
): void => {
  const referencedTxOut = getUnspentTxOut(txIn.prevOutPoint, unspentTxOuts);

  if (!referencedTxOut) {
    throw new TransactionValidationError('invalid transaction txIn');
  }

  const { address } = referencedTxOut;

  if (!verify(address, txIn.signature, transaction.id)) {
    throw new TransactionValidationError('invalid transaction txIn signature');
  }
};

export const validateTransactionId = (transaction: Transaction): void => {
  const expectedTransactionId = getTransactionId(
    transaction.txIns.map(txIn => txIn.prevOutPoint),
    transaction.txOuts,
  );

  if (transaction.id !== expectedTransactionId) {
    throw new TransactionValidationError('invalid transaction ID');
  }
};

export const validateCoinbaseTransaction = (
  coinbaseTransaction: CoinbaseTransaction,
  blockIndex: number,
): void => {
  validateCoinbaseTransactionId(coinbaseTransaction);
  validateCoinbaseTransactionAmount(coinbaseTransaction);
  validateCoinbaseTransactionBlockIndex(coinbaseTransaction, blockIndex);
};

const validateCoinbaseTransactionId = (
  coinbaseTransaction: CoinbaseTransaction,
): void => {
  const expectedCoinbaseTransactionId = getCoinbaseTransactionId(
    coinbaseTransaction.blockIndex,
    coinbaseTransaction.txOut,
  );

  if (coinbaseTransaction.id !== expectedCoinbaseTransactionId) {
    throw new CoinbaseTransactionValidationError(
      'invalid coinbase transaction ID',
    );
  }
};

const validateCoinbaseTransactionAmount = (
  coinbaseTransaction: CoinbaseTransaction,
): void => {
  if (coinbaseTransaction.txOut.amount !== COINBASE_AMOUNT) {
    throw new CoinbaseTransactionValidationError(
      'invalid coinbase transaction txOut amount',
    );
  }
};

const validateCoinbaseTransactionBlockIndex = (
  coinbaseTransaction: CoinbaseTransaction,
  blockIndex: number,
): void => {
  if (coinbaseTransaction.blockIndex !== blockIndex) {
    throw new CoinbaseTransactionValidationError(
      'invalid coinbase transaction block index',
    );
  }
};
