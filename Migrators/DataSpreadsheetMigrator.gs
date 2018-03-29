var DataSpreadsheetMigrator;

(function( DataSpreadsheetMigrator, undefined ) { 

  var spreadId = undefined;
  var spread = undefined;
  var spreadVersion = undefined;
  
  DataSpreadsheetMigrator.Load = function() {
    spreadId = WEDataHelper.GetDataSpreadsheetId();
    spread = SpreadsheetApp.openById(spreadId);
    
  }
  
  DataSpreadsheetMigrator.GetVersion = function(){
    spreadVersion = DriveHelper.GetVersionCell(spread);
    Logger.log("DataSpreadsheet version: "+spreadVersion);
    return spreadVersion;
  }
  
  function SetVersion(spread, version){
    DriveHelper.SetVersionCell(spread, version);
    Logger.log("DataSpreadsheet version updated to: "+version);
  }
  
  DataSpreadsheetMigrator.MigrateToVersion1 = function(){
    Logger.log("Migrating Data Spreadsheet to version 1");
    SheetHelper.CreateSheetWithColumns(spread, "Data", ["ProcessingDate", "FileId", "FileName", "TotalWordCount", "DailyWordCount"]);
    SetVersion(spread, 1);
  }
  
  DataSpreadsheetMigrator.MigrateToVersion2 = function(){
    Logger.log("Migrating Data Spreadsheet to version 2");
    SheetHelper.CreateSheetWithColumns(spread, "Processings", ["ProcessingDate"]);
    SetVersion(spread, 2);
  }
  
  DataSpreadsheetMigrator.MigrateToVersion3 = function(){
    Logger.log("Migrating Data Spreadsheet to version 3");
    var sheet = spread.getSheetByName("Data");
    sheet.insertColumnAfter(sheet.getMaxColumns());
    var lastI = sheet.getMaxColumns();
    
    var lastHeader = sheet.getRange(1, lastI);
    lastHeader.setValue("TotalCharCount");
    
    var rows = SheetHelper.GetRows(sheet);
    
    
    rows.forEach(function(item,index) { 
      var doc = DocumentApp.openById(item[1]).getText();
      var snapWords = WordCountProcessor.GetCharCount(doc);
      sheet.getRange(index+2, lastI).setValue(snapWords);
    });
    
    var newSheet = SheetHelper.CreateSheetWithColumns(spread, "LatestData", ["FileId", "FileName","LastWordCount", "LastCharCount"]);
    var trackingRows = FileTrackService.GetTrackingInfo();
    
    trackingRows.forEach(function(item,index) {
      SheetHelper.AddRow(newSheet, [item[0], DriveApp.getFileById(item[0]).getName(),item[2], item[3]]);
    });
    
    SetVersion(spread, 3);
  }
 
}( DataSpreadsheetMigrator = DataSpreadsheetMigrator || {} ));