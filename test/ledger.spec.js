const {assert, expect} = require('chai');

const Database = require("../dist/Database").Database;
const Ledger = require("../dist/Ledger").Ledger;

const FILENAME = "./test/sample_data.json";
var db = new Database(FILENAME);

describe("Ledger Testing", () => {

  before(() => {
    let loan = new Ledger.Builder("loan", Ledger.Type.REAL).save(db);
    let purchase = new Ledger.Builder("purchase", Ledger.Type.NOMINAL).save(db);
    let sale = new Ledger.Builder("sale", Ledger.Type.NOMINAL).save(db);
  });

  describe("Testing Ledger Builder", () => {

    it("Creating the cash Ledger using Ledger.Builder", ()=> {
      let cash = new Ledger.Builder("cash", Ledger.Type.REAL).save(db);

      assert.equal(cash.id, 4, "Correct ID");
      assert.equal(cash.name, "cash", "Correct Name");
      assert.equal(cash.type, Ledger.Type.REAL, "Correct Type");
    });
  
    it("Invoking Exception 'Invalid Type Exception'", () => {
      expect(() => {
        let x = new Ledger.Builder("bank", "wrong").save(db);
      }).to.throw("Invalid ledger type");
    });

    it("Invoking Exception 'Invalid Name Exception'", () => {
      expect(() => {
        let x = new Ledger.Builder("", Ledger.Type.REAL).save(db);
      }).to.throw("Invalid ledger name");
    });
  
    it("Invoking Exception 'Ledger Already Exists'", () => {
      expect(() => {
        let x = new Ledger.Builder("cash", Ledger.Type.REAL).save(db);
      }).to.throw("Ledger already exists");
    });

  });


  describe("Testing Ledger Helper", () => {

    it("Get ledger object using ledger id Ledger.Helper.findLedgerById()", ()=> {
      let x = Ledger.Helper.findLedgerById(1, db);
      assert.equal(x.id, 1, "Correct ID");
      assert.equal(x.name, "loan", "Correct Name");
      assert.equal(x.type, Ledger.Type.REAL, "Correct Type");
    });

    it("Get ledger object using ledger name Ledger.Helper.findLedgerByName()", ()=> {
      let x = Ledger.Helper.findLedgerByName("loan", db);
      assert.equal(x.id, 1, "Correct ID");
      assert.equal(x.name, "loan", "Correct Name");
      assert.equal(x.type, Ledger.Type.REAL, "Correct Type");
    });

    it("Get ledgers array using ledger type Ledger.Helper.findLedgersByType()", ()=> {
      let x = Ledger.Helper.findLedgersByType(Ledger.Type.REAL, db);
      assert.equal(x[0].id, 1, "Correct ID");
      assert.equal(x[0].name, "loan", "Correct Name");
      assert.equal(x[0].type, Ledger.Type.REAL, "Correct Type");
    });

    it("Get all ledgers array Ledger.Helper.getAllLedgers()", ()=> {
      let x = Ledger.Helper.getAllLedgers(db);

      assert.equal(x.length, 4, "Correct Array Size");
      assert.equal(x[0].id, 1, "Correct ID");
      assert.equal(x[0].name, "loan", "Correct Name");
      assert.equal(x[0].type, Ledger.Type.REAL, "Correct Type");
    });

    it("Null return invalid id Ledger.Helper.findLedgerById()", ()=> {
      let x = Ledger.Helper.findLedgerById(100, db);
      assert.equal(x, null, "Ledger By Id Is Null");
    });
    it("Null return invalid name Ledger.Helper.findLedgerByName()", ()=> {
      let x = Ledger.Helper.findLedgerByName("wrong", db);
      assert.equal(x, null, "Ledger By Type Is Null");
    });

    it("Invoking Exception 'Invalid Ledger Type' Ledger.Helper.findLedgersByType()", () => {
      expect(() => {
        Ledger.Helper.findLedgersByType("wrong", db)
      }).to.throw("Invalid ledger type");
    });

  });

  after(() => db.reset());

});