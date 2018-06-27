import { gql } from 'apollo-server';

import { getActiveBlockchain, mineNextBlock } from '../core/blockchains';
import { Block } from '../core/blocks';
import { getPeers } from '../core/p2p';

export const typeDefs = gql`
  type Query {
    activeBlockchain: Blockchain
    peers: [Peer]
  }

  type Blockchain {
    blocks(
      first: Int
      after: String
      last: Int
      before: String
    ): BlockConnection!
  }

  type BlockConnection {
    edges: [BlockEdge]
    pageInfo: PageInfo!
  }

  type BlockEdge {
    cursor: String!
    node: Block
  }

  type Block {
    index: Int!
    nonce: Int!
    data: BlockData!
    prevHash: String!
    hash: String!
    difficulty: Int!
    timestamp: Int!
  }

  type BlockData {
    coinbaseTransaction: CoinbaseTransaction!
    transactions: [Transaction]!
  }

  type CoinbaseTransaction {
    id: ID!
    blockIndex: Int!
    txOut: TxOut!
  }

  type TxOut {
    address: String!
    amount: Int!
  }

  type Transaction {
    id: ID!
    txIns: [TxIn]!
    txOuts: [TxOut]!
  }

  type TxIn {
    prevOutPoint: OutPoint!
    signature: String!
  }

  type OutPoint {
    txId: ID!
    txOutIndex: Int!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  type Peer {
    id: ID!
  }

  type Mutation {
    mineBlock: Block!
  }
`;

export const resolvers = {
  Query: {
    activeBlockchain: () => ({
      blocks: {
        edges: getActiveBlockchain().map(block => ({ node: block })),
      },
    }),
    peers: () => getPeers(),
  },
  Mutation: {
    mineBlock: (): Promise<Block> => {
      return mineNextBlock();
    },
  },
};
