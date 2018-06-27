import uuidv4 from 'uuid/v4';
import WebSocket from 'ws';

import logger from '../logger';
import { Message } from './messages';

export type Peer = {
  id: string;
  isAlive: boolean;
  socket: WebSocket;
};

export const nodeId: string = uuidv4();

let peers: Peer[] = [];

export const getPeers = (): Peer[] => peers;

export const getPeerById = (peerId: string): Peer | null =>
  peers.find(peer => peer.id === peerId) || null;

export const getPeerBySocket = (ws: WebSocket): Peer =>
  peers.find(peer => peer.socket === ws) as Peer;

export const addPeer = (ws: WebSocket, peerId: string) => {
  if (getPeerById(peerId)) {
    ws.close();
    throw new Error(`peer ${peerId} already connected`);
  }

  const newPeer: Peer = { id: peerId, isAlive: true, socket: ws };
  peers = [...peers, newPeer];

  logger.info(`Peer ${newPeer.id} connected`);
};

export const sendMessageToSocket = (
  socket: WebSocket,
  message: Message,
): void => socket.send(JSON.stringify(message));

export const removePeer = (ws: WebSocket): void => {
  const peerToRemove: Peer = getPeerBySocket(ws);

  peers = peers.filter(peer => peer.socket !== ws);

  logger.info(`Peer ${peerToRemove.id} disconnected`);
};
