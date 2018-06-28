import { Blockchain } from './blockchain';

export const hasMoreCumulativeDifficulty = (
  blockchain1: Blockchain,
  blockchain2: Blockchain,
): boolean =>
  getCumulativeDifficulty(blockchain1) > getCumulativeDifficulty(blockchain2);

const getCumulativeDifficulty = (blockchain: Blockchain): number =>
  blockchain
    .map(block => block.difficulty)
    .map(difficulty => 2 ** difficulty)
    .reduce((acc, a) => acc + a);
