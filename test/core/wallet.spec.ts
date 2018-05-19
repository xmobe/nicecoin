import { expect } from 'chai';
import { Chain } from '../../src/core';
import { Wallet } from '../../src/wallet';
import * as faker from 'faker';

describe('BlockChain', () => {
    it("Should create Wallet with a Private Key", () => {
        let wallet = new Wallet();
        console.log('Public Key is: ', wallet.getPublicFromWallet());
        console.log('Private Key is: ', wallet.getPrivateFromWallet());
        expect(wallet.getPrivateFromWallet()).to.equal('acc11a9884170eba4e973037a1ebe7345731a76dc5e62447bbdc793f7442439e');
    });

    it("Should return Wallet amount 500", () => {
        Chain
            .getInstance()
            .then(instance => {
                let chain = instance;
                let genesisBlock = chain.getCurrentBlock();

                let wallet = new Wallet();
                let amount: number = wallet.getBalance('044b9214fa338400bd599b2cb53acb78e4dae85e44163240cae0d11b371af7feabe90df572eb8df71a29e0a840c104d3a40782547c6b7c307348683bb5cd6029ad', chain.getUnspentTxOuts());
                expect(amount).to.equal(500);
            });
    });
});