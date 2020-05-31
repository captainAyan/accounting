const Database = require("./util/database").Database;
const Accounting = require("./util/accounting").Accounting;

// const chalk = require('chalk');
// const columnify = require('columnify');

const FILENAME = "./acc.json";

var db = new Database(FILENAME);

try {
  var d1 = Accounting.Ledger.Helper.findLedgersByType(Accounting.Ledger.Type.LIABILITY, db);
  var d2 = Accounting.Helper.getEntriesByLedger(Accounting.Ledger.Helper.findLedgerByName("cash", db), db);
  var d3 = Accounting.Helper.entryTimeFilter(d2, new Date().getTime(), new Date().getTime()+2000);
  var d4 = Accounting.Entry.Helper.getAllEntries(db);

  console.log(d4)
}
catch(e) {console.log(e);}
