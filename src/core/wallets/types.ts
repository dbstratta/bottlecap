import { KeyPair } from '../crypto';

/**
 * A wallet holds a key pair.
 */
export type Wallet = {
  keyPair: KeyPair;
};
