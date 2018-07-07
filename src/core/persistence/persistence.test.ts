import { initializeFileSystem, loadFromDisk, saveToDisk } from './persistence';

describe('initializeFileSystem', () => {
  test('calls the mkdrip function', async () => {
    const mkdirpFn = jest.fn();
    await initializeFileSystem(mkdirpFn);

    expect(mkdirpFn).toHaveBeenCalled();
  });
});

describe('saveToDisk', () => {
  test('calls the writeFile function', async () => {
    const writeFileFn = jest.fn();
    const data = 'test_data';
    const path = 'test_path';
    await saveToDisk(data, path, writeFileFn);

    expect(writeFileFn).toHaveBeenCalled();
  });
});

describe('loadFromDisk', () => {
  test('calls the readFile function', async () => {
    const readFileFn = jest.fn();
    const path = 'test_path';
    await loadFromDisk(path, readFileFn);

    expect(readFileFn).toHaveBeenCalled();
  });
});
