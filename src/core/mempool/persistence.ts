import { loadFromDisk, saveToDisk } from '../persistence';
import { Mempool } from './types';

let mempool: Mempool = {
  transactions: [],
};

export const getMempool = (): Mempool => mempool;

export const initializeMempool = async (): Promise<Mempool> => {
  try {
    const persistedMempool = await loadMempoolFromDisk();
    return setMempool(persistedMempool);
  } catch {
    const newMempool: Mempool = createMempool();
    await saveMempoolToDisk(newMempool);
    return setMempool(newMempool);
  }
};

const MEMPOOL_PATH = 'mempool.dat';

const loadMempoolFromDisk = async (): Promise<Mempool> => {
  const serializedMempool = await loadFromDisk(MEMPOOL_PATH);
  const deserializedMempool: Mempool = deserializeMempool(serializedMempool);

  return deserializedMempool;
};

const deserializeMempool = (serializedMempool: string): Mempool =>
  JSON.parse(serializedMempool);

const saveMempoolToDisk = async (mempoolToSave: Mempool): Promise<Mempool> => {
  const serializedMempool: string = serializeMempool(mempoolToSave);
  await saveToDisk(serializedMempool, MEMPOOL_PATH);

  return mempoolToSave;
};

const serializeMempool = (mempoolToSerialize: Mempool): string =>
  JSON.stringify(mempoolToSerialize);

const createMempool = (): Mempool => ({ transactions: [] });

export const setMempool = (newMempool: Mempool): Mempool => {
  mempool = newMempool;
  return mempool;
};
