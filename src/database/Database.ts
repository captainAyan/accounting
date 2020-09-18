import * as jsonQuery from "json-query";
import {File} from "./File";


/**
 * @class Database class
 * 
 * Database class is the model and helper for json file based 
 * database.
 * 
 * Insert, Find, Sort, Delete, Update, and Limit cannot be done 
 * using this. Only saving (as JSON), retrieving and file 
 * reset is only allowed in this class.
 * 
 * Database uses the 'json-query' package in order to get data
 * from the json format database.
 * 
 */

export class Database {

  private fileName:string;

  /**
   * This public field shall be directly accessed by the other 
   * classes to Insert, Find, Sort, Delete, Update, and Limit 
   * data.
   */
  public data:any;

  public static reset:any = JSON.parse("{\"entries\": [], \"ledgers\": []}");

  /**
   * @constructor
   * 
   * @param fileName path to the database json file
   */
  public constructor(fileName:string) {
    this.fileName = fileName;
    this.data = File.get(this.fileName);
  }

  /**
   * use this method to fetch data from the server. Same as 'SELECT'
   * in SQL database or 'find' in a MondoDB database.
   * 
   * @param queryText query string
   * @returns returns the value parameter or the 'json-query' response
   */
  public query(queryText:string):any {
    return jsonQuery(queryText, {
      data: this.data
    }).value;
  }

  /**
   * any changes to the database stays on the memory. Use this method
   * to save those changes to the file.
   */
  public save():void {
    File.save(this.fileName, this.data);
  }

  /**
   * resets the Database. All data will be lost. Call save() after calling
   * this method
   */
  public reset():void {
    this.data = Database.reset;
  }
}
