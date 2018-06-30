import { gql } from 'apollo-server';

import { getActiveBlockchain, mineNextBlock } from '../core/blockchains';
import { Block } from '../core/blocks';
import { getPeers } from '../core/p2p';
import { Transaction } from '../core/transactions';
import {
  getBalanceOfCurrentWallet,
  getConfirmedBalanceOfCurrentWallet,
  getCurrentWallet,
  sendToAddress,
} from '../core/wallets';

export const typeDefs = gql`
  type Query {
    wallet: Wallet!
    activeBlockchain: Blockchain!
    peers: [Peer]
  }

  type Wallet {
    address: String!
    balance: Int!
    confirmedBalance: Int!
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
    sendToAddress(address: String!, amount: Int!): Transaction!
  }
`;

const resolveSendToAddress = (
  rootValue: any,
  args: any,
): Promise<Transaction> => sendToAddress(args.address, args.amount);

export const resolvers = {
  Query: {
    wallet: () => ({
      address: getCurrentWallet().keyPair.publicKey,
      balance: getBalanceOfCurrentWallet(),
      confirmedBalance: getConfirmedBalanceOfCurrentWallet(),
    }),
    activeBlockchain: () => ({
      blocks: {
        edges: getActiveBlockchain().map(block => ({ node: block })),
      },
    }),
    peers: () => getPeers(),
  },
  Mutation: {
    mineBlock: (): Block => mineNextBlock(),
    sendToAddress: resolveSendToAddress,
  },
};
