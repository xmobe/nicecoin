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

// var GPU = require('gpu.js');
import * as Crypto from 'crypto';
import { GPU } from 'gpu.js';
import { Signale } from 'signale';
import { Block } from './Block';
import { Transaction } from './Transaction';
import { TxIn } from './TransactionIn';
import { byte2BinaryString, getCurrentTimestamp } from './Utils';
import { UnspentTxOut } from './UTXO';

// in seconds
const BLOCK_GENERATION_INTERVAL: number = 10;
// in blocks
const DIFFICULTY_ADJUSTMENT_INTERVAL: number = 10;
const TIME_EXPECTED: number = BLOCK_GENERATION_INTERVAL * DIFFICULTY_ADJUSTMENT_INTERVAL;
const MINUTES: number = 60;
const COINBASE_AMOUNT: number = 50;

/**
 * Chain
 */
export class Chain {
    public static async getInstance(): Promise<Chain> {
        if (!Chain.instance) {
            Chain.instance = new Chain();
            await Chain.instance.createGenesisBlock();
        }

        return Chain.instance;
    }

    private static instance: Chain = null;

    private blocks: Block[];
    private currentBlock: Block = null;
    private unspentTxOuts: UnspentTxOut[];

    /**
     * Creates an instance of chain.
     * @constructor
     */
    private constructor() {
        this.blocks = new Array<Block>();
        this.unspentTxOuts = new Array<UnspentTxOut>();
    }

    public getUnspentTxOuts() {
        return this.unspentTxOuts;
    }

    public getCurrentBlock() {
        return this.currentBlock;
    }

    public getLatestBlock() {
        return this.blocks[this.blocks.length - 1];
    }

    public mine(blockData: any): Block {
        const signale = new Signale();
        const prevBlock: Block = this.getLatestBlock();
        const nextIndex: number = prevBlock.index + 1;

        signale.time(`Mine Block ${nextIndex} in`);
        const difficulty: number = this.getDifficulty();

        const timestamp: number = getCurrentTimestamp();
        const prevHash = prevBlock.getHash();

        // using GPU libs
        // const gpu = new GPU({ model: 'cpu' });
        // const self = this;
        /* tslint:disable */
        // const pow = gpu.createKernel(function (index: number, timestamp: number, previousHash: Buffer, data: any, difficulty: number) {
        /* tslint:enable */
        //     let nonce = 0;
        //     while (nonce < this.constants.size) {
        //         let block = new Block(index, timestamp, previousHash, data, difficulty, nonce)
        //         const hash: Buffer = block.getHash();

        //         // let isMatchDifficulty = await this.hashMatchesDifficulty(hash, difficulty, nonce);
        //         let isMatchDifficulty = self.hashMatchesDifficulty2(hash, difficulty);

        //         if (isMatchDifficulty) {
        //             let hashString: string = '';

        //             for (let i = 0; i < 5; i++) {
        //                 hashString += byte2BinaryString(hash[i]) + ' ';
        //             }
        //             let signale = new Signale();
        //             signale.success('   Hash: ', Buffer.from(hash).toString('hex'));
        //             signale.debug('   Hash Binary: ', hashString);

        //             return block;
        //         }

        //         nonce++;
        //     }
        // }, {
        //         constants: { size: 512 },
        //         output: [512, 512],
        //     });
        // const newBlock = pow(nextIndex, timestamp, prevHash, blockData, difficulty);

        const newBlock: Block = this.PoW(nextIndex, timestamp, prevHash, blockData, difficulty);

        if (newBlock) {
            const isAdded = this.addBlockToChain(newBlock);
            if (isAdded) {
                signale.timeEnd(`Mine Block ${nextIndex} in`);

                return newBlock;
            }
        }
    }

    /**
     * hashMatchesDifficulty just use for testing purpose.
     *
     * The Proof-of-work puzzle is to find a block hash, that has a specific number of zeros prefixing it.
     * The difficulty property defines how many prefixing zeros the block hash must have , in order for
     * the block to be valid.
     *
     * @param hash
     * @param difficult
     * @param nonce
     */
    public hashMatchesDifficulty(hash: Buffer, difficult: number, nonce: number): boolean {
        // TODO: Need improve, working with Binary data
        let hashString: string = '';

        for (const i of hash) {
            hashString += `${byte2BinaryString(hash[i])} `;
        }

        const requiredPrefix: string = '0'.repeat(difficult);
        const signale = new Signale();
        if (hashString.startsWith(requiredPrefix) && difficult < 8) {
            signale.success('   Hash: ', Buffer.from(hash).toString('hex'));
            signale.debug('   Hash Binary: ', hashString);
        } else if (difficult >= 8) {
            if (hashString.startsWith(requiredPrefix)) {
                signale.log(Buffer.from(hash).toString('hex'));
            }
            const check = (nonce % 1000);
            if (check === 0) {
                signale.log(hashString);
            }
        }

        return hashString.startsWith(requiredPrefix);
    }

