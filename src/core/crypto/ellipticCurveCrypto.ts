import { ec as EC } from 'elliptic';

import { KeyPair, PrivateKey, PublicKey, Signature } from './types';

const ellipticCurveName = 'secp256k1';
const ec = new EC(ellipticCurveName);

/**
 * Returns the public key of `privateKey`.
 */
export const getPublicKeyFromPrivateKey = (
  privateKey: PrivateKey,
): PublicKey => {
  const key = ec.keyFromPrivate(privateKey, 'hex');
  return key.getPublic('hex');
};

/**
 * Generates a random key pair.
 */
export const generateKeyPair = (): KeyPair => {
  const key = ec.genKeyPair();

  const privateKey: PrivateKey = key.getPrivate('hex');
  const publicKey: PublicKey = key.getPublic('hex');
  const keyPair: KeyPair = { privateKey, publicKey };

  return keyPair;
};

/**
 * Signs `data` with `privateKey`.
 */
export const sign = (privateKey: PrivateKey, data: string): Signature => {
  const key = ec.keyFromPrivate(privateKey, 'hex');
  const signature: Signature = key.sign(data).toDER('hex');

  return signature;
};

/**
 * Verifies that `data` has been signed with the private key
 * of `publicKey`.
 */
export const verify = (
  publicKey: PublicKey,
  signature: Signature,
  data: string,
): boolean => {
  const key = ec.keyFromPublic(publicKey, 'hex');
  return key.verify(data, signature);
};
