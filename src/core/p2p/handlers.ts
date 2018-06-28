import WebSocket from 'ws';

import {
  addBlockToActiveBlockchain,
  getActiveBlockchain,
  getLatestBlock,
} from '../blockchains';
import { Block } from '../blocks';
import { tryOrLogError } from '../helpers';
import { addTransactionToMempool, getMempool, Mempool } from '../mempool';
import { Transaction } from '../transactions';
import {
  createQueryActiveBlockchainMessage,
  createSendActiveBlockchainMessage,
  createSendLatestBlockMessage,
  createSendMempoolMessage,
  Message,
  MessageType,
  parseMessage,
} from './messages';
import { addPeer, removePeer, sendMessageToSocket } from './peers';

export const handleMessage = (ws: WebSocket, data: string): void => {
  const message: Message | null = parseMessage(data);

  if (!message) {
    return;
  }

  if (message.type === MessageType.SendServerId) {
    handleSendServerId(ws, message);
  } else if (message.type === MessageType.QueryActiveBlockchain) {
    handleQueryActiveBlockchain(ws);
  } else if (message.type === MessageType.QueryLatestBlock) {
    handleQueryLatestBlock(ws);
  } else if (message.type === MessageType.QueryMempool) {
    handleQueryMempool(ws);
  } else if (message.type === MessageType.SendLatestBlock) {
    handleSendLatestBlock(ws, message);
  } else if (message.type === MessageType.SendMempool) {
    handleSendMempool(ws, message);
  } else if (message.type === MessageType.SendTransaction) {
    handleSendTransaction(ws, message);
  }
};

const handleSendServerId = (ws: WebSocket, message: Message): void => {
  const serverId: string = message.content;
  tryOrLogError(() => addPeer(ws, serverId));
};

const handleQueryActiveBlockchain = (ws: WebSocket): void => {
  const activeBlockchain = getActiveBlockchain();
  sendMessageToSocket(ws, createSendActiveBlockchainMessage(activeBlockchain));
};

const handleQueryLatestBlock = (ws: WebSocket): void => {
  const latestBlock = getLatestBlock(getActiveBlockchain());
  sendMessageToSocket(ws, createSendLatestBlockMessage(latestBlock));
};

const handleQueryMempool = (ws: WebSocket): void => {
  const mempool = getMempool();
  sendMessageToSocket(ws, createSendMempoolMessage(mempool));
};

const handleSendLatestBlock = (ws: WebSocket, message: Message): void => {
  const receivedLatestBlock: Block = message.content;
  const activeBlockchain = getActiveBlockchain();
  const latestBlock = getLatestBlock(activeBlockchain);

  if (receivedLatestBlock.prevHash === latestBlock.hash) {
    addBlockToActiveBlockchain(receivedLatestBlock);
  } else if (receivedLatestBlock.hash !== latestBlock.hash) {
    sendMessageToSocket(ws, createQueryActiveBlockchainMessage());
  }
};

const handleSendMempool = (ws: WebSocket, message: Message): void => {
  const receivedMempool: Mempool = message.content;
  receivedMempool.transactions.forEach(maybeAddTransactionToMempool);
};

const handleSendTransaction = (ws: WebSocket, message: Message): void => {
  const transaction: Transaction = message.content;
  maybeAddTransactionToMempool(transaction);
};

const maybeAddTransactionToMempool = (transaction: Transaction): void =>
  tryOrLogError(() => addTransactionToMempool(transaction));

export const handleClose = (ws: WebSocket): void => {
  removePeer(ws);
};
