import { ec as EC } from 'elliptic';

import { PrivateKey, PublicKey } from './types';

const ellipticCurveName = 'secp256k1';
const ec = new EC(ellipticCurveName);

/**
 * Returns the public key of `privateKey`.
 */
export const getPublicKeyFromPrivateKey = (
  privateKey: PrivateKey,
): PublicKey => {
  const key = ec.keyFromPrivate(privateKey, 'hex');
  return key.getPublic().encode('hex');
};

/**
 * Generates a random private key.
 */
export const generatePrivateKey = (): PrivateKey => {
  const key = ec.genKeyPair();
  const privateKey: PrivateKey = key.getPrivate('hex');

  return privateKey;
};

/**
 * Signs `data` with `privateKey`.
 */
export const sign = (privateKey: PrivateKey, data: string): string => {
  const key = ec.keyFromPrivate(privateKey, 'hex');
  const signature: string = key.sign(data).toDER('hex');

  return signature;
};

/**
 * Verifies that `data` has been signed with the private key
 * of `publicKey`.
 */
export const verify = (
  publicKey: PublicKey,
  signature: string,
  data: string,
): boolean => {
  const key = ec.keyFromPublic(publicKey, 'hex');
  return key.verify(data, signature);
};
