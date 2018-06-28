import { PrivateKey } from '../ellipticCurveCrypto';

/**
 * A wallet holds a private key.
 */
export type Wallet = {
  privateKey: PrivateKey;
};
