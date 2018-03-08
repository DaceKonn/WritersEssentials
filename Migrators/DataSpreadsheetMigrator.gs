
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
    SheetHelper.CreateSheetWithColumns(spread, "Data", ["ProcessingDate", "FileId", "FileName", "TotalWordCount", "DailyWordCount"]);
    SetVersion(spread, 1);
  }
 
}( DataSpreadsheetMigrator = DataSpreadsheetMigrator || {} ));