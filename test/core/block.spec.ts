import { expect } from 'chai';

import { Block } from '../../src/core/block';


describe('Block', () => {
    it("Should create New Block with data 'Hello New Block'", () => {
        const now = new Date();
        let block = new Block(0, now.getTime(), null, 'Test Block', null);
        
        expect(block.data).to.equal('Test Block');
    });
});