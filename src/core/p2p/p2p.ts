import http from 'http';

import WebSocket from 'ws';
import logger from '../logger';
import { nodeId, nodeIdHeader, nodeUrl, nodeUrlHeader } from './constants';
import { handleClose, handleMessage } from './handlers';
import { createSendServerInfoMessage, ServerInfo } from './messages';
import { addPeer, sendMessageToSocket } from './peers';

export const startP2pServer = (port: number): void => {
  const p2pServerOptions: WebSocket.ServerOptions = {
    port,
    clientTracking: false,
  };
  const p2pServer = new WebSocket.Server(p2pServerOptions);

  p2pServer.on('connection', handleConnection);

  logger.info(`p2p node listening on port ${port}`);
};

export const handleConnection = (
  ws: WebSocket,
  req: http.IncomingMessage,
): void => {
  const clientId = req.headers[nodeIdHeader] as string;
  const clientUrl = req.headers[nodeUrlHeader] as string;

  if (!isNodeIdValid(clientId)) {
    ws.close();
    return;
  }

  try {
    addPeer(ws, clientId, clientUrl);
  } catch (e) {
    logger.error(e);
    return;
  }

  ws.on('message', (data: string) => handleMessage(ws, data));
  ws.on('close', handleClose);

  const serverInfo: ServerInfo = { id: nodeId, url: nodeUrl };
  sendMessageToSocket(ws, createSendServerInfoMessage(serverInfo));
};

const isNodeIdValid = (id: any): boolean => typeof id === 'string';
