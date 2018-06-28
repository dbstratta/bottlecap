import { validateNewBlock } from '../blocks';
import { UnspentTxOut } from '../transactions';
import { Blockchain } from './types';

export const validateBlockchain = (
  blockchain: Blockchain,
  unspentTxOuts: UnspentTxOut[],
): void => {
  for (let i = 1; i < blockchain.length; i += 1) {
    const block = blockchain[i];
    const prevBlock = blockchain[i - 1];
    validateNewBlock(block, prevBlock, unspentTxOuts);
  }
};
