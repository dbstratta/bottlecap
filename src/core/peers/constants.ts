import uuidv4 from 'uuid/v4';

const getNodeUrl = (): string => {
  const p2pNodeUrl = process.env.P2P_NODE_URL;

  if (!p2pNodeUrl) {
    throw new Error('P2P_NODE_URL not set');
  }

  return p2pNodeUrl;
};

export const nodeId: string = uuidv4();
export const nodeUrl: string = getNodeUrl();

export const nodeIdHeader = 'x-node-id';
export const nodeUrlHeader = 'x-node-url';
