import { expect } from 'chai';

import { Block } from '../../src/core/block';


describe('Block', () => {
    it("Should create New Block with data 'Test Block'", () => {
        const now = new Date();
        let block = new Block(0, now.getTime(), null, 'Test Block', 5, 0);
        expect(block.data).to.equal('Test Block');
    });

    it("Should create valid Hash", () => {
        const now = new Date();
        let block = new Block(0, now.getTime(), null, 'Test Block', 5, 0);

        block.getHash()
            .then(data => {
                let hash = data;
                let str1 = Buffer.from(hash).toString('hex');

                block.getHashAsString()
                    .then(hashString => {
                        expect(hashString).to.equal(str1);
                    });
            });
    });
});