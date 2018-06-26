import { ApolloServer } from 'apollo-server';

import logger from '../core/logger';
import { startP2pServer } from '../core/p2p';
import { resolvers, typeDefs } from './schema';

const HTTP_PORT = '4000';
const P2P_PORT = 4100;

const server = new ApolloServer({ typeDefs, resolvers });

export const main = async () => {
  const { url } = await server.listen({ port: HTTP_PORT });

  logger.info(`bottlecap node ready at ${url}`);

  startP2pServer(P2P_PORT);
};

const logErrorAndExit = (error: Error) => {
  logger.error(error);

  process.exit(1);
};

process.once('uncaughtException', logErrorAndExit);
process.once('unhandledRejection', logErrorAndExit);
