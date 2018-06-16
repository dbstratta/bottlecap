export type Nonce = number;

export type Block = {
  index: number;
  nonce: Nonce;
  data: string;
  prevHash: string;
  hash: string;
  timestamp: number;
  difficulty: number;
};

export const BLOCK_GENERATION_INTERVAL = 10000;
export const DIFFICULTY_ADJUSMENT_INTERVAL = 10;
export const EXPECTED_TIME_BETWEEN_BLOCKS =
  BLOCK_GENERATION_INTERVAL * DIFFICULTY_ADJUSMENT_INTERVAL;
