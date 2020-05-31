import {Database} from "./database";

export namespace Accounting {

  /** @class Accounting.Helper class */
  export class Helper {

    /**
     * find entries of a ledger
     * 
     * @param {Ledger}   ledger Ledger object of the ledger 
     * @param {Database} db     the database instance
     * @returns Entry object array
     */
    static getEntriesByLedger(ledger:Ledger, db:Database):Accounting.Entry[] {
      let data:any = db.query("entries[*debit="+ledger.id+"|credit="+ledger.id+"]");
      let entries:Accounting.Entry[] = [];

      if(data != []) {
        data.map((d:any) => {
          let entry:Entry|null = Accounting.Entry.Helper.findEntryById(d.id, db);
          if(entry!=null) entries.push(entry);
        });
      }
      return entries;
    }

    /**
     * filters entry arrays by 'start date'(from_date) and 'end date'(to_data)
     * 
     * @param {Entry[]} entries   array of entries
     * @param {number}  from_date from date
     * @param {number}  to_date   to date
     * @returns Entry object array
     * @throws error if date parameters are invalid
     */
    static entryTimeFilter(entries:Accounting.Entry[], from_date:number, to_date:number):Accounting.Entry[] {
      if(from_date>=to_date) throw "invalid date arguments, 'to_date' should be bigger than 'from_date'";
      else {
        let res:Accounting.Entry[] = entries.filter(d => {
          return (d.time >= from_date && d.time <= to_date);
        });
        return res;
      }
    }

    static getLedgerBalance(ledger:Ledger) {}

  }

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

      public debit: string;
      public credit: string;
      public amount: number;
      public narration: string;

      /**
       * @constructor Journal entry builder constructor
       *
       * @param {string} dr        name of debit account
       * @param {string} cr        name of credit account
       * @param {number} amount    amount of entry
       * @param {string} narration entry remarks or narration
       */
      public constructor(dr:string, cr:string, amount:number, narration:string) {
        this.debit = dr;
        this.credit = cr;
        this.amount = amount;
        this.narration = narration;
      }

      /**
       * save entry
       *
       * @param {Database} db the database instance
       * @returns Entry object
       * @throws throws error if ledgers (or accounts) are not found
       */
      public save(db: Database):Entry {

        let time:number = new Date().getTime();

        let debit:Ledger|null = Ledger.Helper.findLedgerByName(this.debit, db);
        let credit:Ledger|null = Ledger.Helper.findLedgerByName(this.credit, db);

        if(debit!= null && credit != null ) {
          let id:number = db.data.entries.length+1;

          let object = {
            id: id,
            debit: debit.id,
            credit: credit.id,
            amount: this.amount,
            time: time,
            narration: this.narration
          };

          db.data.entries.push(object);
          db.save();

          return new Entry(id, debit, credit, this.amount, time, this.narration);
        }
        else throw "ledger does not exist";
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
        if (data != null) return Entry.Helper.getEntryObjectFromDatabaseRow(data, db);
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
        if(data != []) {
          data.map((d:any) => {
            let entry:Entry|null = Entry.Helper.getEntryObjectFromDatabaseRow(d, db);
            if (entry != null) entries.push(entry);
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
        
        if (debit != null && credit != null) {
          return new Entry(data.id, debit, credit, data.amount, data.time, data.narration);
        }
        else return null;
      }
    };

  }


  /** @class Ledger representing a accounting ledger */
  export class Ledger {

    private _id: number;
    private _name: string;
    private _type: string;
    private _time: number;

    /**
     * @constructor Ledger object constructor
     *
     * @param {number} id   ledger id
     * @param {string} name ledger name
     * @param {string} type ledger type (use Ledger.Type.{type} )
     * @param {number} time ledger creation timestamp
     */
    constructor(id:number, name:string, type:string, time:number) {
      this._id = id;
      this._name = name;
      this._type = type;
      this._time = time;
    }

    get id():number { return this._id; }
    get name():string { return this._name; }
    get type():string { return this._type; }
    get time():number { return this._time; }


    /** @class Use these types where account type is required */
    public static Type = class {
      static readonly INCOME:string = "i";
      static readonly EXPENDITURE:string = "e";
      static readonly ASSET:string = "a";
      static readonly LIABILITY:string = "l";
    }


    /** @class Ledger Builder is used for building new ledgers */
    public static Builder = class {

      public name:string;
      public type:string;

      /**
       * @constructor Ledger builder constructor
       *
       * @param {string} name account name
       * @param {string} type type of account (use Ledger.Type.{type})
       */
      public constructor(name: string, type: string) {
        this.name = name;
        this.type = type;
      }

      /**
       * saves ledger
       *
       * @param {Database} db the database instance
       * @returns ledger object
       * @throws throws error if account of same exists in the database
       */
      public save(db: Database):Ledger {

        let time:number = new Date().getTime();

        if(Ledger.Helper.findLedgerByName(this.name, db) == null) {
          let id = db.data.ledgers.length+1;
          db.data.ledgers.push({
            id: id,
            name: this.name,
            type: this.type,
            time: time
          });
          db.save();
          return new Ledger(id, this.name, this.type, time);
        }
        else throw "account already exists";
      }
    }


    /** @class Ledger Helper helps with different utility methods */
    public static Helper = class {

      /**
       * get ledger object using ledger id
       *
       * @param {number}   id id of the ledger
       * @param {Database} db the database instance
       * @returns Ledger object or null if there were no matches
       */
      public static findLedgerById(id: number, db: Database):Ledger|null {
        let data:any = db.query("ledgers[id="+id+"]");
        if (data != null) return Ledger.Helper.getLedgerObjectFromDatabaseRow(data);
        else return null;
      }

      /**
       * get ledger object by name
       *
       * @param {string}   name name of the ledger
       * @param {Database} db   the database instance
       * @returns Ledger object or null if there were no matches
       */
      public static findLedgerByName(name: string, db: Database):Ledger|null {
        let data:any = db.query("ledgers[name="+name+"]");
        if (data != null) return Ledger.Helper.getLedgerObjectFromDatabaseRow(data);
        else return null;
      }

      /**
       * get ledger objects array by type
       *
       * @param {string}   type use ledger type
       * @param {Database} db   the database instance
       * @returns Ledger array or null if there were no matches
       */
      public static findLedgersByType(type: string, db: Database):Ledger[] {
        let data:any= db.query("ledgers[*type="+type+"]");
        let ledgers:Ledger[] = [];
        if(data != []) {
          data.map((d:any) => { ledgers.push(Ledger.Helper.getLedgerObjectFromDatabaseRow(d)); });
        }
        return ledgers;
      }

      /**
       * get all ledgers in array
       *
       * @param {Database} db the database instance
       * @returns Ledger array or null if there were no matches
       */
      public static getAllLedgers(db: Database):Ledger[] {
        let data:any= db.query("ledgers");
        let ledgers:Ledger[] = [];
        if(data != []) {
          data.map((d:any) => { ledgers.push(Ledger.Helper.getLedgerObjectFromDatabaseRow(d)); })
        }
        return ledgers;
      }

      /**
       * Get ledger object from database row (tuple or record)
       *
       * @param {JSON}     data database row (tuple or record)
       * @param {Database} db   the database instance
       * @return ledger object
       */
      public static getLedgerObjectFromDatabaseRow(data:any):Ledger {
        return new Ledger(data.id, data.name, data.type, data.time);
      }

    }

  }

}
