import * as jsonQuery from "json-query";
import * as fs from "fs";

export class Database {

  private fileName:string;
  public data:any;

  public constructor(fileName:string) {
    this.fileName = fileName;
    const d = JSON.parse(fs.readFileSync(this.fileName).toString());
    this.data = d;
  }

  public query(queryText:string):any {
    return jsonQuery(queryText, {
      data: this.data
    }).value;
  }

  public save():void {
    fs.writeFileSync(this.fileName, JSON.stringify(this.data));
  }

  public reset():void {
    fs.writeFileSync(this.fileName, JSON.stringify({
      "entries": [],
      "ledgers": []
    }))
  }
}
