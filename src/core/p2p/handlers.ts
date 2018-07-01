import WebSocket from 'ws';

import {
  addBlockToActiveBlockchain,
  Blockchain,
  getActiveBlockchain,
  getLatestBlock,
  maybeReplaceActiveBlockchain,
} from '../blockchains';
import { Block } from '../blocks';
import { tryOrLogError } from '../helpers';
import logger from '../logger';
import { addTransactionToMempool, getMempool, Mempool } from '../mempool';
import { Transaction } from '../transactions';
import { connectToPeer } from './helpers';
import {
  createQueryActiveBlockchainMessage,
  createSendActiveBlockchainMessage,
  createSendLatestBlockMessage,
  createSendMempoolMessage,
  Message,
  MessageType,
  parseMessage,
  ServerInfo,
} from './messages';
import { addPeer, removePeer, sendMessageToSocket } from './peers';

export const handleMessage = (ws: WebSocket, data: string): void => {
  const message: Message | null = parseMessage(data);

  if (!message) {
    return;
  }

  if (message.type === MessageType.SendServerInfo) {
    handleSendServerInfo(ws, message);
  } else if (message.type === MessageType.QueryActiveBlockchain) {
    handleQueryActiveBlockchain(ws);
  } else if (message.type === MessageType.QueryLatestBlock) {
    handleQueryLatestBlock(ws);
  } else if (message.type === MessageType.QueryMempool) {
    handleQueryMempool(ws);
  } else if (message.type === MessageType.SendActiveBlockchain) {
    handleSendActiveBlockchain(ws, message);
  } else if (message.type === MessageType.SendLatestBlock) {
    handleSendLatestBlock(ws, message);
  } else if (message.type === MessageType.SendMempool) {
    handleSendMempool(ws, message);
  } else if (message.type === MessageType.SendTransaction) {
    handleSendTransaction(ws, message);
  } else if (message.type === MessageType.SendPeers) {
    handleSendPeers(ws, message);
  }
};

const handleSendServerInfo = (ws: WebSocket, message: Message): void => {
  const serverInfo: ServerInfo = message.content;
  tryOrLogError(() => addPeer(ws, serverInfo.id, serverInfo.url));
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

const handleSendActiveBlockchain = (ws: WebSocket, message: Message): void => {
  const receivedActiveBlockchain: Blockchain = message.content;
  logger.info(`Received blockchain`);
  maybeReplaceActiveBlockchain(receivedActiveBlockchain);
};

const handleSendLatestBlock = (ws: WebSocket, message: Message): void => {
  const receivedLatestBlock: Block = message.content;
  logger.info(`Received block ${receivedLatestBlock.index}`);

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
  logger.info(`Transaction ${transaction.id} received`);

  maybeAddTransactionToMempool(transaction);
};

const maybeAddTransactionToMempool = (transaction: Transaction): void =>
  tryOrLogError(() => addTransactionToMempool(transaction));

const handleSendPeers = (ws: WebSocket, message: Message): void => {
  const peerUrls: string[] = message.content;
  peerUrls.forEach(connectToPeer);
};

export const handleClose = (ws: WebSocket): void => {
  removePeer(ws);
};
