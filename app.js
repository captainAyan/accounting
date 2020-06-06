const Database = require("./dist/Database").Database;
const Accounting = require("./dist/Accounting").Accounting;
const Ledger = require("./dist/Ledger").Ledger;
const Entry = require("./dist/Entry").Entry;

const FILENAME = "./acc.json";

var db = new Database(FILENAME);

try {
  var d1 = Ledger.Helper.findLedgersByType(Ledger.Type.LIABILITY, db);
  var d2 = Accounting.getEntriesByLedger(Ledger.Helper.findLedgerByName("cash", db), db);
  var d3 = Accounting.entryTimeFilter(d2, new Date().getTime(), new Date().getTime()+2000);
  var d4 = Entry.Helper.getAllEntries(db);

  console.log(d4);
}
catch(e) {console.log(e);}