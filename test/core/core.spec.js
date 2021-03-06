const {assert, expect} = require('chai');

const Database = require("../../dist/database/Database").Database;
const Ledger = require("../../dist/core/Ledger").Ledger;
const Entry = require("../../dist/core/Entry").Entry;
const Core = require("../../dist/core/Core").Core;

const FILENAME = "./test/sample_data.json";
var db = new Database(FILENAME);

describe("Core Testing", () => {

  before(() => {
    let cash = new Ledger.Builder("cash", Ledger.Type.REAL).save(db);
    let loan = new Ledger.Builder("loan", Ledger.Type.REAL).save(db);
    let purchase = new Ledger.Builder("purchase", Ledger.Type.NOMINAL).save(db);
    let sale = new Ledger.Builder("sale", Ledger.Type.NOMINAL).save(db);
    let bank = new Ledger.Builder("bank", Ledger.Type.REAL).save(db);

    let x = new Entry.Builder(
      Ledger.Helper.findLedgerByName("cash", db), 
      Ledger.Helper.findLedgerByName("sale", db), 100, "being good sold for cash").save(db);
    let y = new Entry.Builder(
      Ledger.Helper.findLedgerByName("purchase", db), 
      Ledger.Helper.findLedgerByName("loan", db), 100, "being good purchased for credit").save(db);
    let z = new Entry.Builder(
      Ledger.Helper.findLedgerByName("purchase", db), 
      Ledger.Helper.findLedgerByName("cash", db), 100, "being good purchased for cash").save(db);
  });

  describe("Get Entries By Ledger Core.getEntriesByLedger()", () => {
    it("Get entries normally", ()=> {
      let x = Core.getEntriesByLedger(Ledger.Helper.findLedgerById(3, db), db);
  
      assert.equal(x[0].id, 2, "Correct Id");
      assert.equal(x[0].debit.name, "purchase", "Correct Debit");
      assert.equal(x[0].credit.name, "loan", "Correct Credit");
      assert.equal(x[0].amount, 100, "Correct Amount");
      assert.equal(x[0].narration, "being good purchased for credit", "Correct Narration");
  
    });

    it("Check ledger with no entry", ()=> {
      let x = Core.getEntriesByLedger(Ledger.Helper.findLedgerByName("bank", db), db);
      assert.equal(x.length, 0, "Correct Array Size");
    });
  });

  describe("Entry Period Filter Core.entryPeriodFilter", () => {

    it("Period works normally", () => {
      let x = Core.entryPeriodFilter(Core.getEntriesByLedger(
        Ledger.Helper.findLedgerByName("purchase", db), db), 0, new Date().getTime());
      
      assert.equal(x.length, 2, "Correct Array Size")

      assert.equal(x[0].id, 2, "Correct Id");
      assert.equal(x[0].debit.name, "purchase", "Correct Debit");
      assert.equal(x[0].credit.name, "loan", "Correct Credit");
      assert.equal(x[0].amount, 100, "Correct Amount");
      assert.equal(x[0].narration, "being good purchased for credit", "Correct Narration");
    });

    it("Invoke Exception 'Invalid Time Parameter' same from and to time", () => {
      expect(() => {
        Core.entryPeriodFilter(
          Core.getEntriesByLedger(Ledger.Helper.findLedgerById(3, db), db)
          , 0, 0);
      }).to.throw("'toDate' should be bigger than 'fromDate'");
    });

    it("Invoke Exception 'Invalid Time Parameter' from time is less than to time", () => {
      expect(() => {
        Core.entryPeriodFilter(
          Core.getEntriesByLedger(Ledger.Helper.findLedgerById(3, db), db)
          , 100, 0);
      }).to.throw("'toDate' should be bigger than 'fromDate'");
    });

  });

  describe("Get Ledger balance Core.getLedgerBalance()", () => {
    it("Get balance normally", ()=> {
      let x = Core.getLedgerBalance(
        Ledger.Helper.findLedgerByName("purchase", db), new Date().getTime(), db);
      assert.equal(x, 200, "Correct Balance");

      let y = Core.getLedgerBalance(
        Ledger.Helper.findLedgerByName("loan", db), new Date().getTime(), db);
      assert.equal(y, -100, "Correct Balance");
    });
  });
  
  after(() => {
    db.reset();
    db.save();
  });

});