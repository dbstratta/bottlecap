import * as WebSocket from 'ws';

import {
  Blockchain,
  getActiveBlockchain,
  getLatestBlock,
} from '../blockchains';
import { Block } from '../blocks';
import logger from '../logger';
import { getMempool } from '../mempool';

export type Peer = {
  socket: WebSocket;
};

type Message = {
  type: MessageType;
  content: any;
};

enum MessageType {
  QueryActiveBlockchain = 'QUERY_ACTIVE_BLOCKCHAIN',
  QueryLatestBlock = 'QUERY_LATEST_BLOCK',
  QueryMempool = 'QUERY_MEMPOOL',
  RespondActiveBlockchain = 'RESPOND_ACTIVE_BLOCKCHAIN',
  RespondLatestBlock = 'RESPOND_LATEST_BLOCK',
  RespondMempool = 'RESPOND_MEMPOOL',
  BroadcastActiveBlockchain = 'BROADCAST_ACTIVE_BLOCKCHAIN',
  BroadcastLatestBlock = 'BROADCAST_LASTEST_BLOCK',
}

let peers: Peer[] = [];

export const getPeers = (): Peer[] => peers;

export const initP2pServer = (port: number): void => {
  const p2pServer = new WebSocket.Server({ port });

  p2pServer.on('connection', handleConnection);

  logger.info(`p2p node listening on ${port}`);
};

const handleConnection = (ws: WebSocket): void => {
  const newPeer: Peer = { socket: ws };
  peers = [...peers, newPeer];

  ws.on('message', (data: string) => handleMessage(ws, data));
};

const handleMessage = (ws: WebSocket, data: string): void => {
  const message: Message | null = parseMessage(data);

  if (!message) {
    return;
  }

  if (message.type === MessageType.QueryActiveBlockchain) {
    const activeBlockchain = getActiveBlockchain();

    send(ws, {
      type: MessageType.RespondActiveBlockchain,
      content: activeBlockchain,
    });
  } else if (message.type === MessageType.QueryLatestBlock) {
    const latestBlock = getLatestBlock(getActiveBlockchain());

    send(ws, { type: MessageType.RespondLatestBlock, content: latestBlock });
  } else if (message.type === MessageType.RespondMempool) {
    const mempool = getMempool();

    send(ws, { type: MessageType.RespondMempool, content: mempool });
  }

  ws.send(`ack: ${data}`);
};

const parseMessage = (data: string): Message | null => {
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export const broadcastLatestBlock = (block: Block) => {
  broadcast({ type: MessageType.BroadcastLatestBlock, content: block });
};

export const broadcastBlockchain = (blockchain: Blockchain): void => {
  broadcast({
    type: MessageType.BroadcastActiveBlockchain,
    content: blockchain,
  });
};

const broadcast = (message: Message): void =>
  peers.forEach(peer => send(peer.socket, message));

const send = (ws: WebSocket, message: Message): void =>
  ws.send(JSON.stringify(message));
