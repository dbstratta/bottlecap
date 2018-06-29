declare module 'elliptic' {
  declare type Encoding = 'hex';

  declare class ec {
    constructor(curveName: string);
    public genKeyPair(): KeyPair;
    public keyFromPrivate(privateKey: string, encoding: Encoding): KeyPair;
    public keyFromPublic(publicKey: string, encoding: Encoding): KeyPair;
  }

  declare class KeyPair {
    public getPublic(encoding: Encoding): string;
    public getPrivate(encoding: Encoding): string;
    public sign(data: string): Signature;
    public verify(data: string, signature: string): boolean;
  }

  declare class Signature {
    public toDER(encoding: Encoding): string;
  }
}
