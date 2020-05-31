import * as jsonQuery from "json-query";
import * as fs from "fs";

export class Database {

  private file_name:string;
  public data:any;

  public constructor(file_name:string) {
    this.file_name = file_name;
    var d = JSON.parse(fs.readFileSync(this.file_name).toString());
    this.data = d;
  }

  public query(query_text:string):any {
    return jsonQuery(query_text, {
      data: this.data
    }).value;
  }

  public save():void {
    fs.writeFileSync(this.file_name, JSON.stringify(this.data, null, 2));
  }
}
