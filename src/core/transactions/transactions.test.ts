import { generateKeyPair, verify } from '../crypto';
import { signTxIn } from './transactions';

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
