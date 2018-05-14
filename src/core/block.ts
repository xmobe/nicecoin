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

/**
 * A Block hold all Block information
 */
export class Block {
    public index: number;
    public timestamp: number;
    public previousHash: Uint8Array;
    public data: any;

    /**
     * Store Hash  of block. If null getHash() will recalculate it.
     */
    private hash: Uint8Array;
    public difficult: number; // 
    public nonce: number;

    /**
     * @constructor Creates an instance of block.
     * @param index 
     * @param timestamp 
     * @param previousHash 
     * @param data 
     * @param difficult 
     * @param nonce 
     */
    constructor(index: number, timestamp: number, previousHash: Uint8Array, data: string, difficult: number, nonce: number) {
        this.index = index;
        this.timestamp = timestamp;
        this.previousHash = previousHash;
        this.data = data;

        this.difficult = difficult;
        this.nonce = nonce;
    }

    /**
     * Calculates hash
     * @returns hash 
     */
    private async calculateHash(): Promise<Uint8Array> {
        console.time('calculateHash Block ' + this.index);
        let self = this;

        let str = '';
        for (let attr in self) {
            if (attr != 'hash') {
                str += self[attr];
            }
        }

        const hashString = await
            Crypto.createHash('SHA256')
                .update(str)
                .digest();

        console.timeEnd('calculateHash Block ' + this.index);
        return hashString;
    }

    /**
     * Gets hash
     * @returns hash 
     */
    public async getHash(): Promise<Uint8Array> {
        if (this.hash == null) {
            this.hash = await this.calculateHash();
            return this.hash;
        } else {
            return this.hash;
        }
    }

    public async getHashAsString(): Promise<string> {
        let hash = await this.getHash();
        return Buffer.from(hash).toString('hex');;
    }

    /**
     * Gets nonce
     * @returns nonce 
     */
    public getNonce(): number {
        return this.nonce;
    }

    /**
     * Sets nonce
     * @param nonce 
     */
    public setNonce(nonce: number) {
        this.nonce = nonce;
        this.hash = null;
    }

    public solve() {

    }

    /**
     * Serializes block
     */
    public serialize() {

    }

    /**
     * Deserializes block
     */
    public deserialize() {

    }
}