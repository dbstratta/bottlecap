export { Wallet } from './types';
export {
  getBalanceOfCurrentWallet,
  getConfirmedBalanceOfCurrentWallet,
} from './wallets';
export { sendToAddress } from './transactionSending';
export {
  getCurrentWallet,
  initializeWallet,
  saveCurrentWalletToDisk,
} from './persistance';
