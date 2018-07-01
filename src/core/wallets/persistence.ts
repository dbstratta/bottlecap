import { loadFromDisk, saveToDisk } from '../persistence';
import { WalletError } from './errors';
import { createWallet } from './helpers';
import { Wallet } from './types';

let currentWallet: Wallet | null = null;

/**
 * Initializes the wallet.
 * Returns a wallet previously persisted to disk
 * or creates and returns a new one if there wasn't any.
 */
export const initializeWallet = async (): Promise<Wallet> => {
  const persistedWallet = await loadWalletFromDiskIfExists();

  if (persistedWallet) {
    setCurrentWallet(persistedWallet);
    return persistedWallet;
  }

  const newWallet: Wallet = createWallet();
  setCurrentWallet(newWallet);
  await saveCurrentWalletToDisk();

  return newWallet;
};

/**
 * Returns the current wallet.
 * Throws if no wallet has been initialized.
 */
export const getCurrentWallet = (): Wallet => {
  if (!currentWallet) {
    throw new WalletError('wallet not initialized');
  }

  return currentWallet;
};

const setCurrentWallet = (wallet: Wallet): Wallet => {
  currentWallet = wallet;
  return currentWallet;
};

const loadWalletFromDiskIfExists = async (): Promise<Wallet | null> => {
  try {
    const wallet = await loadWalletFromDisk();

    return wallet;
  } catch {
    return null;
  }
};

const WALLET_PATH = 'wallet.dat';

const loadWalletFromDisk = async (): Promise<Wallet> => {
  const serializedWallet: string = await loadFromDisk(WALLET_PATH);
  const wallet: Wallet = deserializeWallet(serializedWallet);

  return wallet;
};

const deserializeWallet = (serializedWallet: string): Wallet =>
  JSON.parse(serializedWallet);

/**
 * Persist the current wallet to disk.
 */
export const saveCurrentWalletToDisk = (): Promise<Wallet> => {
  const wallet = getCurrentWallet();
  return saveWalletToDisk(wallet);
};

const saveWalletToDisk = async (wallet: Wallet): Promise<Wallet> => {
  const serializedWallet: string = serializeWallet(wallet);

  await saveToDisk(serializedWallet, WALLET_PATH);

  return wallet;
};

const serializeWallet = (wallet: Wallet): string => JSON.stringify(wallet);
