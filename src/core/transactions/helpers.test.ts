import {
  getCoinbaseTransactionId,
  getTransactionId,
  getUnspentTxOut,
} from './helpers';
import { OutPoint, TxOut, UnspentTxOut } from './types';

describe('getUnspentTxOut', () => {
  test('returns undefined if no unspent tx out matches the out point', () => {
    const outPoint: OutPoint = { txId: 'test', txOutIndex: 0 };
    const unspentTxOuts: UnspentTxOut[] = [];

    expect(getUnspentTxOut(outPoint, unspentTxOuts)).toBe(undefined);
  });

  test('returns the unspent tx out that matches the out point', () => {
    const outPoint: OutPoint = { txId: 'test', txOutIndex: 0 };
    const unspentTxOut: UnspentTxOut = {
      outPoint,
      address: 'test',
      amount: 10,
    };
    const unspentTxOuts: UnspentTxOut[] = [unspentTxOut];

    expect(getUnspentTxOut(outPoint, unspentTxOuts)).toBe(unspentTxOut);
  });
});

describe('getTransactionId', () => {
  test('returns a string', () => {
    const prevOutsPoints: OutPoint[] = [{ txId: 'test', txOutIndex: 0 }];
    const txOuts: TxOut[] = [{ address: 'test', amount: 10 }];
    const transactionId = getTransactionId(prevOutsPoints, txOuts);

    expect(typeof transactionId).toBe('string');
  });
});

describe('getCoinbaseTransactionId', () => {
  test('returns a string', () => {
    const blockIndex = 0;
    const txOut: TxOut = { address: 'test', amount: 10 };
    const coinbaseTransactionId = getCoinbaseTransactionId(blockIndex, txOut);

    expect(typeof coinbaseTransactionId).toBe('string');
  });
});
