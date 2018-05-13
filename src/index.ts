import * as sqlite3 from 'sqlite3';

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
