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

    it("Should return Wallet amount 500", () => {
        Chain
            .getInstance()
            .then(instance => {
                let chain = instance;
                let genesisBlock = chain.getCurrentBlock();

                let w = new Wallet();
                let amount: number = w.getBalance(public_key, chain.getUnspentTxOuts());
                if (public_key == '04995fe4c631d2de37e55c825c1f6cdcffd91106e103604552294b79b3418b72a49bb341602c8fc5699b76f6b68e75feca9188c55a2045776c490f188ea0dcfcb1') {
                    expect(amount).to.equal(500);
                } else {
                    expect(amount).to.equal(0);
                }
            });
    });
});