import WebSocket from 'ws';

/**
 * A peer in a Bottlecap network.
 */
export type Peer = {
  /**
   * An UUID identifying the peer.
   */
  readonly id: string;
  isAlive: boolean;
  socket: WebSocket;
  /**
   * The url that other peers can connect to.
   */
  readonly url: string;
};
