const Database = require("./dist/Database").Database;
const Core = require("./dist/core/Core").Core;
const Ledger = require("./dist/core/Ledger").Ledger;
const Entry = require("./dist/core/Entry").Entry;

const FILENAME = "./example_db.json";

var db = new Database(FILENAME);

try {
  var d1 = Ledger.Helper.findLedgersByType(Ledger.Type.REAL, db);
  var d2 = Core.getEntriesByLedger(Ledger.Helper.findLedgerByName("cash", db), db);
  var d3 = Core.entryPeriodFilter(d2, new Date().getTime(), new Date().getTime()+2000);
  var d4 = Entry.Helper.getAllEntries(db);
  var d5 = Core.getLedgerBalance(Ledger.Helper.findLedgerByName("furniture", db), new Date().getTime(), db);

  console.log(d5);
}
catch(e) {console.log(e);}