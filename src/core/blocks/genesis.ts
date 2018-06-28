import { genesisCoinbaseTransaction } from '../transactions';
import { findBlock } from './blocks';

export const genesisBlock = findBlock({
  index: 0,
  data: {
    coinbaseTransaction: genesisCoinbaseTransaction,
    transactions: [],
  },
  prevHash: '',
  difficulty: 1,
  timestamp: Date.now(),
});
