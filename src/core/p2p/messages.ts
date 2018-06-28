import { Blockchain } from '../blockchains';
import { Block } from '../blocks';
import { Mempool } from '../mempool';
import { Transaction } from '../transactions';

export type Message = {
  type: MessageType;
  content: any;
};

export enum MessageType {
  QueryActiveBlockchain = 'QUERY_ACTIVE_BLOCKCHAIN',
  QueryLatestBlock = 'QUERY_LATEST_BLOCK',
  QueryMempool = 'QUERY_MEMPOOL',

  SendServerId = 'SEND_SERVER_ID',
  SendActiveBlockchain = 'SEND_ACTIVE_BLOCKCHAIN',
  SendLatestBlock = 'SEND_LATEST_BLOCK',
  SendTransaction = 'SEND_TRANSACTION',
  SendMempool = 'SEND_MEMPOOL',
}

export const parseMessage = (data: string): Message | null => {
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export const createQueryActiveBlockchainMessage = (): Message => ({
  type: MessageType.QueryActiveBlockchain,
  content: null,
});

export const createQueryLatestBlockMessage = (): Message => ({
  type: MessageType.QueryLatestBlock,
  content: null,
});

export const createQueryMempoolMessage = (): Message => ({
  type: MessageType.QueryMempool,
  content: null,
});

export const createSendServerIdMessage = (serverId: string): Message => ({
  type: MessageType.SendServerId,
  content: serverId,
});

export const createSendActiveBlockchainMessage = (
  activeBlockchain: Blockchain,
): Message => ({
  type: MessageType.SendActiveBlockchain,
  content: activeBlockchain,
});

export const createSendLatestBlockMessage = (latestBlock: Block): Message => ({
  type: MessageType.SendLatestBlock,
  content: latestBlock,
});

export const createSendTransactionMessage = (
  transaction: Transaction,
): Message => ({
  type: MessageType.SendTransaction,
  content: transaction,
});

export const createSendMempoolMessage = (mempool: Mempool): Message => ({
  type: MessageType.SendMempool,
  content: mempool,
});
