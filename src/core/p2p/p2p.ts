import * as WebSocket from 'ws';

import { Blockchain } from '../blockchains';
import { Block } from '../blocks';
import logger from '../logger';
import { Mempool } from '../mempool';

export type Peer = {
  socket: WebSocket;
};

let peers: Peer[] = [];

export const initP2pServer = (port: number): void => {
  const p2pServer = new WebSocket.Server({ port });

  p2pServer.on('connection', handleConnection);

  logger.info(`p2p node listening on ${port}`);
};

const handleConnection = (ws: WebSocket): void => {
  peers = [...peers, { socket: ws }];

  ws.on('message', (data: string) => handleMessage(ws, data));
};

const handleMessage = (ws: WebSocket, data: string): void => {
  logger.info(data);
  ws.send(`ack: ${data}`);
};

export const broadcastLatestBlock = (block: Block) => {
  broadcast(JSON.stringify(block));
};

export const broadcastBlockchain = (blockchain: Blockchain): void => {
  broadcast(JSON.stringify(blockchain));
};

export const broadcastMempool = (mempool: Mempool): void => {
  broadcast(JSON.stringify(mempool));
};

const broadcast = (data: string): void =>
  peers.forEach(peer => peer.socket.send(data));
