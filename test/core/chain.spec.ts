import { expect } from 'chai';

import { Block, Chain } from '../../src/core';
import * as faker from 'faker';

describe('BlockChain', () => {
    it("Should create BlockChain with a Genesis Block", () => {
        Chain
            .getInstance()
            .then(instance => {
                let chain = instance;
                let genesisBlock = chain.getCurrentBlock();

                setInterval(() => {
                    chain.mine(faker.company.companyName());
                }, 5000);
                expect(genesisBlock.data).to.equal('NiceCoin Genesis Block');
            })
    });
});