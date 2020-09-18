import {Database} from "../database/Database";

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


  /** @class Use these types where ledger type is required */
  public static Type = class {
    static readonly PERSONAL:string = "p";
    static readonly NOMINAL:string = "n";
    static readonly REAL:string = "r";
  }


  /** @class Ledger Builder is used for building new ledgers */
  public static Builder = class {

    public name:string;
    public type:string;

    /**
     * @constructor Ledger builder constructor
     *
     * @param {string} name ledger name
     * @param {Ledger.Type} type type of ledger (use Ledger.Type.{type})
     * @throws throws error if ledger type is invalid 
     */
    public constructor(name: string, type: string) {
      if(name.length>0) this.name = name;
      else throw new Error("Invalid ledger name");

      if(
        type === Ledger.Type.PERSONAL
        || type === Ledger.Type.NOMINAL
        || type === Ledger.Type.REAL) this.type = type;
      else throw new Error("Invalid ledger type");
    }

    /**
     * saves ledger
     *
     * @param {Database} db the database instance
     * @returns ledger object
     * @throws throws error if ledger of the same name exists in the database
     */
    public save(db: Database):Ledger|null {

      let time:number = new Date().getTime();

      if(Ledger.Helper.findLedgerByName(this.name, db) === null) {
        let id = db.data.ledgers.length+1;
        db.data.ledgers.push({
          id: id,
          name: this.name,
          type: this.type,
          time: time
        });
        db.save();
        return Ledger.Helper.findLedgerById(id, db);
      }
      else throw new Error("Ledger already exists")
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
      if (data !== null) return Ledger.Helper.getLedgerObjectFromDatabaseRow(data);
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
      if (data !== null) return Ledger.Helper.getLedgerObjectFromDatabaseRow(data);
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
      if(!(type === Ledger.Type.PERSONAL 
        || type === Ledger.Type.NOMINAL 
        || type === Ledger.Type.REAL)) throw new Error("Invalid ledger type");
      
      let data:any= db.query("ledgers[*type="+type+"]");
      let ledgers:Ledger[] = [];
      if(data !== []) {
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
      if(data !== []) {
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