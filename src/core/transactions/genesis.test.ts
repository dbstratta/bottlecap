import { genesisCoinbaseTransaction } from './genesis';
import { getCoinbaseTransactionId } from './helpers';

describe('genesisCoinbaseTransaction', () => {
  test('it has a valid ID', () => {
    const expectedId = genesisCoinbaseTransaction.id;
    const coinbaseTransactionId = getCoinbaseTransactionId(
      genesisCoinbaseTransaction.blockIndex,
      genesisCoinbaseTransaction.txOut,
    );

    expect(coinbaseTransactionId).toEqual(expectedId);
  });
});
