/**
 * Copyright 2018 xMobe https://www.xmobe.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the `Software`), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED `AS IS`, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

import { expect } from 'chai';
import { Signale } from 'signale';
import { Chain } from '../../src/core';
import { Wallet } from '../../src/wallet';

describe('Wallet', () => {
    let wallet: Wallet;
    let publicKey: string;
    let privateKey: string;
    let amount: number;

    beforeEach(() => {
        wallet = new Wallet('wallet1');

        publicKey = wallet.getPublicFromWallet();
        privateKey = wallet.getPrivateFromWallet();
        Chain
            .getInstance()
            .then((instance: Chain) => {
                const chain = instance;

                amount = wallet.getBalance(publicKey, chain.getUnspentTxOuts());
            });

        const signale = new Signale();
        signale.debug('Public Key is: ', publicKey);
        signale.debug('Private Key is: ', privateKey);
    });

    it(`Should create Wallet with a Private Key`, () => {
        const w = new Wallet('wallet1');
        expect(w.getPrivateFromWallet()).to.equal(privateKey);
    });

    it(`Should return Wallet amount is ${amount}`, () => {
        Chain
            .getInstance()
            .then((instance: Chain) => {
                const chain = instance;
                const genesisBlock = chain.getCurrentBlock();

                const w = new Wallet('wallet1');
                const wamount: number = w.getBalance(publicKey, chain.getUnspentTxOuts());
                expect(amount).to.equal(wamount);
            });
    });
});
