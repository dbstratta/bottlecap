import http from 'http';

import WebSocket from 'ws';

import logger from '../logger';
import { handleClose, handleMessage } from './handlers';
import { createSendServerIdMessage } from './messages';
import { addPeer, nodeId, sendMessageToSocket } from './peers';

export const startP2pServer = (port: number): void => {
  const p2pServer = new WebSocket.Server({ port });

  p2pServer.on('connection', handleConnection);

  logger.info(`p2p node listening on ${port}`);
};

const nodeIdHeader = 'x-node-id';

export const handleConnection = (
  ws: WebSocket,
  req: http.IncomingMessage,
): void => {
  const clientId = req.headers[nodeIdHeader];

  if (!isNodeIdValid(clientId)) {
    ws.close();
    return;
  }

  try {
    addPeer(ws, clientId as string);
  } catch (e) {
    logger.error(e);
    return;
  }

  sendMessageToSocket(ws, createSendServerIdMessage(nodeId));

  ws.on('message', (data: string) => handleMessage(ws, data));
  ws.on('close', () => handleClose(ws));
};

const isNodeIdValid = (id: any): boolean => typeof id === 'string';

export const connectToPeer = (peerUrl: string): void => {
  const headers = { [nodeIdHeader]: nodeId };
  const ws: WebSocket = new WebSocket(peerUrl, { headers });

  ws.on('message', handleMessage);
  ws.on('close', handleClose);
};
