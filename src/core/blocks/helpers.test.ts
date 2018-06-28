import { findBlock } from './blocks';
import { hashMatchesDifficulty, hexToBinary, nonceGenerator } from './helpers';
import { Block } from './types';

describe('hashMatchesDifficulty', () => {
  it('returns true when the hash of a block matches the difficulty', () => {
    const difficulty = 1;

    const block: Block = findBlock({
      difficulty,
      index: 0,
      data: {
        coinbaseTransaction: {
          id: '',
          blockIndex: 0,
          txOut: { address: '', amount: 1 },
        },
        transactions: [],
      },
      prevHash: '',
      timestamp: Date.now(),
    });

    expect(hashMatchesDifficulty(block.hash, block.difficulty)).toBe(true);
  });
});

describe('hexToBinary', () => {
  it('returns a binary string of a hex string', () => {
    const hexString = 'ab12';
    const expectedBinary = '1010101100010010';

    expect(hexToBinary(hexString)).toBe(expectedBinary);
  });
});

describe('nonceGenerator', () => {
  it('starts generating nonces from 0 if argument is not provided', () => {
    const nonceIterator = nonceGenerator();

    expect(nonceIterator.next().value).toBe(0);
  });

  it('generates nonces in incrementing order', () => {
    const nonceIterator = nonceGenerator();

    expect(nonceIterator.next().value).toBe(0);
    expect(nonceIterator.next().value).toBe(1);
    expect(nonceIterator.next().value).toBe(2);
  });

  it('generates the first nonce equal to the argument if provided', () => {
    const startNoncesFrom = 20;
    const nonceIterator = nonceGenerator(startNoncesFrom);

    expect(nonceIterator.next().value).toBe(startNoncesFrom);
  });
});
