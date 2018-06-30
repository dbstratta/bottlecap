import { getUnspentTxOuts } from './unspentTxOuts';

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
