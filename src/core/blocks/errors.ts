export class BlockValidationError extends Error {
  constructor(message: string | undefined = 'invalid block') {
    super(message);
  }
}
