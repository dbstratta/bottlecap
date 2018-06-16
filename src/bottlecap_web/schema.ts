import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Query {
    blockchain: Blockchain
    peers: [Peer]
  }

  type Blockchain {
    blocks(first: Int, after: ID): BlockConnection
  }

  type BlockConnection {
    edges: [BlockEdge]
  }

  type BlockEdge {
    node: Block
  }

  type Block {
    index: Int
  }

  type Peer {
    name: String
  }
`;

export const resolvers = {
  Query: {
    blockchain: () => ({
      name: 'block',
    }),
  },
};
