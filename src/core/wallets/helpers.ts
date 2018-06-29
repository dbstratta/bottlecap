import { generateKeyPair, KeyPair } from '../crypto';
import { Wallet } from './types';

/**
 * Returns a new wallet with a random key pair.
 */
export const createWallet = (): Wallet => {
  const defaultKeyPair: KeyPair = generateKeyPair();

  const keyPairs: KeyPair[] = [defaultKeyPair];

  const wallet: Wallet = { keyPairs, defaultKeyPair };
  return wallet;
};

export const addRandomKeyPairToWallet = (wallet: Wallet): Wallet =>
  addKeyPairToWallet(wallet, generateKeyPair());

export const addKeyPairToWallet = (
  wallet: Wallet,
  keyPair: KeyPair,
): Wallet => ({
  ...wallet,
  keyPairs: [...wallet.keyPairs, keyPair],
});
