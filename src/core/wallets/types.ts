import { KeyPair } from '../crypto';

/**
 * A wallet holds a collection of key pairs.
 */
export type Wallet = {
  keyPairs: KeyPair[];
  defaultKeyPair: KeyPair;
};
