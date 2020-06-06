import {Database} from "./Database";
import {Ledger} from "./Ledger";
import {Entry} from "./Entry";

/** @class Accounting class */
export class Accounting {

  /**
   * find entries of a ledger
   * 
   * @param {Ledger}   ledger Ledger object of the ledger 
   * @param {Database} db     the database instance
   * @returns Entry object array
   */
  public static getEntriesByLedger(ledger:Ledger, db:Database):Entry[] {
    let data:any = db.query("entries[*debit="+ledger.id+"|credit="+ledger.id+"]");
    let entries:Entry[] = [];

    if(data !== []) {
      data.map((d:any) => {
        let entry:Entry|null = Entry.Helper.findEntryById(d.id, db);
        if(entry!==null) entries.push(entry);
      });
    }
    return entries;
  }

  /**
   * filters entry arrays by 'start date'(fromDate) and 'end date'(toData)
   * 
   * @param {Entry[]} entries   array of entries
   * @param {number}  fromDate from date
   * @param {number}  toDate   to date
   * @returns Entry object array
   * @throws error if date parameters are invalid
   */
  public static entryPeriodFilter(entries:Entry[], fromDate:number, toDate:number):Entry[] {
    if(fromDate>=toDate) throw new Error("'toDate' should be bigger than 'fromDate'")
    else {
      let res:Entry[] = entries.filter(d => {
        return (d.time >= fromDate && d.time <= toDate);
      });
      return res;
    }
  }

}