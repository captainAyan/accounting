import * as fs from "fs";

/**
 * @class File class
 * 
 * File is a small API for getting file data in a JSON
 * object and saving changes. Using this class will prevent 
 * invalid formats from getting saved or loaded.
 */

export class File {
  /**
   * get file in a JSON object (prevents invalid 
   * file formats)
   * 
   * @param fileName file path
   * @returns json data
   * @throws throws invalid format error
   */
  static get(fileName:string):any {

    let d = JSON.parse(fs.readFileSync(fileName).toString())
    
    if(!d.hasOwnProperty('entries') 
    && !d.hasOwnProperty('ledgers')) 
    {throw new Error("Invalid file format")}
    else return d;
  }

  /**
   * stringifies and saves the json data to the 
   * file (given in the file parameter) (prevents
   * invalid file formats)
   * 
   * @param fileName file path
   * @param data json data
   * @throws throws invalid format error
   */
  static save(fileName:string, data:any) {
    if(!data.hasOwnProperty('entries') 
    && !data.hasOwnProperty('ledgers')) 
    {throw new Error("Invalid file format")}
    else fs.writeFileSync(fileName, JSON.stringify(data));
  }

}