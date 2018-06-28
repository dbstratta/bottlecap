export class TransactionValidationError extends Error {
  constructor(message: string | undefined = 'invalid transaction') {
    super(message);
  }
}

export class CoinbaseTransactionValidationError extends Error {
  constructor(message: string | undefined = 'invalid coinbase transaction') {
    super(message);
  }
}
