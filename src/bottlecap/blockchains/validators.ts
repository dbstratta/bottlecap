import { hashBlock, isNewBlockValid } from '../blocks';
import { Blockchain } from './blockchain';

export const isBlockchainValid = (blockchain: Blockchain): boolean => {
  for (let i = 1; i < blockchain.length; i += 1) {
    const block = blockchain[i];
    const prevBlock = blockchain[i - 1];
    const isBlockValid = isNewBlockValid(block, prevBlock, hashBlock);

    if (!isBlockValid) {
      return false;
    }
  }
  return true;
};
