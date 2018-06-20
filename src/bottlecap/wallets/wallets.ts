import { promises as fs } from 'fs';

import {
  generatePrivateKey,
  PrivateKey,
  PublicKey,
  publicKeyFromPrivateKey,
} from '../ellipticCurveCrypto';
import { UnspentTxOut } from '../transactions';
import { Wallet } from '../wallets';

export const initWallet = async (): Promise<Wallet> => {
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
  } catch (e) {
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
  publicKeyFromPrivateKey(privateKey);

export const getBalance = (
  address: PublicKey,
  unspentTxOuts: UnspentTxOut[],
): number =>
  unspentTxOuts
    .filter(unspentTxOut => unspentTxOut.address === address)
    .reduce((acc, unspentTxOut) => acc + unspentTxOut.amount, 0);
