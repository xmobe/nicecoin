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

import { expect } from 'chai';
import { Chain } from '../../src/core';
import { Wallet } from '../../src/wallet';
import * as faker from 'faker';

describe('BlockChain', () => {
    let wallet: Wallet;
    let public_key: string;
    let private_key: string;

    beforeEach(() => {
        wallet = new Wallet();

        public_key = wallet.getPublicFromWallet();
        private_key = wallet.getPrivateFromWallet();

        console.log('Public Key is: ', public_key);
        console.log('Private Key is: ', private_key);
    });

    it("Should create Wallet with a Private Key", () => {
        let w = new Wallet();
        expect(w.getPrivateFromWallet()).to.equal(private_key);
    });

    it("Should return Wallet amount", () => {
        Chain
            .getInstance()
            .then(instance => {
                let chain = instance;
                let genesisBlock = chain.getCurrentBlock();

                let w = new Wallet();
                let amount: number = w.getBalance(public_key, chain.getUnspentTxOuts());
                if (public_key == '04210b494b3ae21490abef3e88128e1fd04a1c9ff4aefe177e6f2a33369e6191eddd011004539589ba867bb7353e3d751b6110501d73ac20fd462149dfae914848') {
                    expect(amount).to.equal(500);
                } else {
                    expect(amount).to.equal(0);
                }
            });
    });
});