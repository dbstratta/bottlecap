export type TxIn = {
  txOutId: string;
  txOutIndex: number;
  signature: string;
};

export type TxOut = {
  address: string;
  amount: number;
};

export type Transaction = {
  id: string;
  txIns: TxIn[];
  txOuts: TxOut[];
};
