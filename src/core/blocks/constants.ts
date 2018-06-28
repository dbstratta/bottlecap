/**
 * The expected time (in milliseconds)
 * for a block to be mined.
 */
export const EXPECTED_TIME_FOR_BLOCK_MINING = 10000;

/**
 * The amount of blocks that have to be
 * mined before we adjust the difficulty
 * of the proof of work.
 */
export const DIFFICULTY_ADJUSMENT_INTERVAL = 10;

/**
 * The expected time (in milliseconds) between an
 * adjustment in the difficulty of the proof of work.
 */
export const EXPECTED_TIME_BETWEEN_DIFFICULTY_ADJUSTMENT =
  EXPECTED_TIME_FOR_BLOCK_MINING * DIFFICULTY_ADJUSMENT_INTERVAL;
