import WebSocket from 'ws';

import logger from '../logger';
import { nodeId, nodeIdHeader, nodeUrl, nodeUrlHeader } from './constants';
import { handleClose, handleMessage } from './handlers';

export const connectToPeer = (peerUrl: string): void => {
  const headers = { [nodeIdHeader]: nodeId, [nodeUrlHeader]: nodeUrl };
  try {
    const ws: WebSocket = new WebSocket(peerUrl, { headers });
    ws.on('message', (data: string) => handleMessage(ws, data));
    ws.on('close', handleClose);
  } catch (e) {
    logger.error(e);
  }
};