    /**
     * hashMatchesDifficulty2 working with Buffer Binary data,
     * The Proof-of-work puzzle is to find a block hash, that has a specific number of zeros prefixing it.
     * The difficulty property defines how many prefixing zeros the block hash must have , in order for the
     * block to be valid.
     *
     * @param hash
     * @param difficult
     */
    public hashMatchesDifficulty2(hash: Buffer, difficult: number): boolean {
        for (let i = 0; i < difficult; i++) {
            const byte = ~~(i / 8);
            const bit = i % 8;
            const hashByte = hash[byte];

            if (hashByte & Math.pow(2, (7 - bit))) {
                return false;
            }
        }

        return true;
    }

    /**
     * In order to find a hash that satisfies the difficulty, we must be able to calculate different hashes
     * for the same content of the block. This is done by modifying the nonce parameter.
     * Because SHA256 is a hash function, each time anything in the block changes, the hash will be completely
     * different.
     *
     * “Mining” is basically just trying a different nonce until the block hash matches the difficulty.
     *
     * @param index
     * @param timestamp
     * @param previousHash
     * @param data
     * @param difficulty
     */
    public PoW(index: number, timestamp: number, previousHash: Buffer, data: any, difficulty: number): Block {
        let nonce = 0;
        while (true) {
            const block = new Block(index, timestamp, previousHash, data, difficulty, nonce);
            const hash: Buffer = block.getHash();

            // let isMatchDifficulty = await this.hashMatchesDifficulty(hash, difficulty, nonce);
            const isMatchDifficulty = this.hashMatchesDifficulty2(hash, difficulty);

            if (isMatchDifficulty) {
                let hashString: string = '';

                for (let i = 0; i < 5; i++) {
                    hashString += `${byte2BinaryString(hash[i])} `;
                }
                const signale = new Signale();
                signale.success('   Hash: ', Buffer.from(hash).toString('hex'));
                signale.debug('   Hash Binary: ', hashString);

                return block;
            }

            nonce++;
            // if (nonce === 1000) {
            //     return null;
            // }
        }
    }

    /**
     * Gets adjusted difficulty
     * The expected time represents the case where the hashrate matches exactly the current difficulty.
     * We either increase or decrease the difficulty by one if the time taken is at least two times greater
     * or smaller than the expected difficulty.
     *
     * To calculate the difficulty for the next Ethereum block, you calculate the time it took to mine the
     * previous block, and if that time difference was greater than the goal time, then the difficulty goes
     * down to make mining the next block quicker. If it was less than the time goal, then difficulty goes
     * up to attempt to mine the next block quicker.
     *
     * @param latestBlock
     * @returns
     */
    public getAdjustedDifficulty(latestBlock: Block) {
        const preAdjustmentBlock = this.blocks[this.blocks.length - DIFFICULTY_ADJUSTMENT_INTERVAL];

        const timeTaken: number = latestBlock.timestamp - preAdjustmentBlock.timestamp;
        const signale = new Signale();
        signale.note(`   Time Taken to mine ${DIFFICULTY_ADJUSTMENT_INTERVAL} blocks: `, timeTaken, TIME_EXPECTED);

        if (timeTaken < TIME_EXPECTED / 2) {
            signale.info('   Difficulty: ', preAdjustmentBlock.difficult + 1);

            return preAdjustmentBlock.difficult + 1;
        } else if (timeTaken > TIME_EXPECTED * 2) {
            signale.info('   Difficulty: ', preAdjustmentBlock.difficult - 1);

            return preAdjustmentBlock.difficult - 1;
        } else {
            signale.info('   Difficulty: ', preAdjustmentBlock.difficult);

            return preAdjustmentBlock.difficult;
        }
    }

    /**
     * Gets difficulty
     * For every 10 blocks that is generated, we check if the time that took to generate those blocks are larger
     * or smaller than the expected time.
     *
     * @returns difficulty
     */
    public getDifficulty(): number {
        const latestBlock = this.blocks[this.blocks.length - 1];
        const signale = new Signale();

        // signale.log('check difficulty: ', latestBlock.index % DIFFICULTY_ADJUSTMENT_INTERVAL);
        if (((latestBlock.index % DIFFICULTY_ADJUSTMENT_INTERVAL) === 0) && (latestBlock.index !== 0)) {
            signale.note('   Need adjust the Difficulty');

            return this.getAdjustedDifficulty(latestBlock);
        } else {
            signale.info('   Difficulty: ', latestBlock.difficult);

            return latestBlock.difficult;
        }
    }

