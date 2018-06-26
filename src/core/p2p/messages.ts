export type Message = {
  type: MessageType;
  content: any;
};

export enum MessageType {
  QueryActiveBlockchain = 'QUERY_ACTIVE_BLOCKCHAIN',
  QueryLatestBlock = 'QUERY_LATEST_BLOCK',
  QueryMempool = 'QUERY_MEMPOOL',

  RespondActiveBlockchain = 'RESPOND_ACTIVE_BLOCKCHAIN',
  RespondLatestBlock = 'RESPOND_LATEST_BLOCK',
  RespondMempool = 'RESPOND_MEMPOOL',

  BroadcastActiveBlockchain = 'BROADCAST_ACTIVE_BLOCKCHAIN',
  BroadcastLatestBlock = 'BROADCAST_LASTEST_BLOCK',
  BroadcastTransaction = 'BROADCAST_TRANSACTION',
}

export const parseMessage = (data: string): Message | null => {
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};
