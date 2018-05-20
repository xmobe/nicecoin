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