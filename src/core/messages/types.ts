import { Blockchain } from '../blockchains';
import { Block } from '../blocks';
import { Mempool } from '../mempool';
import { Transaction } from '../transactions';

export type Message =
  | QueryActiveBlockchainMessage
  | QueryLatestBlockMessage
  | QueryMempoolMessage
  | QueryPeerUrlsMessage
  | SendServerInfoMessage
  | SendActiveBlockchainMessage
  | SendLatestBlockMessage
  | SendTransactionMessage
  | SendMempoolMessage
  | SendPeerUrlsMessage;

export type QueryActiveBlockchainMessage = {
  readonly type: MessageType.QueryActiveBlockchain;
  readonly content: null;
};

export type QueryLatestBlockMessage = {
  readonly type: MessageType.QueryLatestBlock;
  readonly content: null;
};

export type QueryMempoolMessage = {
  readonly type: MessageType.QueryMempool;
  readonly content: null;
};

export type QueryPeerUrlsMessage = {
  readonly type: MessageType.QueryPeerUrls;
  readonly content: null;
};

export type SendServerInfoMessage = {
  readonly type: MessageType.SendServerInfo;
  readonly content: ServerInfo;
};

export type SendActiveBlockchainMessage = {
  readonly type: MessageType.SendActiveBlockchain;
  readonly content: Blockchain;
};

export type SendLatestBlockMessage = {
  readonly type: MessageType.SendLatestBlock;
  readonly content: Block;
};

export type SendTransactionMessage = {
  readonly type: MessageType.SendTransaction;
  readonly content: Transaction;
};

export type SendMempoolMessage = {
  readonly type: MessageType.SendMempool;
  readonly content: Mempool;
};

export type SendPeerUrlsMessage = {
  readonly type: MessageType.SendPeerUrls;
  readonly content: string[];
};

export type ServerInfo = {
  readonly id: string;
  readonly url: string;
};

export enum MessageType {
  QueryActiveBlockchain = 'QUERY_ACTIVE_BLOCKCHAIN',
  QueryLatestBlock = 'QUERY_LATEST_BLOCK',
  QueryMempool = 'QUERY_MEMPOOL',
  QueryPeerUrls = 'QUERY_PEER_URLS',

  SendServerInfo = 'SEND_SERVER_INFO',
  SendActiveBlockchain = 'SEND_ACTIVE_BLOCKCHAIN',
  SendLatestBlock = 'SEND_LATEST_BLOCK',
  SendTransaction = 'SEND_TRANSACTION',
  SendMempool = 'SEND_MEMPOOL',
  SendPeerUrls = 'SEND_PEER_URLS',
}
