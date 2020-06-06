const {assert, expect} = require('chai');

const Database = require("../dist/Database").Database;
const Ledger = require("../dist/Ledger").Ledger;
const Entry = require("../dist/Entry").Entry;

const FILENAME = "./test/sample_data.json";
var db = new Database(FILENAME);

describe("Entry Testing", () => {

  before(() => {
    let cash = new Ledger.Builder("cash", Ledger.Type.ASSET).save(db);
    let loan = new Ledger.Builder("loan", Ledger.Type.LIABILITY).save(db);
    let purchase = new Ledger.Builder("purchase", Ledger.Type.EXPENDITURE).save(db);
    let sale = new Ledger.Builder("sale", Ledger.Type.INCOME).save(db);

    let x = new Entry.Builder("cash", "sale", 100, "being good sold for cash").save(db);
    let y = new Entry.Builder("purchase", "loan", 100, "being good purchased for credit").save(db);
  });

  describe("Testing Entry Builder", () => {

    it("Creating the cash Ledger using Entry.Builder", ()=> {

      let x = new Entry.Builder("purchase", "cash", 100, "being good purchased for cash").save(db);

      assert.equal(x.id, 3, "Correct ID");
      assert.equal(x.debit.name, "purchase", "Correct Debit");
      assert.equal(x.credit.name, "cash", "Correct Credit");
      assert.equal(x.amount, 100, "Correct Amount");
      assert.equal(x.narration, "being good purchased for cash", "Correct Narration");

    });

    it("Invoking Exception 'Ledger does not exist'", () => {
      expect(() => {
        let x = new Entry.Builder("purchase", "wrong", 100, "being good purchased for cash").save(db);
      }).to.throw("Ledger does not exist");
    });

  });


  describe("Testing Entry Helper", () => {

    it("Get entry object using entry id Entry.Helper.findEntryById()", ()=> {
      let x = Entry.Helper.findEntryById(1, db);
      assert.equal(x.id, 1, "Correct Id");
      assert.equal(x.debit.name, "cash", "Correct Debit");
      assert.equal(x.credit.name, "sale", "Correct Credit");
      assert.equal(x.amount, 100, "Correct Amount");
      assert.equal(x.narration, "being good sold for cash", "Correct Narration");
    });

    it("Null return get entry object using entry id Entry.Helper.findEntryById()", ()=> {
      let x = Entry.Helper.findEntryById(100, db);
      assert.equal(x, null, "Entry By Id Is Null");
    });

    it("Get all entries array Entry.Helper.getAllEntries()", ()=> {
      let x = Entry.Helper.getAllEntries(db);

      assert.equal(x.length, 3, "Correct Array Size");

      assert.equal(x[0].id, 1, "Correct Id");
      assert.equal(x[0].debit.name, "cash", "Correct Debit");
      assert.equal(x[0].credit.name, "sale", "Correct Credit");
      assert.equal(x[0].amount, 100, "Correct Amount");
      assert.equal(x[0].narration, "being good sold for cash", "Correct Narration");
    });

  });

  after(() => db.reset());

});