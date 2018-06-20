import { ApolloServer } from 'apollo-server';

import logger from '../core/logger';
import { resolvers, typeDefs } from './schema';

const server = new ApolloServer({ typeDefs, resolvers });

export const main = async () => {
  const { url } = await server.listen();

  logger.info(`bottlecap node ready at ${url}`);
};
