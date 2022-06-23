import { MatDialog } from '@angular/material/dialog';
import { SentimentService } from './../services/sentiment/sentiment.service';
import { Component, OnInit, ViewChild } from '@angular/core';
export class CsvData {
  public id: any;
  public min: any;
  public max: any;
  public sentiment: any;
  
}
@Component({
  selector: 'app-csv',
  templateUrl: './csv.component.html',
  styleUrls: ['./csv.component.css']
})
export class CsvComponent implements OnInit {
  public dataSet:  any[]=[];
  header!: true;
  csvArr: any[]=[];
  constructor(
    private sentiment: SentimentService,
    private dialog: MatDialog,
  ) { }
  @ViewChild('csvReader') csvReader: any;
 
   uploadListener($event: any): void {
    let text = [];
    let files = $event.srcElement.files;
    if (this.isValidCSVFile(files[0])) {
      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);
      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
        let headersRow = this.getHeaderArray(csvRecordsArray);
        this.dataSet = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
        this.sentiment.getDataFromCsV(this.dataSet);
      };
      reader.onerror = function () {
        console.log('error is occured while reading file!');
      };
    } 
    this.dialog.closeAll()
  }
  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    
    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');
      if (curruntRecord.length == headerLength) {
        let csvRecord: CsvData = new CsvData();
        csvRecord.id = curruntRecord[0].trim();
        csvRecord.min = curruntRecord[1].trim();
        csvRecord.max = curruntRecord[2].trim();
        csvRecord.sentiment = curruntRecord[3].trim();
        
        this.csvArr.push(csvRecord);
      }
    }
    
    return this.csvArr;
  }
  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }
  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray: any[]=[];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }
  ngOnInit(): void {
  }

}
