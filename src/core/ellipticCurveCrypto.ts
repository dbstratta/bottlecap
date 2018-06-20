import { ec as EC } from 'elliptic';

export type PrivateKey = string;
export type PublicKey = string;

const ec = new EC('secp256k1');

export const getPublicKeyFromPrivateKey = (
  privateKey: PrivateKey,
): PublicKey => {
  const key = ec.keyFromPrivate(privateKey, 'hex');

  return key.getPublic().encode('hex');
};

export const generatePrivateKey = (): PrivateKey => {
  const key = ec.genKeyPair();
  const privateKey = key.getPrivate();

  return privateKey.toString(16);
};

export const sign = (
  privateKey: PrivateKey,
  data: string,
  encoding: string = 'hex',
): string => {
  const key = ec.keyFromPrivate(privateKey, 'hex');
  const signature: string = key.sign(data).toDER(encoding);

  return signature;
};

export const verify = (
  publicKey: PublicKey,
  signature: string,
  data: string,
): boolean => {
  const key = ec.keyFromPublic(publicKey, 'hex');

  return key.verify(data, signature);
};
