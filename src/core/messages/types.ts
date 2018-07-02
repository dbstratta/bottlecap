export type Message = {
  type: MessageType;
  content: any;
};

export type ServerInfo = {
  id: string;
  url: string;
};

export enum MessageType {
  QueryActiveBlockchain = 'QUERY_ACTIVE_BLOCKCHAIN',
  QueryLatestBlock = 'QUERY_LATEST_BLOCK',
  QueryMempool = 'QUERY_MEMPOOL',
  QueryPeers = 'QUERY_PEERS',

  SendServerInfo = 'SEND_SERVER_INFO',
  SendActiveBlockchain = 'SEND_ACTIVE_BLOCKCHAIN',
  SendLatestBlock = 'SEND_LATEST_BLOCK',
  SendTransaction = 'SEND_TRANSACTION',
  SendMempool = 'SEND_MEMPOOL',
  SendPeers = 'SEND_PEERS',
}
