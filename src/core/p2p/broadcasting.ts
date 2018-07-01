import { Blockchain } from '../blockchains';
import { Block } from '../blocks';
import { Transaction } from '../transactions';
import {
  createSendActiveBlockchainMessage,
  createSendLatestBlockMessage,
  createSendPeersMessage,
  createSendTransactionMessage,
  Message,
} from './messages';
import { getPeers, Peer, sendMessageToSocket } from './peers';

export const broadcastLatestBlock = (latestBlock: Block) => {
  broadcast(createSendLatestBlockMessage(latestBlock));
};

export const broadcastActiveBlockchain = (
  activeBlockchain: Blockchain,
): void => {
  broadcast(createSendActiveBlockchainMessage(activeBlockchain));
};

export const broadcastTransaction = (transaction: Transaction): void => {
  broadcast(createSendTransactionMessage(transaction));
};

export const broadcastPeerUrls = (peers: Peer[]): void => {
  const peerUrls: string[] = peers.map(peer => peer.url);
  broadcast(createSendPeersMessage(peerUrls));
};

const broadcast = (message: Message): void =>
  getPeers().forEach(peer => sendMessageToSocket(peer.socket, message));
