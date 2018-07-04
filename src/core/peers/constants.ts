import uuidv4 from 'uuid/v4';

import { env } from '../../config/config';

export const nodeId: string = uuidv4();
export const nodeUrl: string = env.p2pNodeUrl;

export const nodeIdHeader = 'x-node-id';
export const nodeUrlHeader = 'x-node-url';
