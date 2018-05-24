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

/*
// testing sqlite3
import * as sqlite3 from 'sqlite3';
import { Signale } from 'signale';

const signale = new Signale();
var db = new sqlite3.Database('./data/test.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    signale.debug('Connected to the in-memory SQLite database.')
});

// db.run("INSERT INTO memos VALUES('TEST', 5000)");

db.each("SELECT * FROM Category", (err, row) => {
  signale.debug(row.id, row.name);
});

db.close();
*/

import * as faker from 'faker';
import { Block, Chain } from './core';
import { Wallet } from './wallet';

Chain
    .getInstance()
    .then(instance => {
        const chain = instance;
        const genesisBlock: Block = chain.getCurrentBlock();

        const wallet = new Wallet('wallet');
        wallet.getPublicFromWallet();

        let i = 0;
        const handler = setInterval(() => {
            const data = faker.company.companyName();
            chain.mine(data);

            i++;
            if (i === 10) {
                clearInterval(handler);
            }
        }, 5000); // time to mine block not right
    });
