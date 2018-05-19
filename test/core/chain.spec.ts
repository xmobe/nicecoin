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

                // expect(genesisBlock.index).to.equal(0);

                let blockData = faker.company.companyName();

                let block: Block = chain.mine(blockData);
                expect(block.index).to.equal(1);

                // chain.mine(blockData)
                //     .then((block: Block) => {
                //         console.log(block);

                //         expect(block.index).to.equal(1);
                //     });
            });
    });
});