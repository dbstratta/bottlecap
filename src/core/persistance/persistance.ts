import { promises as fs } from 'fs';

import { Blockchain } from '../blockchains';

const ACTIVE_BLOCKCHAIN_LOCATION = '';

export const saveActiveBlockchainToDisk = (
  activeBlockchain: Blockchain,
): Promise<void> =>
  fs.writeFile(
    ACTIVE_BLOCKCHAIN_LOCATION,
    serializeBlockchain(activeBlockchain),
  );

export const loadActiveBlockchainFromDisk = async (): Promise<Blockchain> => {
  const serializedActiveBlockchain: string = await fs.readFile(
    ACTIVE_BLOCKCHAIN_LOCATION,
    'utf8',
  );

  return deserializeBlockchain(serializedActiveBlockchain);
};

const serializeBlockchain = (blockchain: Blockchain): string =>
  JSON.stringify(blockchain);

const deserializeBlockchain = (serializedBlockchain: string): Blockchain =>
  JSON.parse(serializedBlockchain);
