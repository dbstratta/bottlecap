import { COINBASE_AMOUNT } from './constants';
import { getCoinbaseTransactionId } from './helpers';
import { CoinbaseTransaction, Transaction, TxOut, UnspentTxOut } from './types';
import {
  getUnspentTxOuts,
  setUnspentTxOuts,
  updateUnspentTxOuts,
} from './unspentTxOuts';

describe('updateUnspentTxOuts', () => {
  beforeEach(() => restoreUnspentTxOuts());

  test(`adds the newly unspent transaction output
  when only given a coinbase transaction`, () => {
    const unspentTxOuts = getUnspentTxOuts();
    const coinbaseTransaction = generateCoinbaseTransaction(1);
    const transactions: ReadonlyArray<Transaction> = [];

    const updatedUnspentTxOuts = updateUnspentTxOuts(
      coinbaseTransaction,
      transactions,
    );

    const newUnspentTxOut: UnspentTxOut = {
      outPoint: {
        txId: coinbaseTransaction.id,
        txOutIndex: coinbaseTransaction.blockIndex,
      },
      address: coinbaseTransaction.txOut.address,
      amount: coinbaseTransaction.txOut.amount,
    };

    const expectedUnspentTxOuts: UnspentTxOut[] = [
      ...unspentTxOuts,
      newUnspentTxOut,
    ];

    expect(updatedUnspentTxOuts).toEqual(expectedUnspentTxOuts);
  });
});

describe('getUnspentTxOuts', () => {
  test('returns an array', () => {
    const unspentTxOuts = getUnspentTxOuts();

    expect(Array.isArray(unspentTxOuts)).toBe(true);
  });

  test('the array it returns contains the genesis unspent tx out', () => {
    const unspentTxOuts = getUnspentTxOuts();
    const genesisUnspentTxOut = unspentTxOuts[0];

    expect(genesisUnspentTxOut.outPoint.txOutIndex).toBe(0);
  });
});

const originalUnspentTxOuts = getUnspentTxOuts();

const restoreUnspentTxOuts = () => {
  setUnspentTxOuts(originalUnspentTxOuts);
};

const generateCoinbaseTransaction = (
  blockIndex: number,
  address: string = 'test_address',
): CoinbaseTransaction => {
  const txOut: TxOut = { address, amount: COINBASE_AMOUNT };
  const id: string = getCoinbaseTransactionId(blockIndex, txOut);

  const coinbaseTransaction: CoinbaseTransaction = {
    id,
    blockIndex,
    txOut,
  };

  return coinbaseTransaction;
};
