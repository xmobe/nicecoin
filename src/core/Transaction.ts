/**
 * Copyright 2018 xMobe https://www.xmobe.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

import { ec, secp256k1 } from 'elliptic';
import * as Crypto from 'crypto';
import { TxIn } from './TransactionIn';
import { TxOut } from './TransactionOut';
import { UnspentTxOut } from '.';

import { toHexString } from './Utils';

export class Transaction {
    public id: string;
    public txIns: TxIn[];
    public txOuts: TxOut[];

    private EC: secp256k1;

    constructor() {
        this.EC = new ec('secp256k1');
    }

    public getTransactionId(): string {
        const txInContent: string = this.txIns
            .map((txIn: TxIn) => {
                return txIn.txId + txIn.txOutIndex;
            })
            .reduce((a, b) => {
                return (a + b).toString();
            });

        const txOutContent: string = this.txOuts
            .map((txOut: TxOut) => {
                return txOut.publicKey + txOut.publicKey;
            })
            .reduce((a, b) => {
                return (a + b);
            });

        this.id = Crypto.createHash('SHA256')
            .update(txInContent + txOutContent)
            .digest('hex');

        return this.id;
    }

    private findUnspentTxOut(index: number, unspendTxOuts: UnspentTxOut[]): UnspentTxOut {
        return unspendTxOuts.find((uTxO) => uTxO.txOutId === this.id && uTxO.txOutIndex === index);
    }

    public signTxIn(index: number, privateKey: string, unspendTxOuts: UnspentTxOut[]): string {
        const txIn: TxIn = this.txIns[index];

        const data2Sign = this.id;

        const referencedUnspendTxOut: UnspentTxOut = this.findUnspentTxOut(index, unspendTxOuts);

        if (referencedUnspendTxOut === null) {
            throw Error('Could not find referenced txOut');
        }

        const referencedAddress = referencedUnspendTxOut.address;

        if (this.getPublicKey(privateKey) !== referencedAddress) {
            throw Error('trying to sign an input with private key that does not match the address that is referenced in txIn');
        }

        const key = this.EC.keyFromPrivate(privateKey, 'hex');
        const signature: string = toHexString(key.sign(data2Sign).toDER());

        return signature;
    }

    private getPublicKey(privateKey: string): string {
        return this.EC.keyFromPrivate(privateKey, 'hex').getPublic().encode('hex');
    }
}