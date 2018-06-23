import { promises as fs } from 'fs';

import {
  generatePrivateKey,
  getPublicKeyFromPrivateKey,
  PrivateKey,
  PublicKey,
} from '../ellipticCurveCrypto';
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
    return loadWallet();
  } catch {
    return null;
  }
};

const PRIVATE_KEY_LOCATION = '';

const loadWallet = async (): Promise<Wallet> => ({
  privateKey: await loadPrivateKey(),
});

const loadPrivateKey = (): Promise<PrivateKey> =>
  fs.readFile(PRIVATE_KEY_LOCATION, 'utf8');

const createWallet = (): Wallet => ({
  privateKey: generatePrivateKey(),
});

const persistWallet = (wallet: Wallet): Promise<void> =>
  fs.writeFile(PRIVATE_KEY_LOCATION, wallet.privateKey);

export const getPublicKey = ({ privateKey }: Wallet): PublicKey =>
  getPublicKeyFromPrivateKey(privateKey);

export const getBalance = (
  address: PublicKey,
  unspentTxOuts: UnspentTxOut[],
): number =>
  unspentTxOuts
    .filter(unspentTxOut => unspentTxOut.address === address)
    .reduce((acc, unspentTxOut) => acc + unspentTxOut.amount, 0);

export const sendToAddress = async (
  toAddress: PublicKey,
  amount: number,
): Promise<Transaction> => {
  const wallet: Wallet = await getWallet();
  const unspentTxOuts = getUnspentTxOuts();

  return createTransaction(wallet, toAddress, amount, unspentTxOuts);
};

const createTransaction = (
  wallet: Wallet,
  toAddress: PublicKey,
  amount: number,
  unspentTxOuts: UnspentTxOut[],
): Transaction => {
  const fromAddress: PublicKey = getPublicKey(wallet);
  const { outPoints, amountToSendBack } = getOutPointsToSpend(
    fromAddress,
    amount,
    unspentTxOuts,
  );

  const txOuts = createTxOuts(toAddress, fromAddress, amount, amountToSendBack);
  const transactionId = getTransactionId(outPoints, txOuts);
  const txIns = createTxIns(outPoints, wallet);

  return { txIns, txOuts, id: transactionId };
};

const getOutPointsToSpend = (
  address: PublicKey,
  amount: number,
  unspentTxOuts: UnspentTxOut[],
): { outPoints: OutPoint[]; amountToSendBack: number } => {
  const unspentTxOutsOfAddress = unspentTxOuts.filter(
    unspentTxOut => unspentTxOut.address === address,
  );

  let currentAmount = 0;
  let outPointsToSpend: OutPoint[] = [];

  for (const unspentTxOut of unspentTxOutsOfAddress) {
    outPointsToSpend = outPointsToSpend.concat([unspentTxOut.outPoint]);
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

const createTxIns = (prevOutPoints: OutPoint[], wallet: Wallet): TxIn[] =>
  prevOutPoints.map(prevOutPoint => ({
    prevOutPoint,
    signature: signTxIn(prevOutPoint, wallet.privateKey),
  }));
