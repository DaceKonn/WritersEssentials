
var DataSpreadsheetMigrator;

(function( DataSpreadsheetMigrator, undefined ) { 

  var spreadId = undefined;
  var spread = undefined;
  var spreadVersion = undefined;
  
  DataSpreadsheetMigrator.Load = function() {
    spreadId = WEDataHelper.DataSpreadsheetId();
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
    var sheet = spread.insertSheet("Data");
    DriveHelper.RemoveColumnsAndRows(sheet);
    sheet.insertColumnsAfter(1,4);
    
    var range = sheet.getRange(1,1,1,5);
    
    var newValues = [["ProcessingDate", "FileId", "FileName", "TotalWordCount", "DailyWordCount"]];
    range.setValues(newValues);
    range.protect().setWarningOnly(true);
    
    SetVersion(spread, 1);
  }
 
}( DataSpreadsheetMigrator = DataSpreadsheetMigrator || {} ));