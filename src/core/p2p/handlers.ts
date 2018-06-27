import WebSocket from 'ws';

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
import { addPeer, removePeer, sendMessageToSocket } from './peers';

export const handleMessage = (ws: WebSocket, data: string): void => {
  const message: Message | null = parseMessage(data);

  if (!message) {
    return;
  }

  if (message.type === MessageType.sendServerId) {
    handleSendServerId(ws, message);
  } else if (message.type === MessageType.QueryActiveBlockchain) {
    handleQueryActiveBlockchain(ws);
  } else if (message.type === MessageType.QueryLatestBlock) {
    handleQueryLatestBlock(ws);
  } else if (message.type === MessageType.QueryMempool) {
    handleQueryMempool(ws);
  } else if (message.type === MessageType.RespondLatestBlock) {
    handleRespondLatestBlock(ws, message);
  } else if (message.type === MessageType.RespondMempool) {
    handleRespondMempool(ws, message);
  } else if (message.type === MessageType.BroadcastTransaction) {
    handleBroadcastTransaction(ws, message);
  }
};

const handleSendServerId = (ws: WebSocket, message: Message): void => {
  const serverId: string = message.content;

  try {
    addPeer(ws, serverId);
  } catch (e) {
    logger.error(e);
  }
};

const handleQueryActiveBlockchain = (ws: WebSocket): void => {
  const activeBlockchain = getActiveBlockchain();

  sendMessageToSocket(ws, {
    type: MessageType.RespondActiveBlockchain,
    content: activeBlockchain,
  });
};

const handleQueryLatestBlock = (ws: WebSocket): void => {
  const latestBlock = getLatestBlock(getActiveBlockchain());

  sendMessageToSocket(ws, {
    type: MessageType.RespondLatestBlock,
    content: latestBlock,
  });
};

const handleQueryMempool = (ws: WebSocket): void => {
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

export const handleClose = (ws: WebSocket): void => {
  removePeer(ws);
};
