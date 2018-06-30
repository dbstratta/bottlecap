import { sum } from 'ramda';

import { PublicKey } from '../crypto';
import { getMempool, Mempool } from '../mempool';
import { getUnspentTxOuts, UnspentTxOut } from '../transactions';
import { isUnspentTxOutsOfAddress, usesOutPointInMempool } from './helpers';
import { getCurrentWallet } from './persistance';

export const getBalanceOfCurrentWallet = (): number => {
  const wallet = getCurrentWallet();
  const address = wallet.keyPair.publicKey;
  const unspentTxOuts = getUnspentTxOuts();
  const mempool = getMempool();

  return getBalanceOfAddress(address, unspentTxOuts, mempool);
};

export const getConfirmedBalanceOfCurrentWallet = (): number => {
  const wallet = getCurrentWallet();
  const address = wallet.keyPair.publicKey;
  const unspentTxOuts = getUnspentTxOuts();

  return getConfirmedBalanceOfAddress(address, unspentTxOuts);
};

const getConfirmedBalanceOfAddress = (
  address: PublicKey,
  unspentTxOuts: UnspentTxOut[],
): number => {
  const confirmedUnspentAmountsOfAddress: number[] = unspentTxOuts
    .filter(unspentTxOut => isUnspentTxOutsOfAddress(unspentTxOut, address))
    .map(unspentTxOut => unspentTxOut.amount);

  return sum(confirmedUnspentAmountsOfAddress);
};

const getBalanceOfAddress = (
  address: PublicKey,
  unspentTxOuts: UnspentTxOut[],
  mempool: Mempool,
): number => {
  const unspentAmountsOfAddress: number[] = unspentTxOuts
    .filter(unspentTxOut => isUnspentTxOutsOfAddress(unspentTxOut, address))
    .filter(unspentTxOut => !usesOutPointInMempool(unspentTxOut, mempool))
    .map(unspentTxOut => unspentTxOut.amount);

  return sum(unspentAmountsOfAddress);
};
