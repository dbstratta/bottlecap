import {
  generatePrivateKey,
  getPublicKeyFromPrivateKey,
  sign,
  verify,
} from './ellipticCurveCrypto';

describe('generatePrivateKey', () => {
  test('returns a private key', () => {
    const privateKey = generatePrivateKey();

    expect(typeof privateKey).toBe('string');
  });
});

describe('getPublicKeyFromPrivateKey', () => {
  test('returns the public key from a private key', () => {
    const privateKey = generatePrivateKey();

    expect(typeof getPublicKeyFromPrivateKey(privateKey)).toBe('string');
  });
});

describe('sign', () => {
  test('returns the signature of a message', () => {
    const privateKey = generatePrivateKey();
    const message = 'test';

    expect(typeof sign(privateKey, message)).toBe('string');
  });
});

describe('verify', () => {
  test('returns true if the signature is valid', () => {
    const message = 'test';
    const privateKey = generatePrivateKey();
    const publicKey = getPublicKeyFromPrivateKey(privateKey);
    const signature = sign(privateKey, message);

    expect(verify(publicKey, signature, message)).toBe(true);
  });
});
