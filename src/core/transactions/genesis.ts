import { COINBASE_AMOUNT } from './constants';
import { getCoinbaseTransactionId } from './helpers';
import { CoinbaseTransaction, TxOut, UnspentTxOut } from './types';

const address =
  '04e7df14239a29c81c819c485c2904bfea3bbce9a48b234a6f0d1276622eb07fede86fb35f1a23948d40b3802409b103f9d9ddbeb856f2424317cb3485eb42d5b6';

const genesisCoinbaseTransactionTxOut: TxOut = {
  address,
  amount: COINBASE_AMOUNT,
};

const genesisCoinbaseTransactionBlockIndex = 0;
const genesisCoinbaseTransactionId = getCoinbaseTransactionId(
  genesisCoinbaseTransactionBlockIndex,
  genesisCoinbaseTransactionTxOut,
);

/**
 * The first `CoinbaseTransaction`.
 */
export const genesisCoinbaseTransaction: CoinbaseTransaction = {
  id: genesisCoinbaseTransactionId,
  blockIndex: genesisCoinbaseTransactionBlockIndex,
  txOut: genesisCoinbaseTransactionTxOut,
};

/**
 * The first `UnspentTxOut`.
 */
export const genesisUnspentTxOut: UnspentTxOut = {
  outPoint: {
    txId: genesisCoinbaseTransactionId,
    txOutIndex: genesisCoinbaseTransactionBlockIndex,
  },
  address: genesisCoinbaseTransactionTxOut.address,
  amount: genesisCoinbaseTransactionTxOut.amount,
};
