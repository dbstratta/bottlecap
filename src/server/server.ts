import { ApolloServer } from 'apollo-server';

import { env } from '../config';
import logger from '../core/logger';
import { resolvers, typeDefs } from './schema';

const { graphQLServerPort } = env;

export const startGraphQLServer = async () => {
  const server = new ApolloServer({ typeDefs, resolvers });

  const { url } = await server.listen({ port: graphQLServerPort });

  logger.info(`bottlecap node ready at ${url}`);
};
