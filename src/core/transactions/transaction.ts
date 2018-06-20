import { PublicKey } from '../ellipticCurveCrypto';

export type Transaction = {
  id: string;
  txIns: TxIn[];
  txOuts: TxOut[];
};

export type TxIn = {
  prevOutPoint: OutPoint;
  signature: string;
};

export type OutPoint = {
  txId: string;
  txOutIndex: number;
};

export type TxOut = {
  address: PublicKey;
  amount: number;
};

export type UnspentTxOut = {
  outPoint: OutPoint;
  address: PublicKey;
  amount: number;
};

export const COINBASE_AMOUNT = 10;

export type CoinbaseTransaction = {
  id: string;
  blockIndex: number;
  txOut: TxOut;
};