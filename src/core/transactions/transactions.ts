import { PrivateKey, sign, Signature } from '../crypto';

export const signTxIn = (
  transactionId: string,
  privateKey: PrivateKey,
): Signature => sign(privateKey, transactionId);
