import { ApolloServer } from 'apollo-server';

import logger from '../core/logger';
import { resolvers, typeDefs } from './schema';

const HTTP_SERVER_PORT = process.env.HTTP_SERVER_PORT || '4000';

export const startServer = async () => {
  const server = new ApolloServer({ typeDefs, resolvers });

  const { url } = await server.listen({ port: HTTP_SERVER_PORT });

  logger.info(`bottlecap node ready at ${url}`);
};
