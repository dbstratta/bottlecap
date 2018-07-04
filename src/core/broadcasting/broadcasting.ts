import { Blockchain } from '../blockchains';
import { Block } from '../blocks';
import logger from '../logger';
import {
  createSendActiveBlockchainMessage,
  createSendLatestBlockMessage,
  createSendPeerUrlsMessage,
  createSendTransactionMessage,
  Message,
} from '../messages';
import { getPeers, Peer, sendMessageToSocket } from '../peers';
import { Transaction } from '../transactions';
import { BroadcastOptions } from './types';

export const broadcastLatestBlock = (latestBlock: Block) => {
  broadcast(createSendLatestBlockMessage(latestBlock), {
    logString: `Latest block broadcast`,
  });
};

export const broadcastActiveBlockchain = (
  activeBlockchain: Blockchain,
): void => {
  broadcast(createSendActiveBlockchainMessage(activeBlockchain), {
    logString: `Active blockchain broadcast`,
  });
};

export const broadcastTransaction = (transaction: Transaction): void => {
  broadcast(createSendTransactionMessage(transaction), {
    logString: `Transaction with id ${transaction.id} broadcast`,
  });
};

export const broadcastPeerUrls = (peers: Peer[]): void => {
  const peerUrls: string[] = peers.map(peer => peer.url);
  broadcast(createSendPeerUrlsMessage(peerUrls));
};

const defaultBroadcastingOptions: BroadcastOptions = {
  logString: null,
};

const broadcast = (
  message: Message,
  options: BroadcastOptions | undefined = defaultBroadcastingOptions,
): void => {
  getPeers().forEach(peer => sendMessageToSocket(peer.socket, message));

  if (options.logString) {
    logger.info(options.logString);
  }
};
