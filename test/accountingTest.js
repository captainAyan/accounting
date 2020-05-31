const assert = require('chai').assert;

const Database = require("../dist/database").Database;
const Accounting = require("../dist/accounting").Accounting;

const FILENAME = "./test/test_acc.json";
var db = new Database(FILENAME);


/* describe("Accounting.Ledger.Builder class", () => {
  it("Builder should return a ledger object", ()=> {
    let result = new Accounting.Ledger.Builder("cash", Accounting.Ledger.Type.ASSET).save(db);
    assert.instanceOf(result, Accounting.Ledger)
  })
}) */