import { equals } from 'ramda';

import { OutPoint, UnspentTxOut } from './transaction';

export const getUnspentTxOut = (
  outPoint: OutPoint,
  unspentTxOuts: UnspentTxOut[],
): UnspentTxOut | undefined =>
  unspentTxOuts.find(unspentTxOut => equals(unspentTxOut.outPoint, outPoint));
