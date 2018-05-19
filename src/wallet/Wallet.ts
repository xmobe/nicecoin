/**
 * Copyright 2018 xMobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
                mkdirSync(privateKeyLocation, 484);

                writeFileSync(privateKeyFileLocation, newPrivateKey);
                let signale = new Signale();
                signale.success('new wallet with private key created to : %s', privateKeyFileLocation);
            }
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
        
            console.log('test');
        return sum;
    }
}