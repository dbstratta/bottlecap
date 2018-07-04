import { env } from '../config';
import { initializeMempool } from './mempool';
import { startP2pServer } from './p2p';
import { initializeFileSystem } from './persistence';
import { initializeWallet } from './wallets';

const { p2pServerPort } = env;

/**
 * Initializes node internal state
 * (wallet, active blockchain, etc.),
 * starts the p2p server, etc.
 */
export const initializeNode = async (): Promise<void> => {
  await initializeFileSystem();
  await initializeMempool();
  await initializeWallet();

  startP2pServer(p2pServerPort);
};
