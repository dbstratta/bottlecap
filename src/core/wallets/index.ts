export { Wallet } from './types';
export { sendToAddress, getBalance } from './wallets';
export {
  getCurrentWallet,
  initializeWallet,
  saveCurrentWalletToDisk,
} from './persistance';
