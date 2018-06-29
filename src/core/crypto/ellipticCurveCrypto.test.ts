import {
  generateKeyPair,
  getPublicKeyFromPrivateKey,
  sign,
  verify,
} from './ellipticCurveCrypto';

describe('generateKeyPair', () => {
  test('returns a random key pair', () => {
    const keyPair = generateKeyPair();
    const privateKey = keyPair.privateKey;

    expect(typeof privateKey).toBe('string');
  });
});

describe('getPublicKeyFromPrivateKey', () => {
  test('returns the public key from a private key', () => {
    const keyPair = generateKeyPair();
    const privateKey = keyPair.privateKey;

    expect(typeof getPublicKeyFromPrivateKey(privateKey)).toBe('string');
  });
});

describe('sign', () => {
  test('returns the signature of a message', () => {
    const keyPair = generateKeyPair();
    const privateKey = keyPair.privateKey;
    const message = 'test';

    expect(typeof sign(privateKey, message)).toBe('string');
  });
});

describe('verify', () => {
  test('returns true if the signature is valid', () => {
    const message = 'test';
    const keyPair = generateKeyPair();
    const privateKey = keyPair.privateKey;
    const publicKey = keyPair.publicKey;
    const signature = sign(privateKey, message);

    expect(verify(publicKey, signature, message)).toBe(true);
  });
});
