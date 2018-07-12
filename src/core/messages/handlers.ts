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
import {
  addPeer,
  connectToPeer,
  getPeerBySocket,
  nodeId,
  removePeer,
  sendMessageToSocket,
} from '../peers';
import { Transaction } from '../transactions';
import {
  createQueryActiveBlockchainMessage,
  createSendActiveBlockchainMessage,
  createSendLatestBlockMessage,
  createSendMempoolMessage,
  parseMessage,
} from './messages';
import {
  Message,
  MessageType,
  SendActiveBlockchainMessage,
  SendLatestBlockMessage,
  SendMempoolMessage,
  SendPeerUrlsMessage,
  SendServerInfoMessage,
  SendTransactionMessage,
  ServerInfo,
} from './types';

/**
 * Handles messages sent by peers in the network.
 */
export const handleMessage = (ws: WebSocket, data: string): void => {
  const message: Message | null = parseMessage(data);

  if (!message) {
    return;
  }

  const peer = getPeerBySocket(ws);

  if (peer && peer.id === nodeId) {
    return;
  }

  if (message.type === MessageType.QueryActiveBlockchain) {
    handleQueryActiveBlockchain(ws);
  } else if (message.type === MessageType.QueryLatestBlock) {
    handleQueryLatestBlock(ws);
  } else if (message.type === MessageType.QueryMempool) {
    handleQueryMempool(ws);
  } else if (message.type === MessageType.SendServerInfo) {
    handleSendServerInfo(ws, message);
  } else if (message.type === MessageType.SendActiveBlockchain) {
    handleSendActiveBlockchain(message);
  } else if (message.type === MessageType.SendLatestBlock) {
    handleSendLatestBlock(ws, message);
  } else if (message.type === MessageType.SendMempool) {
    handleSendMempool(message);
  } else if (message.type === MessageType.SendTransaction) {
    handleSendTransaction(message);
  } else if (message.type === MessageType.SendPeerUrls) {
    handleSendPeerUrls(message);
  }
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

const handleSendServerInfo = (
  ws: WebSocket,
  message: SendServerInfoMessage,
): void => {
  const serverInfo: ServerInfo = message.content;
  tryOrLogError(() => addPeer(ws, serverInfo.id, serverInfo.url));
};

const handleSendActiveBlockchain = (
  message: SendActiveBlockchainMessage,
): void => {
  const receivedActiveBlockchain: Blockchain = message.content;
  logger.info(
    `Blockchain with length ${receivedActiveBlockchain.length} received`,
  );
  maybeReplaceActiveBlockchain(receivedActiveBlockchain);
};

const handleSendLatestBlock = (
  ws: WebSocket,
  message: SendLatestBlockMessage,
): void => {
  const receivedLatestBlock: Block = message.content;
  logger.info(`Block with index ${receivedLatestBlock.index} received`);

  const activeBlockchain = getActiveBlockchain();
  const latestBlock = getLatestBlock(activeBlockchain);

  if (receivedLatestBlock.prevHash === latestBlock.hash) {
    addBlockToActiveBlockchain(receivedLatestBlock);
  } else if (receivedLatestBlock.hash !== latestBlock.hash) {
    sendMessageToSocket(ws, createQueryActiveBlockchainMessage());
  }
};

const handleSendMempool = (message: SendMempoolMessage): void => {
  const receivedMempool: Mempool = message.content;
  receivedMempool.transactions.forEach(maybeAddTransactionToMempool);
};

const handleSendTransaction = (message: SendTransactionMessage): void => {
  const transaction: Transaction = message.content;
  logger.info(`Transaction with id ${transaction.id} received`);

  maybeAddTransactionToMempool(transaction);
};

const maybeAddTransactionToMempool = (transaction: Transaction): void =>
  tryOrLogError(() => addTransactionToMempool(transaction));

const handleSendPeerUrls = (message: SendPeerUrlsMessage): void => {
  const peerUrls: string[] = message.content;
  peerUrls.forEach(connectToPeer);
};

export const handleClose = (ws: WebSocket): void => {
  const peer = getPeerBySocket(ws);

  if (!peer) {
    return;
  }

  removePeer(peer);
};
