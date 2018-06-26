import * as WebSocket from 'ws';

import {
  addBlockToActiveBlockchain,
  getActiveBlockchain,
  getLatestBlock,
} from '../blockchains';
import { Block } from '../blocks';
import logger from '../logger';
import { addTransactionToMempool, getMempool, Mempool } from '../mempool';
import { Transaction } from '../transactions';
import { Message, MessageType, parseMessage } from './messages';
import { addPeer, sendMessageToSocket } from './peers';

export const startP2pServer = (port: number): void => {
  const p2pServer = new WebSocket.Server({ port });

  p2pServer.on('connection', handleConnection);

  logger.info(`p2p node listening on ${port}`);
};

const handleConnection = (ws: WebSocket): void => {
  addPeer(ws);

  ws.on('message', (data: string) => handleMessage(ws, data));
};

const handleMessage = (ws: WebSocket, data: string): void => {
  const message: Message | null = parseMessage(data);

  if (!message) {
    return;
  }

  if (message.type === MessageType.QueryActiveBlockchain) {
    handleQueryActiveBlockchain(ws, message);
  } else if (message.type === MessageType.QueryLatestBlock) {
    handleQueryLatestBlock(ws, message);
  } else if (message.type === MessageType.QueryMempool) {
    handleQueryMempool(ws, message);
  } else if (message.type === MessageType.RespondLatestBlock) {
    handleRespondLatestBlock(ws, message);
  } else if (message.type === MessageType.RespondMempool) {
    handleRespondMempool(ws, message);
  } else if (message.type === MessageType.BroadcastTransaction) {
    handleBroadcastTransaction(ws, message);
  }
};

const handleQueryActiveBlockchain = (ws: WebSocket, message: Message): void => {
  const activeBlockchain = getActiveBlockchain();

  sendMessageToSocket(ws, {
    type: MessageType.RespondActiveBlockchain,
    content: activeBlockchain,
  });
};

const handleQueryLatestBlock = (ws: WebSocket, message: Message): void => {
  const latestBlock = getLatestBlock(getActiveBlockchain());

  sendMessageToSocket(ws, {
    type: MessageType.RespondLatestBlock,
    content: latestBlock,
  });
};

const handleQueryMempool = (ws: WebSocket, message: Message): void => {
  const mempool = getMempool();

  sendMessageToSocket(ws, {
    type: MessageType.RespondMempool,
    content: mempool,
  });
};

const handleRespondLatestBlock = (ws: WebSocket, message: Message): void => {
  const receivedLatestBlock: Block = message.content;
  const activeBlockchain = getActiveBlockchain();
  const latestBlock = getLatestBlock(activeBlockchain);

  if (receivedLatestBlock.prevHash === latestBlock.hash) {
    addBlockToActiveBlockchain(receivedLatestBlock);
  } else if (receivedLatestBlock.hash !== latestBlock.hash) {
    sendMessageToSocket(ws, {
      type: MessageType.QueryActiveBlockchain,
      content: null,
    });
  }
};

const handleRespondMempool = (ws: WebSocket, message: Message): void => {
  const receivedMempool: Mempool = message.content;

  receivedMempool.transactions.forEach(transaction => {
    try {
      addTransactionToMempool(transaction);
    } catch (e) {
      logger.error(e.message);
    }
  });
};

const handleBroadcastTransaction = (ws: WebSocket, message: Message): void => {
  const transaction: Transaction = message.content;

  try {
    addTransactionToMempool(transaction);
  } catch (e) {
    logger.error(e.message);
  }
};
