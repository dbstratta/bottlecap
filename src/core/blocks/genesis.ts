import { genesisCoinbaseTransaction } from '../transactions';
import { findBlock } from './blocks';
import { Block, BlockData } from './types';

const genesisBlockData: BlockData = {
  coinbaseTransaction: genesisCoinbaseTransaction,
  transactions: [],
};
const genesisBlockPrevHash = '00000000';
const genesisBlockDifficulty = 1;
const genesisBlockTimestamp = Date.now();

const findGenesisBlock = (): Block =>
  findBlock({
    index: 0,
    data: genesisBlockData,
    prevHash: genesisBlockPrevHash,
    difficulty: genesisBlockDifficulty,
    timestamp: genesisBlockTimestamp,
  });

/**
 * The first `Block` in the `Blockchain`.
 */
export const genesisBlock = findGenesisBlock();
