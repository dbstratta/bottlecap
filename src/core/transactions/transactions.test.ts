import { generateKeyPair, verify } from '../crypto';
import { getUnspentTxOuts, signTxIn } from './transactions';

describe('signTxIn', () => {
  test('returns the signature of the transaction ID', () => {
    const transactionId = 'test';
    const keyPair = generateKeyPair();
    const privateKey = keyPair.privateKey;
    const publicKey = keyPair.publicKey;
    const signature = signTxIn(transactionId, privateKey);

    expect(typeof signature).toBe('string');
    expect(verify(publicKey, signature, transactionId)).toBe(true);
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
