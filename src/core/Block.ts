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

import * as Crypto from 'crypto';
import { byte2BinaryString, getCurrentTimestamp } from './Utils';
import { Transaction } from './Transaction';

/**
 * A Block hold all Block information
 */
export class Block {
    public index: number;
    public timestamp: number;
    public previousHash: Buffer;
    public data: any;

    private _hash: Buffer;
    public difficult: number;
    public _nonce: number;

    /** 
     * @constructor
     * @param index 
     * @param timestamp 
     * @param previousHash 
     * @param data 
     * @param hash 
     * @param difficult 
     * @param nonce 
     */
    constructor(index: number, timestamp: number, previousHash: Buffer, data: any, difficult: number, nonce: number) {
        this.index = index;
        this.timestamp = getCurrentTimestamp();
        this.previousHash = previousHash;
        this.data = data;

        this.difficult = difficult;
        this._nonce = nonce;
    }

    // constructor(index: number, previousHash: Buffer, transactions: Transaction[]) {
    //     this.index = index;
    //     this.timestamp = getCurrentTimestamp();
    //     this.previousHash = previousHash;
    //     this.data = transactions;
    // }

    private calculateHash(): Buffer {
        let self = this;
        let str = '';
        for (let attr in self) {
            if (attr != '_hash') {
                str += self[attr];
            }
        }

        const hash =
            Crypto.createHash('SHA256')
                .update(str)
                .digest();

        return hash;
    }

    public getHash(): Buffer {
        if (this._hash !== null) {
            this._hash = this.calculateHash();
        }

        return this._hash;
    }

    public getHashAsString(): string {
        const hash = this.getHash();
        return Buffer.from(hash).toString('hex');
    }

    public get nonce(): number {
        return this._nonce;
    }

    public set nonce(_nonce: number) {
        this._nonce = _nonce;
    }

    public serialize() {

    }

    public deserialize() {

    }
}