import {Database} from "../database/Database";
import {Ledger} from "./Ledger";
import {Entry} from "./Entry";

/**
 * @class Core class
 * 
 * This is used for features that are not solely dependent
 * on journal or ledger (i.e. most of the features)
 */

export class Core {

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
   * filters entry arrays by 'start date'(fromDate) and 'end date'(toData).
   * use the result of Core.getEntriesByLedger method.
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

  /**
   * get balance of a ledger on a particular date. returns 
   * positive balance if debit side is high, and negative 
   * balance if credit side is high.
   * 
   * @param {Ledger}   ledger ledger object of the ledger
   * @param {number}   date   the particular date of the balance
   * @param {Database} db     the database instance
   * @returns ledger balance (if Dr > Cr then positive) (if Dr < Cr then negative)
   */
  public static getLedgerBalance(ledger:Ledger, date:number, db:Database):number {
    const data:Entry[] = Core.entryPeriodFilter(Core.getEntriesByLedger(ledger, db), 0, date);
    let balance:number = 0;

    data.map(x => {
      if(x.debit.id == ledger.id) balance += x.amount;
      else balance -= x.amount;
    });

    return balance;
  }

}