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

/**
 * A Block hold all Block information
 */ 
export class Block {
    public index: number;
    public timestamp: number;
    public previousHash: string;
    public data: string;

    public hash: string;
    difficult: number;
    nonce: number;
    

    constructor(index: number, timestamp: number, previousHash: string, data: string, hash: string) {
        this.index = index;
        this.timestamp = timestamp;
        this.hash = hash;
        this.data = data;
        this.previousHash = previousHash;
    }

    calculateHash() {
        
    }
}