    /**
     * Determines whether valid timestamp is
     * - A block is valid, if the timestamp is at most 1 min in the future from the time we perceive.
     * - A block in the chain is valid, if the timestamp is at most 1 min in the past of the previous block.
     * @param block
     * @param prevBlock
     * @returns true if valid timestamp
     */
    public isValidTimestamp(block: Block, prevBlock: Block): boolean {
        // const signale = new Signale();
        /* tslint:disable */
        // signale.log('1. ', prevBlock.timestamp, (prevBlock.timestamp - MINUTES), (prevBlock.timestamp - MINUTES) < block.timestamp);
        // signale.log('2. ', block.timestamp, (block.timestamp - MINUTES), (block.timestamp - MINUTES) < getCurrentTimestamp());
        // signale.log('3. ', ((prevBlock.timestamp - MINUTES) < block.timestamp) && ((block.timestamp - MINUTES) < getCurrentTimestamp()))
        /* tslint:enable */
        return ((prevBlock.timestamp - MINUTES) < block.timestamp)
            && ((block.timestamp - MINUTES) < getCurrentTimestamp());
    }

    public processTransactions(trans: Transaction[],
        unspendTxOuts: UnspentTxOut[],
        blockIndex: number): UnspentTxOut[] {

        return this.updateUnspentTxOuts(trans, unspendTxOuts);
    }

    private async createGenesisBlock() {
        // explicit set a date
        const now = new Date();
        now.setDate(20);
        now.setMonth(5);
        now.setFullYear(2017);
        now.setHours(10);
        now.setMinutes(9);
        now.setSeconds(0);

        // No transaction area
        // let genesisBlock = new Block(0, (now.getTime() / 1000), null, 'NiceCoin Genesis Block', 14, 0);
        const genesisTransaction: Transaction = new Transaction();
        genesisTransaction.id = 'd9c152298c90efeb1628e7a79dc7405485a37c6de8b384ed0077c0ae105f924b';
        genesisTransaction.txIns = [{ signature: '', txId: '', txOutIndex: 0 }];
        genesisTransaction.txOuts = [{
            amount: 500,
            /* tslint:disable */
            publicKey: '04de259ad2577e88a5268260950ddbee638f141831ddb351e047c2e5d7823218d648171258e06ff315cb3dc4ed540bca619315c4794d5b727c918cd2739fcea645',
            /* tslint:enable */
        }];
        const genesisBlock = new Block(0, (now.getTime() / 1000), null, [genesisTransaction], 14, 0);

        const hash = genesisBlock.getHashAsString();
        // const signale = new Signale();
        // signale.log('Anything Human can understand!!!');
        // signale.log('Genesis hash: ', hash);

        this.blocks.push(genesisBlock);
        this.currentBlock = genesisBlock;

        this.unspentTxOuts = this.processTransactions(this.blocks[0].data, [], 0);
    }

    private async addBlockToChain(block: Block): Promise<boolean> {
        const valid = this.isValidNewBlock(block, this.getLatestBlock());

        if (valid) {
            this.blocks.push(block);

            return true;
        } else {
            return false;
        }
    }

    private isValidBlockStructure(block: Block): boolean {
        const hash = block.getHash();

        return typeof block.index === 'number'
            && typeof block.timestamp === 'number'
            && block.previousHash instanceof Buffer
            && hash instanceof Buffer
            && (typeof block.data === 'object' || typeof block.data === 'string');
    }

    private isValidNewBlock(block: Block, prevBlock: Block): boolean {
        const validBlockStructure = this.isValidBlockStructure(block);

        if (!validBlockStructure) {
            return false;
        }

        if ((prevBlock.index + 1) !== block.index) {
            return false;
        } else if (!this.isValidTimestamp(block, prevBlock)) {
            return false;
        }

        const prevBlockHash: Buffer = prevBlock.getHash();

        if (Buffer.compare(prevBlockHash, block.previousHash) !== 0) {
            return false;
        }

        return true;
    }

    private findUnspentTxOut(transactionId: string, index: number, unspendTxOuts: UnspentTxOut[]): UnspentTxOut {
        return unspendTxOuts.find((uTxO: UnspentTxOut) => uTxO.txOutId === transactionId && uTxO.txOutIndex === index);
    }

    private updateUnspentTxOuts(trans: Transaction[], unspendTxOuts: UnspentTxOut[]): UnspentTxOut[] {
        const newUnspendTxOuts: UnspentTxOut[] = trans
            .map((T: Transaction) =>
                T.txOuts.map((txOut, index) =>
                    new UnspentTxOut(T.id, index, txOut.publicKey, txOut.amount)))
            .reduce((a, b) => a.concat(b));

        const consumedTxOuts: UnspentTxOut[] = trans
            .map((T: Transaction) => T.txIns)
            .reduce((a, b) => a.concat(b))
            .map((txIn: TxIn) => new UnspentTxOut(txIn.txId, txIn.txOutIndex, '', 0));

        const resultingUnspendTxOuts = unspendTxOuts
            .filter((uTxO: UnspentTxOut) => !this.findUnspentTxOut(uTxO.txOutId, uTxO.txOutIndex, consumedTxOuts))
            .concat(newUnspendTxOuts);

        return resultingUnspendTxOuts;
    }
}
