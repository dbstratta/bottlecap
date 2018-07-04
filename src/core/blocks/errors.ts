export class BlockValidationError extends Error {
  constructor(message: string = 'invalid block') {
    super(message);
  }
}
