import { ApolloServer } from 'apollo-server';

import logger from '../core/logger';
import { initP2pServer } from '../core/p2p';
import { resolvers, typeDefs } from './schema';

const HTTP_PORT = 4000;
const P2P_PORT = 4100;

const server = new ApolloServer({ typeDefs, resolvers });

export const main = async () => {
  const { url } = await server.listen({ port: HTTP_PORT });

  logger.info(`bottlecap node ready at ${url}`);

  initP2pServer(P2P_PORT);
};
