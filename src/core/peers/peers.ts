import WebSocket from 'ws';

import { broadcastPeerUrls } from '../broadcasting';
import logger from '../logger';
import { handleClose, handleMessage, Message } from '../messages';
import { nodeId, nodeIdHeader, nodeUrl, nodeUrlHeader } from './constants';
import { Peer } from './types';

let peers: Peer[] = [];

export const getPeers = (): Peer[] => peers;

export const getPeerById = (peerId: string): Peer | null =>
  peers.find(peer => peer.id === peerId) || null;

export const getPeerByUrl = (peerUrl: string): Peer | null =>
  peers.find(peer => peer.url === peerUrl) || null;

export const getPeerBySocket = (ws: WebSocket): Peer | null =>
  peers.find(peer => peer.socket === ws) || null;

export const addPeer = (
  ws: WebSocket,
  peerId: string,
  peerUrl: string,
): void => {
  if (getPeerById(peerId)) {
    ws.close();
    throw new Error(`peer ${peerId} already connected`);
  }

  const newPeer: Peer = { id: peerId, isAlive: true, socket: ws, url: peerUrl };
  peers = [...peers, newPeer];

  logger.info(`Peer ${newPeer.id} (${newPeer.url}) connected`);

  broadcastPeerUrls([newPeer]);
  logger.info(`Peer ${newPeer.id} (${newPeer.url}) broadcast`);
};

export const sendMessageToSocket = (
  socket: WebSocket,
  message: Message,
): void => socket.send(JSON.stringify(message));

export const removePeer = (peer: Peer): void => {
  peers = peers.filter(({ id: peerId }) => peerId === peer.id);
  logger.info(`Peer ${peer.id} disconnected`);
};

export const connectToPeer = (peerUrl: string): void => {
  if (peerUrl === nodeUrl) {
    return;
  }

  const headers = { [nodeIdHeader]: nodeId, [nodeUrlHeader]: nodeUrl };
  try {
    const ws: WebSocket = new WebSocket(peerUrl, { headers });
    ws.on('message', (data: string) => handleMessage(ws, data));
    ws.on('close', handleClose);
  } catch (e) {
    logger.error(e);
  }
};
