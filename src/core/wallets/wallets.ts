import { promises as fs } from 'fs';

import { equals } from 'ramda';

import {
  generatePrivateKey,
  getPublicKeyFromPrivateKey,
  PrivateKey,
  PublicKey,
} from '../ellipticCurveCrypto';
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
import { Wallet } from '../wallets';

export const getWallet = async (): Promise<Wallet> => {
  const persistedWallet = await loadWalletIfExists();

  if (persistedWallet) {
    return persistedWallet;
  }

  const newWallet: Wallet = createWallet();
  await persistWallet(newWallet);

  return newWallet;
};

const loadWalletIfExists = async (): Promise<Wallet | null> => {
  try {
    const wallet = await loadWallet();

    return wallet;
  } catch {
    return null;
  }
};

const loadWallet = async (): Promise<Wallet> => ({
  privateKey: await loadPrivateKey(),
});

const PRIVATE_KEY_LOCATION = 'private_key';

const loadPrivateKey = (): Promise<PrivateKey> =>
  fs.readFile(PRIVATE_KEY_LOCATION, 'utf8');

const createWallet = (): Wallet => ({
  privateKey: generatePrivateKey(),
});

const persistWallet = (wallet: Wallet): Promise<void> =>
  fs.writeFile(PRIVATE_KEY_LOCATION, wallet.privateKey);

export const getPublicKey = async (): Promise<string> => {
  const wallet = await getWallet();
  return getPublicKeyOfWallet(wallet);
};

const getPublicKeyOfWallet = ({ privateKey }: Wallet): PublicKey =>
  getPublicKeyFromPrivateKey(privateKey);

export const getBalance = async (): Promise<number> => {
  const address = await getPublicKey();
  const unspentTxOut = getUnspentTxOuts();
  const mempool = getMempool();

  return getBalanceOfAddress(address, unspentTxOut, mempool);
};

const getBalanceOfAddress = (
  address: PublicKey,
  unspentTxOuts: UnspentTxOut[],
  mempool: Mempool,
): number =>
  unspentTxOuts
    .filter(unspentTxOut => isUnspentTxOutsOfAddress(unspentTxOut, address))
    .filter(unspentTxOut => usesOutPointInMempool(unspentTxOut, mempool))
    .reduce((acc, unspentTxOut) => acc + unspentTxOut.amount, 0);

const usesOutPointInMempool = (
  unspentTxOut: UnspentTxOut,
  mempool: Mempool,
): boolean => {
  const outPoint = unspentTxOut.outPoint;
  const mempoolOutPoints: OutPoint[] = mempool.transactions
    .flatMap(transaction => transaction.txIns)
    .map(txIn => txIn.prevOutPoint);

  return !!mempoolOutPoints.find(equals(outPoint));
};

const isUnspentTxOutsOfAddress = (
  unspentTxOut: UnspentTxOut,
  address: PublicKey,
): boolean => unspentTxOut.address === address;

export const sendToAddress = async (
  toAddress: PublicKey,
  amount: number,
): Promise<Transaction> => {
  const wallet: Wallet = await getWallet();
  const unspentTxOuts = getUnspentTxOuts();
  const mempool = getMempool();

  const transaction = createTransaction(
    wallet,
    toAddress,
    amount,
    unspentTxOuts,
    mempool,
  );
  addTransactionToMempool(transaction);

  return transaction;
};

const createTransaction = (
  wallet: Wallet,
  toAddress: PublicKey,
  amount: number,
  unspentTxOuts: UnspentTxOut[],
  mempool: Mempool,
): Transaction => {
  const fromAddress: PublicKey = getPublicKeyOfWallet(wallet);
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
    .filter(unspentTxOut => usesOutPointInMempool(unspentTxOut, mempool));

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

  throw new Error('insufficent funds');
};

const createTxOuts = (
  toAddress: PublicKey,
  fromAddress: PublicKey,
  amount: number,
  amountToSendBack: number,
): TxOut[] => {
  const txOut1: TxOut = { amount, address: toAddress };

  if (amountToSendBack > 0) {
    const txOut2: TxOut = { amount: amountToSendBack, address: fromAddress };
    return [txOut1, txOut2];
  }

  return [txOut1];
};

const createTxIns = (
  transactionId: string,
  prevOutPoints: OutPoint[],
  wallet: Wallet,
): TxIn[] =>
  prevOutPoints.map(prevOutPoint => ({
    prevOutPoint,
    signature: signTxIn(transactionId, wallet.privateKey),
  }));
