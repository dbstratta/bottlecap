import { Blockchain } from '../blockchains';
import { Block } from '../blocks';
import { Mempool } from '../mempool';
import { Transaction } from '../transactions';
import {
  Message,
  MessageType,
  QueryActiveBlockchainMessage,
  QueryLatestBlockMessage,
  QueryMempoolMessage,
  QueryPeerUrlsMessage,
  SendActiveBlockchainMessage,
  SendLatestBlockMessage,
  SendMempoolMessage,
  SendPeerUrlsMessage,
  SendServerInfoMessage,
  SendTransactionMessage,
  ServerInfo,
} from './types';

export const parseMessage = (data: string): Message | null => {
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export const createQueryActiveBlockchainMessage = (): QueryActiveBlockchainMessage => ({
  type: MessageType.QueryActiveBlockchain,
  content: null,
});

export const createQueryLatestBlockMessage = (): QueryLatestBlockMessage => ({
  type: MessageType.QueryLatestBlock,
  content: null,
});

export const createQueryMempoolMessage = (): QueryMempoolMessage => ({
  type: MessageType.QueryMempool,
  content: null,
});

export const createQueryPeerUrlsMessage = (): QueryPeerUrlsMessage => ({
  type: MessageType.QueryPeerUrls,
  content: null,
});

export const createSendServerInfoMessage = (
  serverInfo: ServerInfo,
): SendServerInfoMessage => ({
  type: MessageType.SendServerInfo,
  content: serverInfo,
});

export const createSendActiveBlockchainMessage = (
  activeBlockchain: Blockchain,
): SendActiveBlockchainMessage => ({
  type: MessageType.SendActiveBlockchain,
  content: activeBlockchain,
});

export const createSendLatestBlockMessage = (
  latestBlock: Block,
): SendLatestBlockMessage => ({
  type: MessageType.SendLatestBlock,
  content: latestBlock,
});

export const createSendTransactionMessage = (
  transaction: Transaction,
): SendTransactionMessage => ({
  type: MessageType.SendTransaction,
  content: transaction,
});

export const createSendMempoolMessage = (
  mempool: Mempool,
): SendMempoolMessage => ({
  type: MessageType.SendMempool,
  content: mempool,
});

export const createSendPeerUrlsMessage = (
  peerUrls: string[],
): SendPeerUrlsMessage => ({
  type: MessageType.SendPeerUrls,
  content: peerUrls,
});
