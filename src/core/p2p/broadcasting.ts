import { Blockchain } from '../blockchains';
import { Block } from '../blocks';
import { Transaction } from '../transactions';
import { Message, MessageType } from './messages';
import { getPeers, sendMessageToSocket } from './peers';

export const broadcastLatestBlock = (block: Block) => {
  broadcast({ type: MessageType.BroadcastLatestBlock, content: block });
};

export const broadcastActiveBlockchain = (blockchain: Blockchain): void => {
  broadcast({
    type: MessageType.BroadcastActiveBlockchain,
    content: blockchain,
  });
};

export const broadcastTransaction = (transaction: Transaction): void => {
  broadcast({
    type: MessageType.BroadcastTransaction,
    content: transaction,
  });
};

const broadcast = (message: Message): void =>
  getPeers().forEach(peer => sendMessageToSocket(peer.socket, message));
