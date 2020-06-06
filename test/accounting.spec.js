const {assert, expect} = require('chai');

const Database = require("../dist/Database").Database;
const Ledger = require("../dist/Ledger").Ledger;
const Entry = require("../dist/Entry").Entry;
const Accounting = require("../dist/Accounting").Accounting;

const FILENAME = "./test/sample_data.json";
var db = new Database(FILENAME);

describe("Accounting Testing", () => {

  before(() => {
    let cash = new Ledger.Builder("cash", Ledger.Type.ASSET).save(db);
    let loan = new Ledger.Builder("loan", Ledger.Type.LIABILITY).save(db);
    let purchase = new Ledger.Builder("purchase", Ledger.Type.EXPENDITURE).save(db);
    let sale = new Ledger.Builder("sale", Ledger.Type.INCOME).save(db);
    let bank = new Ledger.Builder("bank", Ledger.Type.ASSET).save(db);

    let x = new Entry.Builder("cash", "sale", 100, "being good sold for cash").save(db);
    let y = new Entry.Builder("purchase", "loan", 100, "being good purchased for credit").save(db);
    let z = new Entry.Builder("purchase", "cash", 100, "being good purchased for cash").save(db);
  });

  describe("Get Entries By Ledger Accounting.getEntriesByLedger()", () => {
    it("Get entries normally", ()=> {
      let x = Accounting.getEntriesByLedger(Ledger.Helper.findLedgerById(3, db), db);
  
      assert.equal(x[0].id, 2, "Correct Id");
      assert.equal(x[0].debit.name, "purchase", "Correct Debit");
      assert.equal(x[0].credit.name, "loan", "Correct Credit");
      assert.equal(x[0].amount, 100, "Correct Amount");
      assert.equal(x[0].narration, "being good purchased for credit", "Correct Narration");
  
    });

    it("Check ledger with no entry", ()=> {
      let x = Accounting.getEntriesByLedger(Ledger.Helper.findLedgerByName("bank", db), db);
      assert.equal(x.length, 0, "Correct Array Size");
    });
  });

  describe("Entry Period Filter Accounting.entryPeriodFilter", () => {

    it("Period works normally", () => {
      let x = Accounting.entryPeriodFilter(Accounting.getEntriesByLedger(Ledger.Helper.findLedgerByName("purchase", db), db), 0, new Date().getTime());
      
      assert.equal(x.length, 2, "Correct Array Size")

      assert.equal(x[0].id, 2, "Correct Id");
      assert.equal(x[0].debit.name, "purchase", "Correct Debit");
      assert.equal(x[0].credit.name, "loan", "Correct Credit");
      assert.equal(x[0].amount, 100, "Correct Amount");
      assert.equal(x[0].narration, "being good purchased for credit", "Correct Narration");
    });

    it("Invoke Exception 'Invalid Time Parameter' same from and to time", () => {
      expect(() => {
        Accounting.entryPeriodFilter(
          Accounting.getEntriesByLedger(Ledger.Helper.findLedgerById(3, db), db)
          , 0, 0);
      }).to.throw("'toDate' should be bigger than 'fromDate'");
    });

    it("Invoke Exception 'Invalid Time Parameter' from time is less than to time", () => {
      expect(() => {
        Accounting.entryPeriodFilter(
          Accounting.getEntriesByLedger(Ledger.Helper.findLedgerById(3, db), db)
          , 100, 0);
      }).to.throw("'toDate' should be bigger than 'fromDate'");
    });

  });
  
  after(() => db.reset());

});