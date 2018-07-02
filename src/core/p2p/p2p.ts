import http from 'http';

import WebSocket from 'ws';

import logger from '../logger';
import {
  createSendServerInfoMessage,
  handleClose,
  handleMessage,
  ServerInfo,
} from '../messages';
import { addPeer, sendMessageToSocket } from '../peers';
import {
  nodeId,
  nodeIdHeader,
  nodeUrl,
  nodeUrlHeader,
} from '../peers/constants';

export const startP2pServer = (port: number): void => {
  const p2pServerOptions: WebSocket.ServerOptions = {
    verifyClient,
    port,
    clientTracking: false,
  };
  const p2pServer = new WebSocket.Server(p2pServerOptions);

  p2pServer.on('connection', handleConnection);

  logger.info(`p2p node listening on port ${port}`);
};

const handleConnection = (ws: WebSocket, req: http.IncomingMessage): void => {
  const clientId = req.headers[nodeIdHeader] as string;
  const clientUrl = req.headers[nodeUrlHeader] as string;

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

const verifyClient: WebSocket.VerifyClientCallbackSync = info => {
  const clientId = info.req.headers[nodeIdHeader] as string;
  const clientUrl = info.req.headers[nodeUrlHeader] as string;

  if (!isNodeIdValid(clientId)) {
    return false;
  }

  if (!isNodeUrlValid(clientUrl)) {
    return false;
  }

  return true;
};

const isNodeIdValid = (id: any): boolean => typeof id === 'string';
const isNodeUrlValid = (url: any): boolean => typeof url === 'string';
