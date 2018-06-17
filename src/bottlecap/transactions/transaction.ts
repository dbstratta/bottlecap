export type Transaction = {
  id: string;
  txIns: TxIn[];
  txOuts: TxOut[];
};

export type TxIn = {
  txOutId: string;
  txOutIndex: number;
  signature: string;
};

export type TxOut = {
  address: string;
  amount: number;
};

export type UnsignedTxIn = {
  txOutId: string;
  txOutIndex: number;
};

export type UnspentTxOut = {
  txOutId: string;
  txOutIndex: number;
  address: string;
  amount: number;
};
