import * as WebSocket from 'ws';

import { Message } from './messages';

export type Peer = {
  socket: WebSocket;
};

let peers: Peer[] = [];

export const getPeers = (): Peer[] => peers;

export const addPeer = (ws: WebSocket) => {
  const newPeer: Peer = { socket: ws };
  peers = [...peers, newPeer];

  return peers;
};

export const sendMessageToSocket = (
  socket: WebSocket,
  message: Message,
): void => socket.send(JSON.stringify(message));
