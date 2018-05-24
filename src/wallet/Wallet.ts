/*
 * The MIT License (MIT)
 * Copyright (c) 2018 xMobe https://www.xmobe.com
 * Author: Arkay Lee <quanganh@aiti.com.vn>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software
 * and associated documentation files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

import { ec as EC, secp256k1 as SECP256K1 } from 'elliptic';
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import { Signale } from 'signale';

import { UnspentTxOut } from '../core';

const privateKeyLocation = 'wallet';
const privateKeyFile = 'private_key';

export class Wallet {
    private EC: SECP256K1;
    private path: string;

    constructor(path: string = privateKeyLocation) {
        this.path = path;

        this.EC = new EC('secp256k1');
        if (!existsSync(`${this.path}/${privateKeyFile}`)) {
            const newPrivateKey = this.generatePrivatekey();
            const signale = new Signale();
            if (!existsSync(this.path)) {
                signale.info('here');
                try {
                    mkdirSync(this.path, 484);
                } catch (error) {
                    signale.error(error);
                }
            }

            try {
                writeFileSync(`./${this.path}/${privateKeyFile}`, newPrivateKey, {mode: 0o666, flag: 'wx'});
                signale.success('new wallet with private key created to: ', `${this.path}/${privateKeyFile}`);
            } catch (error) {
                signale.error(error);
            }
        }
    }

    public getPrivateFromWallet(): string {
        const buffer = readFileSync(`${this.path}/${privateKeyFile}`, 'utf8');

        return buffer.toString();
    }

    public getPublicFromWallet(): string {
        const privateKey = this.getPrivateFromWallet();
        const key = this.EC.keyFromPrivate(privateKey, 'hex');

        return key.getPublic().encode('hex');
    }

    public getBalance(address: string, unspentTxOuts: UnspentTxOut[]): number {
        let sum = 0;
        unspentTxOuts
            .filter((uTxO: UnspentTxOut) => uTxO.address === address)
            .map((uTxO: UnspentTxOut) => uTxO.amount)
            .forEach(amount => {
                sum += amount;
            });

        return sum;
    }

    private generatePrivatekey(): string {
        let keyPair;
        let privateKey;

        try {
            keyPair = this.EC.genKeyPair();
            privateKey = keyPair.getPrivate();
        } catch {
            privateKey = '';
            throw Error('can not generate Private Key');
        }

        return privateKey.toString(16);
    }
}
