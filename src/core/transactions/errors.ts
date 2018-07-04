export class TransactionValidationError extends Error {
  constructor(message: string = 'invalid transaction') {
    super(message);
  }
}

export class CoinbaseTransactionValidationError extends Error {
  constructor(message: string = 'invalid coinbase transaction') {
    super(message);
  }
}
