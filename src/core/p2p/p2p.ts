import * as WebSocket from 'ws';

import { Blockchain } from '../blockchains';
import logger from '../logger';

export type Peer = {
  socket: WebSocket;
};

let peers: Peer[] = [];

export const initP2pServer = (port: number): void => {
  const p2pServer = new WebSocket.Server({ port });

  p2pServer.on('connection', handleConnection);

  logger.info('');
};

const handleConnection = (ws: WebSocket): void => {
  peers = peers.concat([{ socket: ws }]);
};

export const broadcastBlockchain = (blockchain: Blockchain): void => {
  logger.info('blockchain broadcast');
};
