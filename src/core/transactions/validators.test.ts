import { generateKeyPair } from '../crypto';
import { getTransactionId } from './helpers';
import { signTxIn } from './transactions';
import { OutPoint, Transaction, TxIn, TxOut, UnspentTxOut } from './types';
import { validateTransaction } from './validators';

describe('validateTransaction', () => {
  test("doesn't throw if the transaction is valid", () => {
    const keyPair = generateKeyPair();
    const privateKey = keyPair.privateKey;

    const outPoint: OutPoint = { txId: '1', txOutIndex: 0 };
    const outPoints = [outPoint];
    const address = keyPair.publicKey;
    const amount = 10;

    const unspentTxOut: UnspentTxOut = { outPoint, address, amount };
    const unspentTxOuts = [unspentTxOut];

    const txOut: TxOut = { address, amount };
    const txOuts = [txOut];

    const transactionId = getTransactionId(outPoints, txOuts);

    const txInSignature = signTxIn(transactionId, privateKey);
    const txIn: TxIn = { prevOutPoint: outPoint, signature: txInSignature };
    const txIns = [txIn];

    const transaction: Transaction = {
      txIns,
      txOuts,
      id: transactionId,
    };

    expect(() => validateTransaction(transaction, unspentTxOuts)).not.toThrow();
  });

  test('throws if the signature in a tx in is invalid', () => {
    const keyPair = generateKeyPair();

    const outPoint: OutPoint = { txId: '1', txOutIndex: 0 };
    const outPoints = [outPoint];
    const address = keyPair.publicKey;
    const amount = 10;

    const unspentTxOut: UnspentTxOut = { outPoint, address, amount };
    const unspentTxOuts = [unspentTxOut];

    const txOut: TxOut = { address, amount };
    const txOuts = [txOut];

    const transactionId = getTransactionId(outPoints, txOuts);

    const txInSignature = 'bad_signature';
    const txIn: TxIn = { prevOutPoint: outPoint, signature: txInSignature };
    const txIns = [txIn];

    const transaction: Transaction = {
      txIns,
      txOuts,
      id: transactionId,
    };

    expect(() => validateTransaction(transaction, unspentTxOuts)).toThrow();
  });

  test('throws if a tx in references an invalid out point', () => {
    const keyPair = generateKeyPair();
    const privateKey = keyPair.privateKey;

    const outPoint: OutPoint = { txId: '1', txOutIndex: 0 };
    const outPoints = [outPoint];
    const address = keyPair.publicKey;
    const amount = 10;

    const unspentTxOuts: UnspentTxOut[] = [];

    const txOut: TxOut = { address, amount };
    const txOuts = [txOut];

    const transactionId = getTransactionId(outPoints, txOuts);

    const txInSignature = signTxIn(transactionId, privateKey);
    const txIn: TxIn = { prevOutPoint: outPoint, signature: txInSignature };
    const txIns = [txIn];

    const transaction: Transaction = {
      txIns,
      txOuts,
      id: transactionId,
    };

    expect(() => validateTransaction(transaction, unspentTxOuts)).toThrow();
  });
});
