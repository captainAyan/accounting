const {assert, expect} = require('chai');

const Database = require("../../dist/database/Database").Database;
const FILENAME = "./test/sample_data.json";

var db = new Database(FILENAME);

describe("Database Testing", () => {

  before(() => {});

  it("Creating Database instance", () => {
    let _db = new Database(FILENAME);

    assert.equal(_db.data.entries.length, 0);
    assert.equal(_db.data.ledgers.length, 0);
  });

  after(() => {
    db.reset();
    db.save();
  });
});