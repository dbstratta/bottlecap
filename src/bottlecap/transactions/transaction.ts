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
  address: string;
  amount: number;
};

export type UnspentTxOut = {
  outPoint: OutPoint;
  address: string;
  amount: number;
};
