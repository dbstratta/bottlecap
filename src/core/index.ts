import { initializeMempool } from './mempool';
import { startP2pServer } from './p2p';
import { initializeFileSystem } from './persistance';
import { initializeWallet } from './wallets';

const P2P_SERVER_PORT = 4100;

/**
 * Initializes node internal state
 * (wallet, active blockchain, etc.),
 * starts the p2p server, etc.
 */
export const initializeNode = async (): Promise<void> => {
  await initializeFileSystem();
  await initializeMempool();
  await initializeWallet();

  startP2pServer(P2P_SERVER_PORT);
};
