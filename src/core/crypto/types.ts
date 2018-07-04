export type KeyPair = {
  readonly privateKey: PrivateKey;
  readonly publicKey: PublicKey;
};

export type PrivateKey = string;
export type PublicKey = string;

export type Signature = string;
