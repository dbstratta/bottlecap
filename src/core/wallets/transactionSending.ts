import { PublicKey } from '../crypto';
import logger from '../logger';
import { addTransactionToMempool, getMempool, Mempool } from '../mempool';
import {
  getTransactionId,
  getUnspentTxOuts,
  OutPoint,
  signTxIn,
  Transaction,
  TxIn,
  TxOut,
  UnspentTxOut,
} from '../transactions';
import { WalletError } from './errors';
import { isUnspentTxOutsOfAddress, usesOutPointInMempool } from './helpers';
import { getCurrentWallet } from './persistance';
import { Wallet } from './types';

/**
 * Sends an amount of Bottlecap to the
 * given address.
 */
export const sendToAddress = async (
  toAddress: PublicKey,
  amount: number,
): Promise<Transaction> => {
  const wallet: Wallet = getCurrentWallet();
  const unspentTxOuts = getUnspentTxOuts();
  const mempool = getMempool();

  const transaction = createTransaction(
    wallet,
    toAddress,
    amount,
    unspentTxOuts,
    mempool,
  );

  return sendTransaction(transaction);
};

const createTransaction = (
  wallet: Wallet,
  toAddress: PublicKey,
  amount: number,
  unspentTxOuts: UnspentTxOut[],
  mempool: Mempool,
): Transaction => {
  const fromAddress: PublicKey = wallet.keyPair.publicKey;
  const { outPoints, amountToSendBack } = getOutPointsToSpend(
    fromAddress,
    amount,
    unspentTxOuts,
    mempool,
  );

  const txOuts = createTxOuts(toAddress, fromAddress, amount, amountToSendBack);
  const transactionId = getTransactionId(outPoints, txOuts);
  const txIns = createTxIns(transactionId, outPoints, wallet);

  const transaction: Transaction = { txIns, txOuts, id: transactionId };

  return transaction;
};

const getOutPointsToSpend = (
  address: PublicKey,
  amount: number,
  unspentTxOuts: UnspentTxOut[],
  mempool: Mempool,
): { outPoints: OutPoint[]; amountToSendBack: number } => {
  const unspentTxOutsOfAddress = unspentTxOuts
    .filter(unspentTxOut => isUnspentTxOutsOfAddress(unspentTxOut, address))
    .filter(unspentTxOut => !usesOutPointInMempool(unspentTxOut, mempool));

  let currentAmount = 0;
  let outPointsToSpend: OutPoint[] = [];

  for (const unspentTxOut of unspentTxOutsOfAddress) {
    outPointsToSpend = [...outPointsToSpend, unspentTxOut.outPoint];
    currentAmount += unspentTxOut.amount;

    if (currentAmount >= amount) {
      return {
        outPoints: outPointsToSpend,
        amountToSendBack: currentAmount - amount,
      };
    }
  }

  throw new WalletError('insufficent funds');
};

const createTxOuts = (
  toAddress: PublicKey,
  fromAddress: PublicKey,
  amount: number,
  amountToSendBack: number,
): TxOut[] => {
  const txOut: TxOut = { amount, address: toAddress };

  if (amountToSendBack > 0) {
    const txOutToSelf: TxOut = {
      amount: amountToSendBack,
      address: fromAddress,
    };
    return [txOut, txOutToSelf];
  }

  return [txOut];
};

const createTxIns = (
  transactionId: string,
  prevOutPoints: OutPoint[],
  wallet: Wallet,
): TxIn[] => {
  const privateKey = wallet.keyPair.privateKey;
  const signature = signTxIn(transactionId, privateKey);

  return prevOutPoints.map(prevOutPoint => ({
    prevOutPoint,
    signature,
  }));
};

const sendTransaction = (transaction: Transaction): Transaction => {
  addTransactionToMempool(transaction);
  logger.info(`transaction ${transaction.id} sent`);

  return transaction;
};
