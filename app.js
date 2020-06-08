const Database = require("./dist/Database").Database;
const Accountant = require("./dist/Accountant").Accountant;
const Ledger = require("./dist/Ledger").Ledger;
const Entry = require("./dist/Entry").Entry;

const FILENAME = "./acc.json";

var db = new Database(FILENAME);

try {
  var d1 = Ledger.Helper.findLedgersByType(Ledger.Type.LIABILITY, db);
  var d2 = Accountant.getEntriesByLedger(Ledger.Helper.findLedgerByName("cash", db), db);
  var d3 = Accountant.entryPeriodFilter(d2, new Date().getTime(), new Date().getTime()+2000);
  var d4 = Entry.Helper.getAllEntries(db);
  var d5 = Accountant.getLedgerBalance(Ledger.Helper.findLedgerByName("furniture", db), new Date().getTime(), db);

  console.log(d5);
}
catch(e) {console.log(e);}