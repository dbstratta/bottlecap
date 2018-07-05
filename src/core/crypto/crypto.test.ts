import { sha256 } from './crypto';

describe('sha256', () => {
  test('returns a string', () => {
    const data = 'test_data';
    const result = sha256(data);

    expect(typeof result).toBe('string');
  });

  test("doesn't return the same string for two different inputs", () => {
    const data1 = 'test_data1';
    const data2 = 'test_data2';
    const result1 = sha256(data1);
    const result2 = sha256(data2);

    expect(result1).not.toEqual(result2);
  });
});
