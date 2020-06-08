import {Ledger} from "./Ledger";
import {Database} from "./Database";

/** @class Journal Entry model */
export class Entry {

  private _id: number;
  private _debit: Ledger;
  private _credit: Ledger;
  private _amount: number;
  private _time: number;
  private _narration: string;

  /**
   * @constructor
   *
   * @param {number} id        entry id or entry number
   * @param {Ledger} dr        debit ledger
   * @param {Ledger} cr        credit ledger
   * @param {number} amount    amount of entry
   * @param {number} time      timestamp of entry
   * @param {string} narration entry remarks or narration
   */
  public constructor(id:number, dr:Ledger, cr:Ledger, amount:number, time:number, narration:string) {
    this._id = id;
    this._debit = dr;
    this._credit = cr;
    this._amount = amount;
    this._time = time;
    this._narration = narration;
  }

  get id():number { return this._id; }
  get debit():Ledger { return this._debit; }
  get credit():Ledger { return this._credit; }
  get amount():number { return this._amount; }
  get time():number { return this._time; }
  get narration():string { return this._narration; }


  /** @class Entry Builder is used for building new journal entry */
  public static Builder = class {

    public debit: Ledger;
    public credit: Ledger;
    public amount: number;
    public narration: string;

    /**
     * @constructor Journal entry builder constructor
     *
     * @param {Ledger} dr        debit ledger object
     * @param {Ledger} cr        credit ledger object
     * @param {number} amount    amount of entry
     * @param {string} narration entry remarks or narration
     * @throws throws error if ledger null or narration is empty or 
     * amount is invalid 
     */
    public constructor(dr:Ledger, cr:Ledger, amount:number, narration:string) {
      if(dr && cr) {
        this.debit = dr; 
        this.credit = cr; 
      } else throw new Error("Ledger cannot be null");

      if(amount>0) this.amount = amount;
      else throw new Error("Invalid amount");

      if(narration.length>0) this.narration = narration;
      else throw new Error("Invalid narration");
    }

    /**
     * save entry
     *
     * @param {Database} db the database instance
     * @returns Entry object
     * @throws throws error if ledgers are not found
     */
    public save(db: Database):Entry {
      let time:number = new Date().getTime();
      let id:number = db.data.entries.length+1;

      let object = {
        id: id,
        debit: this.debit.id,
        credit: this.credit.id,
        amount: this.amount,
        time: time,
        narration: this.narration
      };

      db.data.entries.push(object);
      db.save();

      return new Entry(id, this.debit, this.credit, this.amount, time, this.narration);
    }
  };


  /** @class Entry Helper helps with different utility methods */
  public static Helper = class {

    /**
     * get entry object using entry id
     *
     * @param {number}   id id of the entry
     * @param {Database} db the database instance
     * @returns Entry object or null if there were no matches
     */
    public static findEntryById(id: number, db: Database):Entry|null {
      let data:any = db.query("entries[id="+id+"]");
      if (data !== null) return Entry.Helper.getEntryObjectFromDatabaseRow(data, db);
      else return null;
    }

    /**
     * get all entries in array
     *
     * @param {Database} db the database instance
     * @returns Ledger array or null if there were no matches
     */
    public static getAllEntries(db: Database):Entry[] {
      let data:any = db.query("entries");
      let entries:Entry[] = [];
      if(data !== []) {
        data.map((d:any) => {
          let entry:Entry|null = Entry.Helper.getEntryObjectFromDatabaseRow(d, db);
          if (entry !== null) entries.push(entry);
        });
      }
      return entries;
    }

    /**
     * Get journal entry object from database row (tuple or record)
     *
     * @param {JSON}     data database row (tuple or record)
     * @param {Database} db   the database instance
     * @return journal Entry object
     */
    public static getEntryObjectFromDatabaseRow(data:any, db: Database):Entry|null {
      let debit:Ledger|null = Ledger.Helper.findLedgerById(data.debit, db);
      let credit:Ledger|null = Ledger.Helper.findLedgerById(data.credit, db);
      
      if (debit !== null && credit !== null) {
        return new Entry(data.id, debit, credit, data.amount, data.time, data.narration);
      }
      else return null;
    }
  };

}