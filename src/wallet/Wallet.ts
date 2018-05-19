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
import { existsSync, readFileSync, unlinkSync, writeFileSync, mkdirSync } from 'fs';
import { Signale } from 'signale';

import { UnspentTxOut } from '../core';

const privateKeyLocation = 'wallet';
const privateKeyFileLocation = 'wallet/private_key';

export class Wallet {
    private EC: secp256k1;

    constructor() {
        this.EC = new ec('secp256k1');

        if (!existsSync(privateKeyFileLocation)) {
            const newPrivateKey = this.generatePrivatekey();

            if (!existsSync(privateKeyLocation)) {
                mkdirSync(privateKeyLocation, 484)
            }

            writeFileSync(privateKeyFileLocation, newPrivateKey);
            let signale = new Signale();
            signale.success('new wallet with private key created to : %s', privateKeyFileLocation);
        }
    }


    public getPrivateFromWallet(): string {
        const buffer = readFileSync(privateKeyFileLocation, 'utf8');
        return buffer.toString();
    }

    public getPublicFromWallet(): string {
        const privateKey = this.getPrivateFromWallet();
        const key = this.EC.keyFromPrivate(privateKey, 'hex');
        return key.getPublic().encode('hex');
    }

    private generatePrivatekey(): string {
        const keyPair = this.EC.genKeyPair();
        const privateKey = keyPair.getPrivate();

        return privateKey.toString(16);
    }

    public getBalance(address: string, unspentTxOuts: UnspentTxOut[]): number {
        let sum = 0;
        unspentTxOuts
            .filter((uTxO: UnspentTxOut) => {
                return uTxO.address === address;
            })
            .map((uTxO: UnspentTxOut) => {
                return uTxO.amount;
            })
            .forEach(amount => {
                sum += amount;
            })
        return sum;
    }
}