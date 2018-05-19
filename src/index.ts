/*import * as sqlite3 from 'sqlite3';

var db = new sqlite3.Database('./data/test.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQLite database.')
});

// db.run("INSERT INTO memos VALUES('TEST', 5000)");

db.each("SELECT * FROM Category", (err, row) => {
  console.log(row.id, row.name);
});

db.close();
*/

import * as faker from 'faker';
import { Block, Chain } from './core';

Chain
    .getInstance()
    .then(instance => {
        let chain = instance;
        let genesisBlock: Block = chain.getCurrentBlock();

        // chain.mine(faker.company.companyName());
        let i = 0;

        let handler = setInterval(() => {
            let data = faker.company.companyName();
            // console.log('Block Data: ', data);
            chain.mine(data)
        
            i++;
            if (i == 50) {
                clearInterval(handler);
            }
        }, 5000); // time to mine block not right
    });