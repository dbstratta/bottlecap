import { equals } from 'ramda';

import { PrivateKey, PublicKey, sign } from '../ellipticCurveCrypto';
import {
  CoinbaseTransaction,
  OutPoint,
  Transaction,
  TxOut,
  UnspentTxOut,
} from './transaction';

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

const getSpentOutPoints = (transactions: Transaction[]): OutPoint[] =>
  transactions
    .flatMap(transaction => transaction.txIns)
    .map(txIn => txIn.prevOutPoint);

export const filterUnspentTxOutsByAddress = (
  unspentTxOuts: UnspentTxOut[],
  address: PublicKey,
): UnspentTxOut[] => unspentTxOuts.filter(unspentTxOutBelongsToAdress(address));

const unspentTxOutBelongsToAdress = (address: PublicKey) => (
  unspentTxOut: UnspentTxOut,
): boolean => unspentTxOut.address === address;
